import type { Answers } from "./demo";

// Order information-gathering tasks only. This is not an eligibility decision.
export function jobNextAction(answers: Answers) {
  if (!answers.employmentEnded || answers.employmentEnded === "UNKNOWN") return "employment";
  if (answers.employmentEnded === "false") return "support";
  if (!answers.insurance || answers.insurance === "UNKNOWN") return "insurance";
  // Factual circumstances are never converted to the legal classification.
  if (!answers.terminationLegal || answers.terminationLegal === "UNKNOWN") {
    if (!answers.terminationCircumstance || answers.terminationCircumstance === "UNKNOWN") return "termination";
    if (answers.insurance !== "YES") return "support";
    if (!answers.contributionMonths || answers.contributionMonths === "UNKNOWN") return "duration";
    return "preparation"; // Prepare facts for the centre to interpret, not an eligibility decision.
  }
  if (answers.terminationLegal !== "LEGAL" || answers.insurance !== "YES") return "support";
  if (!answers.contributionMonths || answers.contributionMonths === "UNKNOWN") return "duration";
  return "preparation";
}

export function jobFirstAction(answers: Answers) {
  return {employment:'Làm rõ tình trạng nghỉ việc.',insurance:'Xem lại thông tin tham gia bảo hiểm thất nghiệp.',termination:'Ghi nhận trường hợp nghỉ việc theo thông tin bạn có.',duration:'Xem lại khoảng thời gian tham gia bảo hiểm thất nghiệp mà bạn biết.',support:'Hỏi Trung tâm về hướng hỗ trợ cho trường hợp của bạn.',preparation:'Chuẩn bị thông tin để Trung tâm đối chiếu.'}[jobNextAction(answers)];
}
