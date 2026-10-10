import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { housingOpportunities, childcareOpportunities, jobOpportunities, type DemoHousingOpportunity } from '../lib/competition-demo';
import { isConcreteOpportunity, housingFreshness, knownHousingChildSuitability } from '../lib/opportunity-grounding';
import { rankHousingOptions } from '../lib/housing-journey';
import { childQuestions, childPrimaryNeed, childAdminState, childPlanSteps, updateChildAnswer } from '../lib/child-journey';
import { type Answers } from '../lib/demo';
import { HousingResultsV2, HousingOptionCard } from '../components/housing-journey';
import { JobResults } from '../components/job-results';
import { JobActionPlan } from '../components/job-action-plan';
import { JobOpportunityCards } from '../components/job-opportunities';
import { ChildJourneyResults, ChildActionPlan, ChildSupportSummary } from '../components/child-journey';
import { rankJobDirections } from '../lib/job-journey';

const noop=()=>{};
const render=(component:Parameters<typeof renderToStaticMarkup>[0])=>renderToStaticMarkup(component);
const text=(html:string)=>html.replace(/<[^>]+>/g,' ');
const child=(answers:Answers)=>render(createElement(ChildJourneyResults,{answers,onPlan:noop,onSupport:noop,onCare:noop}));
const plan=(answers:Answers)=>render(createElement(ChildActionPlan,{answers,onSupport:noop,onResultSection:noop}));
// Isolated test records: never added to project data or public UI.
const grounded:DemoHousingOpportunity={...housingOpportunities[0],provenance:'VERIFIED_PROJECT',exactAddress:'Địa chỉ chỉ dùng trong kiểm thử',sourceName:'Nguồn kiểm thử',sourceUrl:'https://example.org/test-only',verifiedAt:'2026-10-10',availabilityStatus:'NEEDS_CONFIRMATION'};

test('changing the current child need clears stale next-need priority without forgetting completed tasks',()=>{
  const previous:Answers={childStage:'UNDER_6',childNeed:'DOCUMENTS',childAdminStatus:'ALL_DONE',childNextNeed:'CARE',childcareNeed:'YES'};
  const next=updateChildAnswer(previous,'childNeed','SUPPORT');
  assert.equal(next.childNextNeed,undefined);
  assert.equal(next.childcareNeed,undefined);
  assert.equal(next.childAdminStatus,'ALL_DONE');
  assert.equal(childPrimaryNeed(next),'SUPPORT');
  assert.equal(childPrimaryNeed({...previous,childNeed:'SUPPORT'}),'SUPPORT');
  assert.equal(childPrimaryNeed({...previous,childAdminStatus:'HEALTH_MISSING'}),'ADMIN');
  assert.doesNotMatch(child(next),/child-admin|Kiểm tra hướng thai sản/);
});

test('concrete housing requires verified provenance, address, source, price and update state',()=>{
  assert.ok(isConcreteOpportunity(grounded));
  for(const item of [{...grounded,exactAddress:''},{...grounded,sourceUrl:null},{...grounded,sourceUrl:'javascript:alert(1)'},{...grounded,sourceName:''},{...grounded,verifiedAt:''},{...grounded,monthlyPriceText:''},{...grounded,provenance:'ILLUSTRATIVE' as const}]) assert.equal(isConcreteOpportunity(item),false);
});
test('generic housing has a direction label and a grounded search destination, no fake availability',()=>{
  const html=render(createElement(HousingResultsV2,{answers:{housingHasChild:'YES'},onPlan:noop,onSupport:noop,onChild:noop}));
  assert.equal((html.match(/data-kind="direction"/g)||[]).length,3);
  assert.match(html,/Gợi ý loại hình|housing-search-destination|Mở nguồn hỗ trợ người lao động/);
  assert.doesNotMatch(text(html),/Cần xác nhận còn chỗ|Có thể phù hợp gia đình có trẻ nhỏ/);
  assert.match(html,/Chưa có thông tin xác nhận về điều kiện ở cùng trẻ nhỏ/);
});
test('child suitability is unknown until the concrete project record explicitly supports it',()=>{
  assert.equal(knownHousingChildSuitability(housingOpportunities[1]),null);
  assert.equal(knownHousingChildSuitability(grounded),null);
  assert.equal(knownHousingChildSuitability({...grounded,childSuitabilityVerified:true,familyWithChildSuitable:true}),true);
  const ranked=rankHousingOptions({housingHasChild:'YES'},[{...grounded,childSuitabilityVerified:true,familyWithChildSuitable:true}],'2026-10-10');
  assert.equal(ranked[0].child,true);
});
test('expired housing is excluded before affordability ranking and source dates are not invented',()=>{
  const expired={...grounded,id:'test-expired',availabilityStatus:'EXPIRED' as const};
  const active={...grounded,id:'test-active',budgetRangeVnd:{min:3000000,max:4000000}};
  assert.equal(rankHousingOptions({housingBudget:'UNDER_2M'},[expired,active],'2026-10-10')[0].opportunity.id,'test-active');
  assert.deepEqual(rankHousingOptions({},[expired],'2026-10-10'),[]);
  assert.equal(housingFreshness({...grounded,expiresAt:'2026-10-09'},'2026-10-10').state,'EXPIRED');
  assert.equal(housingFreshness({...grounded,availabilityStatus:'RECENT'},'2026-10-10').label,'Có thông tin cập nhật gần đây');
  assert.equal(housingFreshness(housingOpportunities[0]).state,'DIRECTION');
});
test('concrete card shows address, dated source and a safe source-first CTA',()=>{
  const item=rankHousingOptions({},[grounded],'2026-10-10')[0];
  const html=render(createElement(HousingOptionCard,{item,answers:{}}));
  assert.match(html,/Địa chỉ chỉ dùng trong kiểm thử|Nguồn kiểm thử|2026-10-10/);
  assert.match(html,/<a[^>]+href="https:\/\/example.org\/test-only"[^>]+rel="noopener noreferrer">Mở nguồn để kiểm tra/);
  assert.match(html,/Cần xác nhận còn chỗ/);
});
test('over-budget records, including concrete records, never receive within-budget reasons',()=>{
  for(const result of rankHousingOptions({housingBudget:'UNDER_2M'},[...housingOpportunities,grounded],'2026-10-10')) if(result.overBudget) assert.doesNotMatch(result.reasons.join(' '),/Trong khoảng ngân sách|phù hợp ngân sách/);
});
test('benefit result exposes first action and verified center before the concrete three-step CTA',()=>{
  for(const [insurance,phrase] of [['UNKNOWN','Xem lại thông tin tham gia bảo hiểm thất nghiệp.'],['YES','Ghi nhận trường hợp nghỉ việc theo thông tin bạn có.']]) {
    const html=render(createElement(JobResults,{answers:{employmentEnded:'true',insurance},onPlan:noop,onSupport:noop}));
    const card=html.split('<article class="job-benefit-track">')[1].split('</article>')[0];
    for(const label of [phrase,'Trung tâm Dịch vụ việc làm TP Đà Nẵng','278 Âu Cơ','0236 3740260','Xem 3 bước kiểm tra trợ cấp']) assert.ok(card.includes(label),label);
  }
});
test('benefit plan has exactly three numbered steps and a real phone/procedure destination',()=>{
  const html=render(createElement(JobActionPlan,{answers:{employmentEnded:'true',insurance:'UNKNOWN'},onAnswer:noop,onToggle:noop,checked:[],onIncomePath:noop,onSupport:noop}));
  assert.equal((html.match(/BƯỚC [123]/g)||[]).length,3);
  for(const label of ['Kiểm tra giấy tờ nghỉ việc','Xem lại thông tin tham gia bảo hiểm thất nghiệp','Liên hệ nơi có thể đối chiếu','278 Âu Cơ','Gọi Trung tâm','Tra cứu thủ tục chính thức']) assert.ok(html.includes(label),label);
  assert.match(html,/href="tel:02363740260"/);
  assert.doesNotMatch(html,/<input[^>]+(?:CCCD|bank|insuranceNumber)/i);
});
test('generic jobs have no vacancy claim and their CTA points to verified center plus national source',()=>{
  const html=render(createElement(JobOpportunityCards,{directions:rankJobDirections({occupation:'PRODUCTION',area:'HOA_KHANH',shift:'SHIFT'})}));
  assert.equal((html.match(/Gợi ý hướng công việc/g)||[]).length,3);
  assert.equal((html.match(/Tìm tin đang tuyển cho công việc này/g)||[]).length,3);
  assert.match(html,/id="job-search-destination"|Nơi bạn có thể tìm tin đang tuyển|278 Âu Cơ|href="https:\/\/vieclam.gov.vn\/"/);
  assert.doesNotMatch(text(html),/Ứng tuyển ngay|Cần xác nhận tin tuyển dụng/);
  assert.ok(jobOpportunities.every(item=>!isConcreteOpportunity(item)));
});
test('all admin completed removes admin recommendations, plan tasks and repeated missing fact',()=>{
  const answers:Answers={childStage:'UNDER_6',childNeed:'DOCUMENTS',childAdminStatus:'ALL_DONE',childNextNeed:'NONE'};
  assert.equal(childPrimaryNeed(answers),'DONE');
  assert.deepEqual(childPlanSteps(answers),[]);
  assert.match(child(answers),/Các việc bạn chọn hiện đã hoàn thành/);
  assert.doesNotMatch(child(answers)+plan(answers),/id="child-admin"|Kiểm tra giấy tờ và bảo hiểm y tế|Việc nào của trẻ còn cần hoàn thành/);
  assert.match(render(createElement(ChildSupportSummary,{answers})),/Không có việc còn thiếu được bạn chọn/);
});
test('one missing health-insurance task is primary and does not recommend birth or residence again',()=>{
  const a:Answers={childStage:'UNDER_6',childNeed:'DOCUMENTS',childAdminStatus:'HEALTH_MISSING'};
  assert.deepEqual(childAdminState(a).missing,['HEALTH']);
  const primary=child(a).split('id="child-admin"')[1].split('</article>')[0];
  assert.match(primary,/Hoàn thành bảo hiểm y tế cho trẻ/);
  assert.doesNotMatch(primary,/Khai sinh|Thông tin cư trú/);
  assert.ok(childPlanSteps(a).every(step=>step.target==='child-admin'));
});
test('under-six childcare and support each become primary without completed admin or maternity',()=>{
  for(const need of ['CARE','SUPPORT']) {
    const a:Answers={childStage:'UNDER_6',childNeed:need,childAdminStatus:'ALL_DONE'};
    assert.equal(childPrimaryNeed(a),need);
    assert.doesNotMatch(child(a)+plan(a),/id="child-admin"|thai sản|Lao động nữ sinh con/);
    assert.ok(childPlanSteps(a).every(step=>step.target!=='child-admin'));
    if(need==='CARE') assert.match(child(a),/childcare-options/); else assert.doesNotMatch(child(a),/childcare-options/);
  }
});
test('under-six question branching asks completion only for admin/unknown, then the actual next need',()=>{
  assert.equal(childQuestions({childStage:'UNDER_6'})[1].title,'Bạn đang cần giúp việc gì nhất?');
  const docs=childQuestions({childStage:'UNDER_6',childNeed:'DOCUMENTS'});
  assert.equal(docs[2].title,'Việc nào còn chưa hoàn thành?');
  assert.ok(childQuestions({childStage:'UNDER_6',childNeed:'DOCUMENTS',childAdminStatus:'ALL_DONE'}).some(q=>q.key==='childNextNeed'));
  assert.ok(childQuestions({childStage:'UNDER_6',childNeed:'CARE'}).some(q=>q.key==='childcareAge'));
  assert.ok(childQuestions({childStage:'UNDER_6',childNeed:'SUPPORT'}).every(q=>q.key!=='childAdminStatus'));
});
test('multiple incomplete tasks require explicit identification and never assume all three',()=>{
  assert.deepEqual(childAdminState({childAdminStatus:'MULTIPLE'}).missing,[]);
  assert.deepEqual(childAdminState({childAdminStatus:'MULTIPLE',childAdminMissing:'BIRTH|HEALTH'}).missing,['BIRTH','HEALTH']);
});
test('newborn completed tasks disappear; unknown completion asks what is complete',()=>{
  const base:Answers={childStage:'NEWBORN',childParent:'MOTHER',childBorn:'BORN',childInsuranceKnown:'KNOWN'};
  assert.doesNotMatch(child({...base,childAdminStatus:'ALL_DONE'})+plan({...base,childAdminStatus:'ALL_DONE'}),/id="child-admin"|Hoàn thành giấy tờ|Xác định việc nào đã hoàn thành/);
  assert.match(child(base),/Xác định việc nào đã hoàn thành/);
  assert.deepEqual(childAdminState({...base,childAdminStatus:'RESIDENCE_MISSING'}).missing,['RESIDENCE']);
  assert.equal(childPlanSteps({...base,childAdminStatus:'ALL_DONE'}).length,1);
});
test('preschool has one strongest option, maximum two collapsed alternatives and truthful mismatches',()=>{
  const a:Answers={childStage:'PRESCHOOL',childcareAge:'AGE_3_5',childcareArea:'HOA_HIEP',childcareBudget:'UNDER_1_5M',childcarePickup:'LATER'};
  const html=child(a);
  assert.equal((html.match(/data-primary="true"/g)||[]).length,1);
  assert.equal((html.match(/class="child-alternative"/g)||[]).length,2);
  assert.doesNotMatch(html,/<details class="child-alternative" open|thai sản/);
  assert.match(html,/Chưa khớp ở: ngân sách · giờ đón/);
  assert.doesNotMatch(html,/Chưa khớp ở: ngân sách · giờ đón · khu vực/);
  assert.ok(html.indexOf('child-match-note')<html.indexOf('data-primary="true"'));
});
test('generic childcare cannot claim real facility status or display fixture names as schools',()=>{
  assert.ok(childcareOpportunities.every(o=>!isConcreteOpportunity(o)));
  const html=child({childStage:'PRESCHOOL'});
  assert.equal((html.match(/data-kind="direction"/g)||[]).length,3);
  assert.doesNotMatch(text(html),/Cần xác nhận tuyển sinh|Phương án mầm non gần Hòa Khánh/);
  assert.match(html,/Gợi ý loại hình chăm sóc|Hỏi nơi tìm cơ sở thực tế|tel:1022/);
});
