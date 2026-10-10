import data from "./demo-data.json";

export const dataset = data;
export type Journey = "JOB_LOSS" | "HOUSING_DIFFICULTY" | "HAS_CHILD";
export type Screen = "home" | "questions" | "analysis" | "results" | "plan";
export type Status = "POSSIBLE_MATCH" | "NEED_MORE_INFO";
export type Opportunity = (typeof data.opportunities)[number];
export type Answers = {
  employmentEnded?: string; terminationDate?: string; employmentRecency?: string; insurance?: string; contributionMonths?: string; goal?: string; terminationLegal?: string; terminationCircumstance?: string;
  housingIntent?: string; ownsHouse?: string; incomeRange?: string; applicantGroup?: string;
  housingBudget?: string; householdSize?: string; housingHasChild?: string; housingArea?: string;
  childContext?: string; childAge?: string;
  childStage?: string; childParent?: string; childBorn?: string; childInsuranceKnown?: string;
  childNeed?: string; childAdminStatus?: string; childcareNeed?: string;
  childAdminMissing?: string; childNextNeed?: string;
  childcareAge?: string; childcareArea?: string; childcareBudget?: string; childcarePickup?: string;
};
export const snapshotDate = data.provenance.snapshotDate;
export const disclaimer = "Dựa trên thông tin bạn cung cấp, bạn có thể thuộc nhóm cần kiểm tra chính sách này. Quyết định cuối cùng do cơ quan có thẩm quyền xác nhận.";
export const sampleAnswers: Answers = {
  employmentEnded: "true", terminationDate: "2026-09-15", insurance: "YES", contributionMonths: "12", goal: "BOTH",
};
export const journeySlugs: Record<Journey, string> = { JOB_LOSS: "jobloss", HOUSING_DIFFICULTY: "housing", HAS_CHILD: "child" };
export const journeyFromSlug = (value: string | null): Journey =>
  value === "housing" ? "HOUSING_DIFFICULTY" : value === "child" ? "HAS_CHILD" : "JOB_LOSS";
export function policy(id: string) {
  const result = data.policies.find((p) => p.policy_id === id);
  if (!result) throw new Error(`Unknown dataset policy: ${id}`);
  return result;
}
export function service(id: string) {
  const result = data.services.find((s) => s.service_id === id);
  if (!result) throw new Error(`Unknown dataset service: ${id}`);
  return result;
}
export function source(id: string) {
  const result = data.sources.find((s) => s.source_id === id);
  if (!result) throw new Error(`Unknown dataset source: ${id}`);
  return result;
}
export const profile = (name: string) => data.profileFields.find((p) => p.field_name === name)!;
export const formatDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date) ? date.split("-").reverse().join("/") : date;

// A small, explicit competition scenario. This does not interpret the rule dataset or decide eligibility.
// Numeric parameters and citations are read from existing IDs rather than inventing new thresholds.
export function jobDemoResult(answers: Answers, evaluationDate = snapshotDate) {
  const monthsRule = data.policyRules.find((r) => r.rule_id === "PR_JOB_005")!;
  const deadlineRule = data.policyRules.find((r) => r.rule_id === "PR_JOB_008")!;
  const sufficientMonths = answers.contributionMonths !== "UNKNOWN" && Number(answers.contributionMonths) >= Number(monthsRule.value);
  const recentDate = !!answers.terminationDate && answers.terminationDate <= evaluationDate &&
    evaluationDate <= addCalendarMonths(answers.terminationDate, Number(deadlineRule.value));
  const hasDemoSignals = answers.employmentEnded === "true" && answers.insurance === "YES" && sufficientMonths && recentDate;
  return {
    status: (hasDemoSignals ? "POSSIBLE_MATCH" : "NEED_MORE_INFO") as Status,
    signals: [
      { text: "Bạn vừa chấm dứt việc làm", met: answers.employmentEnded === "true" },
      { text: "Có tham gia bảo hiểm thất nghiệp", met: answers.insurance === "YES" },
      { text: "Thời gian đóng BHTN đạt ngưỡng demo", met: sufficientMonths },
    ],
    missing: hasDemoSignals ? "Cần kiểm tra thêm loại hợp đồng, lý do chấm dứt, lương hưu và các trường hợp loại trừ." :
      "Cần bổ sung hoặc đối chiếu thông tin trước khi xác định điều kiện. Bạn vẫn có thể tìm dịch vụ tư vấn chính thức.",
  };
}

export function addCalendarMonths(isoDate: string, months: number) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const target = new Date(Date.UTC(year, month - 1 + months, 1));
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, last));
  return target.toISOString().slice(0, 10);
}

export function opportunityStatus(opportunity: Opportunity, evaluationDate = snapshotDate) {
  if (opportunity.status === "ACTIVE_RECURRING" || opportunity.status === "NEED_REVIEW" || opportunity.status === "CLOSED") return opportunity.status;
  if (!opportunity.open_from || !opportunity.open_until) return "NEED_REVIEW";
  if (evaluationDate < opportunity.open_from) return "SCHEDULED";
  if (evaluationDate > opportunity.open_until) return "CLOSED";
  return "OPEN";
}

export function housingOpportunity(intent: string | undefined) {
  // The purchase round is never presented as a rental opportunity.
  return intent === "BUY" ? data.opportunities.find((o) => o.opportunity_id === "OPP_HOUSE_001") : undefined;
}

// Presentation facts for the short analysis sequence, never an eligibility decision.
export function analysisSummary(journey: Journey, answers: Answers) {
  if (journey === "JOB_LOSS") return {
    situation: "Tôi vừa mất việc",
    conditions: [
      { text: answers.employmentEnded === "true" ? "Đã chấm dứt việc làm" : answers.employmentEnded === "false" ? "Việc làm chưa kết thúc" : "Chưa rõ tình trạng việc làm", met: answers.employmentEnded === "true" },
      { text: answers.insurance === "YES" ? "Có tham gia BHTN" : answers.insurance === "NO" ? "Không tham gia BHTN" : "Cần xác minh BHTN", met: answers.insurance === "YES" },
      { text: answers.goal === "JOB" || answers.goal === "BOTH" ? "Muốn tìm việc mới" : answers.goal === "TRAINING" ? "Muốn học nghề / nâng kỹ năng" : "Cần làm rõ nhu cầu tiếp theo", met: ["JOB", "BOTH", "TRAINING"].includes(answers.goal ?? "") },
    ],
    policy: policy("POL_JOB_001").policy_name,
    service: service("JOB_SV_006").service_name,
    action: "Chuẩn bị hồ sơ / tìm việc / kiểm tra đào tạo",
  };
  if (journey === "HOUSING_DIFFICULTY") return {
    situation: "Tôi đang khó khăn về nhà ở",
    conditions: [{ text: answers.housingIntent === "BUY" ? "Nhu cầu mua nhà ở xã hội" : answers.housingIntent === "RENT" ? "Nhu cầu thuê nhà ở xã hội" : answers.housingIntent === "WORKER_LODGING" ? "Nhu cầu nhà lưu trú công nhân" : "Cần làm rõ loại hình nhà ở", met: ["BUY", "RENT", "WORKER_LODGING"].includes(answers.housingIntent ?? "") }],
    policy: policy(answers.housingIntent === "RENT" ? "POL_HOUSE_002" : answers.housingIntent === "WORKER_LODGING" ? "POL_HOUSE_003" : "POL_HOUSE_001").policy_name,
    service: service("HOUSE_SV_001").service_name,
    action: "Kiểm tra điều kiện / theo dõi đợt tiếp nhận",
  };
  return {
    situation: "Tôi có con nhỏ",
    conditions: [{ text: answers.childContext === "FEMALE" ? "Lao động nữ vừa sinh con" : answers.childContext === "MALE" ? "Lao động nam có vợ vừa sinh con" : answers.childContext === "PRESCHOOL" ? "Tìm hỗ trợ mầm non" : "Cần xác minh hoàn cảnh gia đình", met: ["FEMALE", "MALE", "PRESCHOOL"].includes(answers.childContext ?? "") }],
    policy: policy(answers.childContext === "PRESCHOOL" ? "POL_CHILD_004" : answers.childContext === "MALE" ? "POL_CHILD_002" : "POL_CHILD_001").policy_name,
    service: service(answers.childContext === "PRESCHOOL" ? "CHILD_SV_004" : "CHILD_SV_003").service_name,
    action: "Kiểm tra chính sách / chuẩn bị giấy tờ cho gia đình",
  };
}
