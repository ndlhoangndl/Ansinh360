import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { housingBudgetCeilings, rankHousingOptions, housingPlanSteps } from '../lib/housing-journey';
import { housingOpportunities, childcareOpportunities } from '../lib/competition-demo';
import { childConfirmedFacts, childPlanSteps } from '../lib/child-journey';
import { jobNextAction } from '../lib/action-plan';
import { terminationCircumstances } from '../lib/job-journey';
import { officialDestination } from '../lib/official-destinations';
import { plainLanguage } from '../lib/public-copy';
import { isConcreteOpportunity } from '../lib/opportunity-grounding';
import { service, type Answers } from '../lib/demo';
import { HousingResultsV2 } from '../components/housing-journey';
import { ChildcareCards, ChildSummary, ChildSupportSummary } from '../components/child-journey';
import { JobServiceHandoff } from '../components/job-service-handoff';
import { SourceDisclosure } from '../components/source-badge';
const noop=()=>{};
const render=(node:ReturnType<typeof createElement>)=>renderToStaticMarkup(node);

test('three-person households always rank capacity-feasible directions before cheap two-person directions',()=>{
  for(const budget of ['UNDER_2M','2_3M','3_5M','OVER_5M','UNKNOWN']) {
    const rows=rankHousingOptions({householdSize:'3',housingBudget:budget,housingArea:'HOA_KHANH'});
    assert.ok(rows[0].capacity);
    assert.equal(rows.at(-1)!.capacityMismatch,true);
  }
});
test('housing ceilings include two, three and five million; cheaper is never a negative mismatch',()=>{
  assert.deepEqual(housingBudgetCeilings,{UNDER_2M:2000000,'2_3M':3000000,'3_5M':5000000});
  for(const [budget,ceiling] of Object.entries(housingBudgetCeilings)) {
    for(const max of [ceiling-1,ceiling,ceiling+1]) {
      const row=rankHousingOptions({housingBudget:budget},[{...housingOpportunities[0],budgetRangeVnd:{min:0,max}}])[0];
      assert.equal(row.budgetFull,max<=ceiling);
      assert.equal(row.overBudget,max>ceiling);
      assert.equal(row.belowBudget,false);
      if(row.overBudget) assert.ok(!row.reasons.includes('Không vượt ngân sách bạn chọn'));
    }
  }
  assert.ok(rankHousingOptions({housingBudget:'2_3M'})[0].reasons.includes('Không vượt ngân sách bạn chọn'));
  assert.ok(rankHousingOptions({housingBudget:'OVER_5M'}).every(r=>!r.budgetFull&&!r.overBudget));
});
test('no feasible capacity warns before the list and mismatch remains outside collapsed details',()=>{
  const html=render(createElement(HousingResultsV2,{answers:{householdSize:'3'},items:[housingOpportunities[0]],onPlan:noop,onSupport:noop,onChild:noop}));
  assert.match(html,/Chưa có phương án nào trong dữ liệu hiện tại đáp ứng đủ số người ở/);
  assert.match(html,/Phương án gần nhất để tham khảo/);
  assert.ok(html.indexOf('⚠ Chưa đáp ứng đủ số người ở')<html.indexOf('<details><summary>Xem điều cần xác nhận'));
});
test('generic housing has one honest section disclosure and a visible real fallback',()=>{
  const html=render(createElement(HousingResultsV2,{answers:{},onPlan:noop,onSupport:noop,onChild:noop}));
  assert.equal((html.match(/AN SINH 360 chưa có tin phòng cụ thể đã được xác minh/g)||[]).length,1);
  assert.match(html,/Chưa có đầu mối phòng trọ cụ thể|href="tel:1022"|Khoảng tham khảo/);
  assert.doesNotMatch(html,/href="[^"]*chi-tiet\/hieu-qua-buoc/);
  assert.match(html,/<details class="housing-history"><summary>Các đợt trước đây/);
});
test('social housing plan selects type then intake then agency then paperwork',()=>{
  assert.deepEqual(housingPlanSteps({housingIntent:'RENT'}).map(s=>s.title),['Xác định loại hình bạn cần','Xem đợt đang hoặc sắp mở','Xem cơ quan / đầu mối được nêu trong thông báo','Chỉ chuẩn bị hồ sơ sau khi đã chọn đúng đợt']);
});
test('completed under-six admin is retained as history, never as current priority after childcare selection',()=>{
  const answers:Answers={childStage:'UNDER_6',childNeed:'DOCUMENTS',childAdminStatus:'ALL_DONE',childNextNeed:'CARE'};
  const facts=childConfirmedFacts(answers).join(' ');
  assert.match(facts,/Ưu tiên: Tìm nơi chăm sóc trẻ/);
  assert.doesNotMatch(facts,/Ưu tiên: Kiểm tra giấy tờ/);
  for(const component of [ChildSummary,ChildSupportSummary]) assert.match(render(createElement(component,{answers})),/Ưu tiên: Tìm nơi chăm sóc trẻ/);
});
test('generic childcare begins with choosing a type then finding a real facility through 1022',()=>{
  const answers:Answers={childStage:'PRESCHOOL'};
  const steps=childPlanSteps(answers);
  assert.equal(steps[0].title,'Xác định loại cơ sở phù hợp');
  assert.equal(steps[1].title,'Tìm cơ sở thực tế trong khu vực');
  assert.match(steps[1].where,/Gọi 1022/);
  assert.doesNotMatch(JSON.stringify(steps),/Chọn 1–2 nơi đáng liên hệ/);
  const html=render(createElement(ChildcareCards,{answers}));
  assert.equal((html.match(/Chưa có cơ sở cụ thể đã được xác minh trong dữ liệu hiện tại/g)||[]).length,1);
  assert.match(html,/Khoảng tham khảo: 0[67]:|href="tel:1022"/);
});
test('a childcare facility needs verified name, address, source and date, never an editing date',()=>{
  const record={...childcareOpportunities[0],provenance:'VERIFIED_PROJECT' as const,facilityName:'Test-only facility',exactAddress:'Test-only address',sourceName:'Test-only source',sourceUrl:'https://example.org/test-only',verifiedAt:'2026-10-10'};
  assert.equal(isConcreteOpportunity(record),true);
  for(const key of ['facilityName','exactAddress','sourceName','sourceUrl','verifiedAt'] as const) assert.equal(isConcreteOpportunity({...record,[key]:undefined}),false);
  assert.ok(childcareOpportunities.every(o=>!isConcreteOpportunity(o)));
  const html=render(createElement(ChildcareCards,{answers:{childStage:'PRESCHOOL'},items:[record]}));
  assert.match(html,/Test-only facility|Test-only address|2026-10-10|Mở nguồn \/ Liên hệ cơ sở/);
  assert.doesNotMatch(html,/Chưa có cơ sở cụ thể đã được xác minh trong dữ liệu hiện tại/);
});
test('factual termination options never become a legal classification',()=>{
  assert.deepEqual(terminationCircumstances.map(o=>o.label),['Hết hạn hợp đồng','Hai bên thỏa thuận chấm dứt','Doanh nghiệp cho nghỉ / chấm dứt hợp đồng','Tôi chủ động nghỉ','Tôi chưa rõ']);
  for(const option of terminationCircumstances.filter(o=>o.value!=='UNKNOWN')) {
    const answers:Answers={employmentEnded:'true',insurance:'YES',terminationCircumstance:option.value};
    assert.equal(jobNextAction(answers),'duration');
    assert.equal(answers.terminationLegal,undefined);
    assert.equal(jobNextAction({...answers,contributionMonths:'12'}),'preparation');
  }
});
test('procedure CTA and source disclosure no longer point to known broken national paths; centre survives',()=>{
  const html=render(createElement(JobServiceHandoff,{procedure:true}));
  for(const text of ['Tra cứu thủ tục chính thức','278 Âu Cơ','0236 3740260','tel:02363740260']) assert.ok(html.includes(text));
  assert.match(html,/href="https:\/\/dichvucong.gov.vn\/"/);
  assert.doesNotMatch(html,/href="[^"]*\/p\/home\//);
  const sources=render(createElement(SourceDisclosure,{entries:[{id:service('JOB_SV_001').source_id},{id:service('GEN_SV_004').source_id}]}));
  assert.doesNotMatch(sources,/href="[^"]*(?:\/p\/home\/|chi-tiet\/hieu-qua-buoc)/);
  assert.equal(officialDestination(service('CHILD_SV_001').online_url),'https://dichvucong.gov.vn/');
});
test('primary display terms are expanded without changing source data or URLs',()=>{
  assert.doesNotMatch(plainLanguage('NOXH GDMN KCN BHYT BHXH BHTN'),/\b(?:NOXH|GDMN|KCN|BHYT|BHXH|BHTN)\b/);
});
