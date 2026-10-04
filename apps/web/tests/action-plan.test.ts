import { test } from "node:test";
import assert from "node:assert/strict";
import { jobNextAction } from "../lib/action-plan";
import { sampleAnswers } from "../lib/demo";

test("an empty or unresolved employment answer comes before preparation", () => {
  assert.equal(jobNextAction({}), "employment");
  assert.equal(jobNextAction({ ...sampleAnswers, employmentEnded: "UNKNOWN" }), "employment");
  assert.equal(jobNextAction({ ...sampleAnswers, terminationDate: "UNKNOWN" }), "date");
});
test("unknown termination declaration remains unresolved", () => {
  assert.equal(jobNextAction(sampleAnswers), "termination");
  assert.equal(jobNextAction({ ...sampleAnswers, terminationLegal: "UNKNOWN" }), "termination");
});
test("insurance participation and duration are separate tasks", () => {
  const answers = { ...sampleAnswers, terminationLegal: "LEGAL" };
  assert.equal(jobNextAction({ ...answers, insurance: "UNKNOWN" }), "insurance");
  assert.equal(jobNextAction({ ...answers, contributionMonths: undefined }), "duration");
  assert.equal(jobNextAction({ ...answers, contributionMonths: "UNKNOWN" }), "duration");
  assert.equal(jobNextAction(answers), "preparation");
});
test("negative facts lead to support, without an eligibility decision or invented threshold", () => {
  assert.equal(jobNextAction({ ...sampleAnswers, employmentEnded: "false" }), "support");
  assert.equal(jobNextAction({ ...sampleAnswers, terminationLegal: "UNLAWFUL" }), "support");
  assert.equal(jobNextAction({ ...sampleAnswers, terminationLegal: "LEGAL", insurance: "NO" }), "support");
  assert.equal(jobNextAction({ ...sampleAnswers, terminationLegal: "LEGAL", contributionMonths: "0" }), "preparation");
});
