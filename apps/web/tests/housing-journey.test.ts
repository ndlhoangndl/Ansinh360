import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { housingPrimaryQuestions, housingConfirmedFacts, rankHousingOptions, housingRoundPresentation, housingPlanSteps, housingSupportDirections } from '../lib/housing-journey';
import { housingOpportunities } from '../lib/competition-demo';
import { dataset, type Answers } from '../lib/demo';
import { resolveDemoEntry } from '../lib/demo-entry';
import { HousingResultsV2, HousingSupportSummary } from '../components/housing-journey';

const family: Answers = {housingIntent:'ROOM',housingBudget:'2_3M',householdSize:'3',housingHasChild:'YES',housingArea:'LIEN_CHIEU'};
const render = (answers:Answers) => renderToStaticMarkup(createElement(HousingResultsV2,{answers,onPlan:()=>{},onSupport:()=>{},onChild:()=>{}}));

test('housing has five context questions, no salary or sensitive identifiers',()=>{
  assert.equal(housingPrimaryQuestions.length,5);
  assert.deepEqual(housingPrimaryQuestions.map(q=>q.key),['housingIntent','housingBudget','householdSize','housingHasChild','housingArea']);
  assert.deepEqual(housingPrimaryQuestions[0].options.map(o=>o.value),['ROOM','RENT','BUY','UNKNOWN']);
  assert.doesNotMatch(JSON.stringify(housingPrimaryQuestions),/CCCD|thu nhập bình quân|ownsHouse|applicantGroup/);
});
test('budget, household and child answers remain context without legal facts',()=>{
  assert.equal(housingConfirmedFacts(family).length,5);
  assert.match(housingConfirmedFacts(family).join(' '),/2–3 triệu|3 người|Có trẻ nhỏ|Liên Chiểu/);
  assert.deepEqual(housingConfirmedFacts({}),[]);
  assert.deepEqual(housingConfirmedFacts({housingBudget:'UNKNOWN',housingIntent:'UNKNOWN',housingArea:'ANY'}),[]);
  assert.deepEqual(housingConfirmedFacts({housingHasChild:'NO'}),['Không có trẻ nhỏ']);
});
test('exactly three unchanged fixtures are ranked deterministically',()=>{
  assert.equal(housingOpportunities.length,3);
  assert.deepEqual(rankHousingOptions(family),rankHousingOptions(family));
  assert.equal(rankHousingOptions(family)[0].opportunity.id,'DEMO_HOUSING_002');
  assert.equal(rankHousingOptions({housingBudget:'UNDER_2M',householdSize:'1',housingArea:'HOA_KHANH'})[0].opportunity.id,'DEMO_HOUSING_001');
  assert.equal(rankHousingOptions({housingBudget:'3_5M',householdSize:'3',housingHasChild:'YES',housingArea:'HOA_HIEP'})[0].opportunity.id,'DEMO_HOUSING_003');
  assert.deepEqual(new Set(rankHousingOptions(family).map(r=>r.opportunity.id)),new Set(housingOpportunities.map(o=>o.id)));
});
test('partial price overlap and 4+ household do not overstate suitability',()=>{
  const ranked=rankHousingOptions(family);
  assert.match(ranked[0].reasons.join(' '),/Vượt ngân sách bạn chọn/);
  assert.ok(ranked.every(r=>r.reasons.length<=2));
  assert.doesNotMatch(rankHousingOptions({...family,householdSize:'4_PLUS'})[0].reasons.join(' '),/Phù hợp số người/);
});

test('capacity is a constraint before affordability, then ceiling and area rank feasible options',()=>{
  const ranked=rankHousingOptions({...family,housingBudget:'UNDER_2M'});
  assert.equal(ranked[0].opportunity.id,'DEMO_HOUSING_002');
  assert.equal(ranked[1].opportunity.id,'DEMO_HOUSING_003');
  assert.equal(ranked[2].opportunity.id,'DEMO_HOUSING_001');
  assert.ok(ranked[0].overBudget);
  assert.ok(ranked[2].budgetFull);
  assert.ok(ranked[2].capacityMismatch);
  assert.equal(rankHousingOptions({...family,housingBudget:'3_5M',housingArea:'LIEN_CHIEU'})[0].opportunity.id,'DEMO_HOUSING_002');
});

test('no exact budget match warns explicitly, while a full match has no such warning',()=>{
  for(const budget of ['UNDER_2M','2_3M']) {
    const html=render({...family,housingBudget:budget});
    assert.match(html,/Chưa có phương án nào trong dữ liệu hiện tại khớp hoàn toàn với ngân sách bạn chọn/);
    assert.match(html,/Phương án gần nhất để tham khảo|Vượt ngân sách đã chọn/);
  }
  assert.doesNotMatch(render({...family,housingBudget:'3_5M'}),/Chưa có phương án nào/);
  assert.doesNotMatch(render({...family,housingBudget:'UNKNOWN'}),/Chưa có phương án nào|Vượt ngân sách đã chọn/);
  assert.match(render({...family,housingBudget:'3_5M'}),/Phù hợp nhất với thông tin của bạn/);
});

test('all match reasons follow the recorded area, household and child answers',()=>{
  for(const child of [undefined,'NO','YES']) {
    const options=rankHousingOptions({householdSize:'3',housingHasChild:child});
    for(const option of options) {
      const reason=option.reasons.some(r=>r.includes('gia đình có trẻ nhỏ'));
      assert.equal(reason,false,'unverified illustrative suitability cannot support a child claim');
      if(option.reasons.some(r=>r.startsWith('Phù hợp số người'))) assert.ok(option.opportunity.householdSizeRange.min<=3 && option.opportunity.householdSizeRange.max>=3);
    }
  }
  const ranked=rankHousingOptions({...family,housingBudget:'UNDER_2M'});
  assert.ok(ranked[0].reasons.includes('Đúng khu vực ưu tiên'));
  assert.ok(ranked[2].reasons.includes('Khác khu vực ưu tiên'));
});

test('support has exactly one primary direction following the selected intent',()=>{
  for(const [intent,id] of [['RENT','POL_HOUSE_002'],['BUY','POL_HOUSE_001'],['ROOM','POL_HOUSE_002'],['UNKNOWN','POL_HOUSE_002']]) {
    assert.equal(housingSupportDirections({housingIntent:intent})[0],id);
    const html=render({...family,housingIntent:intent});
    assert.equal((html.match(/class="housing-primary-support"/g)||[]).length,1);
    assert.ok(html.includes(`class="housing-primary-support" data-policy-id="${id}"`));
    assert.match(html,/Các hướng khác có thể xem thêm/);
    assert.equal((html.match(/class="housing-secondary-support"/g)||[]).length,2);
    assert.doesNotMatch(html.replace(/<[^>]*>/g,' '),/\bdemo\b|\bmock\b|\bfixture\b|\bprototype\b|minh họa/i);
  }
});
test('fixture cards use confirmation disclosures without rental or contact-now CTA',()=>{
  const html=render(family);
  assert.equal((html.match(/class="housing-option"/g)||[]).length,3);
  assert.equal((html.match(/Xem điều cần xác nhận/g)||[]).length,3);
  assert.doesNotMatch(html,/Thuê ngay|Đặt phòng|Liên hệ chủ trọ ngay|Nộp ngay/);
  for(const text of ['Gợi ý loại hình','tiền cọc','điện nước','số người tối đa','nguồn']) assert.ok(html.includes(text));
});
test('official rounds respect closed/upcoming/active dates and never apply now',()=>{
  const round=dataset.opportunities.find(o=>o.opportunity_id==='OPP_HOUSE_001')!;
  assert.deepEqual(housingRoundPresentation(round,'2026-10-09'),{status:'UPCOMING',label:'Sắp mở',cta:'Xem khi nào bắt đầu'});
  assert.equal(housingRoundPresentation(round,'2026-10-25').status,'ACTIVE');
  assert.equal(housingRoundPresentation(round,'2026-11-30').status,'ACTIVE');
  assert.deepEqual(housingRoundPresentation(round,'2026-12-01'),{status:'CLOSED',label:'Đã đóng',cta:'Xem thông tin đợt'});
  for(const o of dataset.opportunities.filter(o=>o.opportunity_id.startsWith('OPP_HOUSE_'))) assert.notEqual(housingRoundPresentation(o).cta,'Nộp ngay');
  assert.equal(housingRoundPresentation({...round,status:'CLOSED'},'2026-10-25').status,'CLOSED');
});
test('room and social action plans differ, unknown intent stays practical',()=>{
  assert.equal(housingPlanSteps(family)[0].title,'Chọn hướng loại hình để tìm tin cụ thể');
  assert.deepEqual(housingPlanSteps(family)[1].checklist,['Giá thuê','Tiền cọc','Điện nước','Phí khác','Điều kiện hợp đồng']);
  for(const intent of ['BUY','RENT']) {
    const steps=housingPlanSteps({...family,housingIntent:intent});
    assert.equal(steps[0].title,'Xác định loại hình bạn cần');
    assert.equal(steps[3].time,'CHỈ KHI ĐÃ CHỌN ĐÚNG ĐỢT');
    assert.ok(steps.every(s=>!('checklist' in s)));
  }
  assert.equal(housingPlanSteps({housingIntent:'UNKNOWN'})[0].target,'housing-search-destination');
});
test('child cross-link exists only for explicit child answer',()=>{
  assert.match(render(family),/Xem tình huống có con nhỏ/);
  assert.doesNotMatch(render({...family,housingHasChild:'NO'}),/Xem tình huống có con nhỏ/);
  assert.doesNotMatch(render({}),/Xem tình huống có con nhỏ/);
});
test('support summary preserves housing context and reset entry goes Home',()=>{
  const html=renderToStaticMarkup(createElement(HousingSupportSummary,{answers:family}));
  assert.match(html,/Đang khó khăn về nhà ở|2–3 triệu|3 người|Có trẻ nhỏ|Liên Chiểu/);
  assert.equal(resolveDemoEntry(new URLSearchParams(),'HOUSING_DIFFICULTY').screen,'home');
  assert.equal(resolveDemoEntry(new URLSearchParams('journey=housing&screen=results'),null).screen,'home');
});
