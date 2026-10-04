import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { addCalendarMonths, analysisSummary, dataset, housingOpportunity, jobDemoResult, opportunityStatus, sampleAnswers, source } from "../lib/demo";

test("sample suggests checking policy and retains unresolved eligibility conditions", () => {
  const result = jobDemoResult(sampleAnswers);
  assert.equal(result.status, "POSSIBLE_MATCH");
  assert.ok(result.signals.every((s) => s.met));
  assert.match(result.missing, /Cần kiểm tra thêm/);
});

test("four-question manual flow never derives contribution months from insurance YES", () => {
  const { contributionMonths: _months, ...manualAnswers } = sampleAnswers;
  assert.equal(manualAnswers.insurance, "YES");
  assert.equal(jobDemoResult(manualAnswers).status, "NEED_MORE_INFO");
});
test("unknown, negative, expired and future answers never produce a positive demo status", () => {
  for (const change of [{ insurance: "UNKNOWN" }, { insurance: "NO" }, { contributionMonths: "UNKNOWN" },
    { employmentEnded: "false" }, { terminationDate: "UNKNOWN" }, { terminationDate: "2026-01-01" }, { terminationDate: "2026-12-01" }]) {
    assert.equal(jobDemoResult({ ...sampleAnswers, ...change }).status, "NEED_MORE_INFO");
  }
  assert.equal(jobDemoResult({}).status, "NEED_MORE_INFO");
});
test("calendar arithmetic clamps month ends", () => {
  assert.equal(addCalendarMonths("2026-01-31", 1), "2026-02-28");
  assert.equal(addCalendarMonths("2028-01-31", 1), "2028-02-29");
});
test("purchase opportunity is time aware and never routed to rental or lodging", () => {
  const opportunity = housingOpportunity("BUY")!;
  assert.equal(opportunityStatus(opportunity), "SCHEDULED");
  assert.equal(opportunityStatus(opportunity, "2026-10-25"), "OPEN");
  assert.equal(opportunityStatus(opportunity, "2026-11-30"), "OPEN");
  assert.equal(opportunityStatus(opportunity, "2026-12-01"), "CLOSED");
  assert.equal(housingOpportunity("RENT"), undefined);
  assert.equal(housingOpportunity("WORKER_LODGING"), undefined);
});
test("every recommendation source resolves and approved portal anomaly is preserved", () => {
  for (const item of dataset.policies) assert.ok(source(item.legal_source_id));
  for (const item of [...dataset.services, ...dataset.opportunities]) assert.ok(source(item.source_id));
  assert.match(source("SRC_JOB_DN_001").canonical_url, /so-xay-dung/);
  assert.equal(source("SRC_JOB_DN_001").verification_status, "VERIFIED_OFFICIAL");
});
test("generated snapshot still matches original CSV bytes", () => {
  for (const [file, hash] of Object.entries(dataset.provenance.fileHashes)) {
    const bytes = readFileSync(new URL(`../../../data/${file}`, import.meta.url));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), hash, file);
  }
});

test("analysis shows unknown and negative facts without confirmed checkmarks", () => {
  const unknown = analysisSummary("JOB_LOSS", {});
  assert.ok(unknown.conditions.every((fact) => !fact.met));
  assert.ok(unknown.conditions.some((fact) => fact.text.includes("Cần xác minh")));
  const negative = analysisSummary("JOB_LOSS", { employmentEnded: "false", insurance: "NO", goal: "TRAINING" });
  assert.deepEqual(negative.conditions.map((fact) => fact.met), [false, false, true]);
  assert.equal(negative.conditions[1].text, "Không tham gia BHTN");
  assert.ok(analysisSummary("JOB_LOSS", sampleAnswers).conditions.every((fact) => fact.met));
});

test("analysis retains the chosen housing and child policy branches", () => {
  assert.match(analysisSummary("HOUSING_DIFFICULTY", { housingIntent: "RENT" }).policy, /thuê/);
  assert.match(analysisSummary("HAS_CHILD", { childContext: "MALE" }).policy, /nam/);
  assert.match(analysisSummary("HAS_CHILD", { childContext: "PRESCHOOL" }).policy, /mầm non/);
});
