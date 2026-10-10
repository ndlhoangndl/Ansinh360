import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { jobPrimaryQuestions, jobDemoAnswers, jobConfirmedFacts, jobBenefitDirection, rankJobDirections } from "../lib/job-journey";
import { jobNextAction } from "../lib/action-plan";
import { resolveDemoEntry } from "../lib/demo-entry";
import { jobOpportunities } from "../lib/competition-demo";
import { JobResults } from "../components/job-results";
import { JobActionPlan } from "../components/job-action-plan";
import { JobOpportunityCards } from "../components/job-opportunities";

test("four primary questions collect no exact date or inferred insurance duration", () => {
  assert.deepEqual(jobPrimaryQuestions.map((question) => question.key), ["employmentEnded", "insurance", "employmentRecency", "goal"]);
  assert.equal(jobPrimaryQuestions[3].options.find((option) => option.value === jobDemoAnswers.goal)?.label, "Tôi muốn làm cả hai");
  assert.equal(jobDemoAnswers.terminationDate, undefined);
  assert.equal(jobDemoAnswers.contributionMonths, undefined);
  assert.equal(resolveDemoEntry(new URLSearchParams("demo=jobloss"), null).screen, "questions");
});

test("confirmed summary omits unknown answers and does not infer a resignation date", () => {
  assert.equal(jobConfirmedFacts(jobDemoAnswers).length, 4);
  assert.deepEqual(jobConfirmedFacts({ employmentEnded: "UNKNOWN", insurance: "UNKNOWN", employmentRecency: "UNKNOWN", terminationLegal: "UNKNOWN" }), []);
  assert.doesNotMatch(jobConfirmedFacts({ employmentEnded: "false", employmentRecency: "RECENT" }).join(" "), /Nghỉ việc gần đây/);
});

test("termination confirmation does not unexpectedly worsen the indicative badge", () => {
  assert.equal(jobBenefitDirection(jobDemoAnswers).badge, "Có dấu hiệu phù hợp");
  assert.equal(jobBenefitDirection({ ...jobDemoAnswers, terminationLegal: "LEGAL" }).badge, "Có dấu hiệu phù hợp");
  assert.equal(jobBenefitDirection({ ...jobDemoAnswers, insurance: "UNKNOWN" }).badge, "Cần kiểm tra thêm");
  assert.match(jobBenefitDirection(jobDemoAnswers).explanation, /chưa xác nhận bạn được hưởng/);
});

test("plan prioritizes missing insurance, then reason, and never requires the same known fact", () => {
  assert.equal(jobNextAction(jobDemoAnswers), "termination");
  assert.equal(jobNextAction({ ...jobDemoAnswers, insurance: "UNKNOWN" }), "insurance");
  assert.equal(jobNextAction({ ...jobDemoAnswers, terminationLegal: "LEGAL" }), "duration");
  assert.equal(jobNextAction({ ...jobDemoAnswers, terminationLegal: "LEGAL", contributionMonths: "12" }), "preparation");
});

test("rendered demo result has two tracks, one missing priority and an internal job CTA", () => {
  const html = renderToStaticMarkup(createElement(JobResults, { answers: jobDemoAnswers, onPlan: () => {}, onSupport: () => {} }));
  assert.match(html, /Bạn có 2 việc nên làm song song/);
  assert.match(html, /ỔN ĐỊNH TRƯỚC MẮT/); assert.match(html, /QUAY LẠI THU NHẬP/);
  assert.match(html, /Lý do chấm dứt việc làm/);
  assert.match(html, /<button[^>]*>Xem việc phù hợp/);
  assert.doesNotMatch(html, /next-paths|Xem cách thực hiện/);
});

test("rendered known-reason plan replaces the missing-reason first action", () => {
  const html = renderToStaticMarkup(createElement(JobActionPlan, { answers: { ...jobDemoAnswers, terminationCircumstance: "CONTRACT_EXPIRED" }, checked: [], onToggle: () => {}, onAnswer: () => {}, onIncomePath: () => {}, onSupport: () => {} }));
  assert.doesNotMatch(html, /<h2>Xác nhận lý do nghỉ việc<\/h2>/);
  assert.match(html, /Đã ghi nhận lý do nghỉ việc/);
  assert.match(html, /Thông tin liên hệ cơ bản/);
  assert.doesNotMatch(html, /type="file"|type="date"|name="cccd"/);
});

test("presentation ranking uses exactly three fixtures and changes order by preferences", () => {
  const rows = rankJobDirections({ occupation: "WAREHOUSE", area: "LIEN_CHIEU", shift: "DAY" });
  assert.deepEqual(new Set(rows.map((row) => row.opportunity.id)), new Set(jobOpportunities.map((item) => item.id)));
  assert.equal(rows.length, 3); assert.equal(rows[0].opportunity.id, "DEMO_JOB_002");
  const unmatched = rankJobDirections({ occupation: "OFFICE", area: "OTHER", shift: "UNKNOWN" });
  assert.ok(unmatched.every((row) => row.score === 0 && row.reasons[0].includes("chưa sát")));
});

test("rendered opportunity cards have verify-first labels and no immediate application CTA", () => {
  const directions = rankJobDirections({ occupation: "PRODUCTION", area: "HOA_KHANH", shift: "SHIFT" });
  const html = renderToStaticMarkup(createElement(JobOpportunityCards, { directions }));
  assert.equal((html.match(/data-opportunity-id=/g) ?? []).length, 3);
  assert.equal((html.match(/Gợi ý hướng công việc/g) ?? []).length, 3);
  assert.equal((html.match(/Tìm tin đang tuyển cho công việc này/g) ?? []).length, 3);
  assert.doesNotMatch(html, /Ứng tuyển ngay/);
});

test("reset entry discards demo context before another manual journey", () => {
  const root = resolveDemoEntry(new URLSearchParams(), null);
  assert.equal(root.screen, "home"); assert.equal(root.demoMode, false);
  assert.equal(resolveDemoEntry(new URLSearchParams("journey=jobloss&screen=plan"), null).screen, "home");
});
