import { test } from "node:test";
import assert from "node:assert/strict";
import { dataset } from "../lib/demo";
import { situationFacts } from "../lib/presentation";

test("empty housing state does not claim ownership, income or group", () => {
  assert.deepEqual(situationFacts("HOUSING_DIFFICULTY", {}), []);
});
test("income range remains a range and never becomes an exact income", () => {
  assert.deepEqual(situationFacts("HOUSING_DIFFICULTY", { incomeRange: "<=25M" }), ["Thu nhập không quá 25 triệu / tháng"]);
});
test("group selection preserves existing domain and is explicitly self reported", () => {
  const field = dataset.profileFields.find((item) => item.field_name === "applicant_group")!;
  assert.equal(field.allowed_values, "ARTICLE76_6_WORKER|OTHER|UNKNOWN");
  for (const value of field.allowed_values.split("|")) {
    const facts = situationFacts("HOUSING_DIFFICULTY", { applicantGroup: value });
    assert.equal(facts.length, 1);
    assert.doesNotMatch(facts[0], /đủ điều kiện|được hưởng/);
  }
});
test("rental and negative answers do not imply purchase, income or insurance participation", () => {
  assert.deepEqual(situationFacts("HOUSING_DIFFICULTY", { housingIntent: "RENT" }), ["Đang tìm thuê nhà ở xã hội"]);
  assert.deepEqual(situationFacts("JOB_LOSS", { insurance: "NO" }), ["Không tham gia BHTN"]);
});
