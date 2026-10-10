export const terminationCircumstances = [
  {value:'CONTRACT_EXPIRED',label:'Hết hạn hợp đồng'},
  {value:'MUTUAL_AGREEMENT',label:'Hai bên thỏa thuận chấm dứt'},
  {value:'EMPLOYER_ENDED',label:'Doanh nghiệp cho nghỉ / chấm dứt hợp đồng'},
  {value:'SELF_INITIATED',label:'Tôi chủ động nghỉ'},
  {value:'UNKNOWN',label:'Tôi chưa rõ'},
] as const;

import type { Answers } from "./demo";
import { jobOpportunities, type DemoJobOpportunity } from "./competition-demo";

export const jobDemoAnswers: Answers = {
  employmentEnded: "true", insurance: "YES", employmentRecency: "RECENT", goal: "BOTH",
};

export const jobPrimaryQuestions: { key: keyof Answers; title: string; hint: string; explanation?: string; options: { value: string; label: string }[] }[] = [
  { key: "employmentEnded", title: "Bạn đã chấm dứt việc làm chưa?", hint: "Chọn câu trả lời gần nhất với trường hợp của bạn.", options: [{ value: "true", label: "Đã nghỉ việc" }, { value: "false", label: "Chưa nghỉ hẳn" }, { value: "UNKNOWN", label: "Không rõ trường hợp của tôi" }] },
  { key: "insurance", title: "Khi nghỉ việc, bạn có tham gia bảo hiểm thất nghiệp không?", hint: "", explanation: "Thông tin này giúp xác định hướng quyền lợi nào nên kiểm tra trước. AN SINH 360 không tự quyết định bạn có được hưởng hay không.", options: [{ value: "YES", label: "Có" }, { value: "NO", label: "Không" }, { value: "UNKNOWN", label: "Không rõ" }] },
  { key: "employmentRecency", title: "Bạn nghỉ việc gần đây phải không?", hint: "Chỉ cần chọn khoảng thời gian gần nhất; chưa cần nhập ngày chính xác.", options: [{ value: "RECENT", label: "Có" }, { value: "EARLIER", label: "Đã một thời gian" }, { value: "UNKNOWN", label: "Không nhớ rõ" }] },
  { key: "goal", title: "Lúc này bạn muốn ưu tiên điều gì?", hint: "Chọn hướng bạn muốn bắt đầu; hai việc có thể làm song song.", options: [{ value: "SUPPORT", label: "Kiểm tra hỗ trợ trong thời gian chưa có việc" }, { value: "JOB", label: "Tìm việc mới càng sớm càng tốt" }, { value: "BOTH", label: "Tôi muốn làm cả hai" }] },
];

export function jobConfirmedFacts(answers: Answers) {
  const facts: string[] = [];
  if (answers.employmentEnded === "true") facts.push("Đã nghỉ việc");
  if (answers.employmentEnded === "false") facts.push("Chưa nghỉ hẳn");
  if (answers.insurance === "YES") facts.push("Có tham gia bảo hiểm thất nghiệp");
  if (answers.insurance === "NO") facts.push("Không tham gia bảo hiểm thất nghiệp");
  if (answers.employmentEnded === "true" && answers.employmentRecency === "RECENT") facts.push("Nghỉ việc gần đây");
  if (answers.employmentEnded === "true" && answers.employmentRecency === "EARLIER") facts.push("Đã nghỉ việc một thời gian");
  const circumstance=terminationCircumstances.find(item=>item.value===answers.terminationCircumstance);
  if(circumstance && circumstance.value!=="UNKNOWN") facts.push(`Trường hợp nghỉ việc: ${circumstance.label}`);
  if (answers.goal === "BOTH") facts.push("Muốn vừa kiểm tra hỗ trợ vừa tìm việc");
  if (answers.goal === "SUPPORT") facts.push("Ưu tiên kiểm tra hỗ trợ khi chưa có việc");
  if (answers.goal === "JOB") facts.push("Ưu tiên tìm việc mới sớm");
  return facts;
}

export function jobBenefitDirection(answers: Answers) {
  // Broad direction from self-reported facts, never a legal eligibility result.
  const positive = answers.employmentEnded === "true" && answers.insurance === "YES" &&
    answers.employmentRecency === "RECENT" && answers.terminationLegal !== "UNLAWFUL" && answers.terminationLegal !== "UNKNOWN";
  return {
    badge: positive ? "Có dấu hiệu phù hợp" : "Cần kiểm tra thêm",
    explanation: "Đây là hướng quyền lợi để hỏi và đối chiếu; chưa xác nhận bạn được hưởng. Thời gian đóng, ngày nghỉ chính xác và các điều kiện khác vẫn cần nơi tiếp nhận kiểm tra.",
    reasons: [
      ...(answers.employmentEnded === "true" ? ["Bạn đã chấm dứt việc làm"] : []),
      ...(answers.insurance === "YES" ? ["Bạn cho biết có tham gia bảo hiểm thất nghiệp"] : []),
      ...(answers.employmentEnded === "true" && answers.employmentRecency === "RECENT" ? ["Bạn vừa rơi vào giai đoạn chưa có việc"] : []),
    ],
  };
}

export type JobPreference = { occupation: string; area: string; shift: string };
export const jobPreferenceQuestions = [
  { key: "occupation", title: "Trước đây bạn làm công việc gì?", options: [["PRODUCTION", "Sản xuất"], ["WAREHOUSE", "Kho vận"], ["SALES", "Bán hàng / dịch vụ"], ["OFFICE", "Văn phòng"], ["OTHER", "Khác"]] },
  { key: "area", title: "Bạn muốn làm gần khu vực nào?", options: [["HOA_KHANH", "Hòa Khánh"], ["LIEN_CHIEU", "Liên Chiểu"], ["OTHER", "Khu vực khác tại Đà Nẵng"], ["ANY", "Không quá quan trọng"]] },
  { key: "shift", title: "Bạn phù hợp với lịch làm việc nào?", options: [["DAY", "Giờ hành chính"], ["SHIFT", "Theo ca"], ["FLEXIBLE", "Linh hoạt"], ["UNKNOWN", "Chưa rõ"]] },
] as const;

const fixtureTraits: Record<string, JobPreference> = {
  DEMO_JOB_001: { occupation: "PRODUCTION", area: "HOA_KHANH", shift: "SHIFT" },
  DEMO_JOB_002: { occupation: "WAREHOUSE", area: "LIEN_CHIEU", shift: "DAY" },
  DEMO_JOB_003: { occupation: "SALES", area: "HOA_KHANH", shift: "SHIFT" },
};

export function rankJobDirections(preference: JobPreference): { opportunity: DemoJobOpportunity; reasons: string[]; score: number }[] {
  // Sort only these three illustrative fixtures; no vacancies or eligibility are inferred.
  return jobOpportunities.map((opportunity) => {
    const traits = fixtureTraits[opportunity.id];
    const reasons: string[] = [];
    let score = 0;
    if (preference.occupation === traits.occupation) { score += 3; reasons.push("Cùng hướng công việc bạn từng làm."); }
    if (preference.area === traits.area) { score += 2; reasons.push("Trong khu vực bạn muốn tìm việc."); }
    if (preference.shift === traits.shift) { score += 1; reasons.push("Lịch tham khảo gần lựa chọn của bạn; cần hỏi lại ca thực tế."); }
    if (!reasons.length) reasons.push("Hướng để tìm hiểu thêm; chưa sát các lựa chọn bạn cung cấp.");
    return { opportunity, reasons, score };
  }).sort((a, b) => b.score - a.score);
}
