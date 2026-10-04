import type { Answers } from "./demo";

// Order information-gathering tasks only. This is not an eligibility decision.
export function jobNextAction(answers: Answers) {
  if (!answers.employmentEnded || answers.employmentEnded === "UNKNOWN") return "employment";
  if (answers.employmentEnded === "false") return "support";
  if (!answers.terminationDate || answers.terminationDate === "UNKNOWN") return "date";
  if (!answers.terminationLegal || answers.terminationLegal === "UNKNOWN") return "termination";
  if (!answers.insurance || answers.insurance === "UNKNOWN") return "insurance";
  if (answers.terminationLegal !== "LEGAL" || answers.insurance !== "YES") return "support";
  if (!answers.contributionMonths || answers.contributionMonths === "UNKNOWN") return "duration";
  return "preparation";
}
