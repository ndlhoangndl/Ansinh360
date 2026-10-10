import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { childQuestions, updateChildAnswer, childConfirmedFacts, childMaternityDirection, rankChildcare, childPlanSteps, childPlanHeading } from '../lib/child-journey';
import { childcareOpportunities } from '../lib/competition-demo';
import { type Answers } from '../lib/demo';
import { ChildJourneyResults, ChildSupportSummary, ChildActionPlan } from '../components/child-journey';
import { resolveDemoEntry } from '../lib/demo-entry';
import { UserJourneyProgress } from '../components/user-journey-progress';

const preschool:Answers={childStage:'PRESCHOOL',childcareAge:'AGE_3_5',childcareArea:'HOA_HIEP',childcareBudget:'UNDER_1_5M',childcarePickup:'LATER'};
const newborn:Answers={childStage:'NEWBORN',childParent:'MOTHER',childBorn:'BORN',childInsuranceKnown:'KNOWN'};
const underSix:Answers={childStage:'UNDER_6',childNeed:'HEALTH',childAdminStatus:'ALL_DONE',childcareNeed:'NO'};
const render=(answers:Answers)=>renderToStaticMarkup(createElement(ChildJourneyResults,{answers,onPlan:()=>{},onSupport:()=>{},onCare:()=>{}}));
const visible=(html:string)=>html.replace(/<[^>]*>/g,' ');

test('parent question speaks to the family and retains the approved options',()=>{
  const q=childQuestions(newborn)[1];
  assert.equal(q.title,'Bạn đang hỏi cho ai?');
  assert.equal(q.hint,'Thông tin này giúp chọn hướng quyền lợi phù hợp hơn với gia đình.');
  assert.deepEqual(q.options.map(o=>o.label),['Mẹ của trẻ','Bố của trẻ','Người thân / người hỗ trợ']);
  assert.doesNotMatch(JSON.stringify(childQuestions(newborn)),/Ai đang dùng|trải nghiệm|BHYT|BHXH/);
  const nav=renderToStaticMarkup(createElement(UserJourneyProgress,{screen:'questions',stepsLabel:'Các bước của gia đình'}));
  assert.doesNotMatch(nav,/trải nghiệm/);
});
test('newborn plan CTAs describe their existing destinations with concrete provider copy',()=>{
  const html=renderToStaticMarkup(createElement(ChildActionPlan,{answers:newborn,onResultSection:()=>{},onSupport:()=>{}}));
  for(const label of ['Xem nơi thực hiện việc còn thiếu','Xem hướng thai sản']) assert.match(html,new RegExp(label));
  assert.doesNotMatch(html,/Xem hướng dẫn cho việc này|BHYT|BHXH/);
  assert.equal((html.match(/<button/g)||[]).length,3,'one action per destination plus human support');
  assert.match(html,/Cơ quan hộ tịch\/Công an\/Bảo hiểm xã hội/);
  assert.match(html,/Giấy tờ gia đình đang có; hướng dẫn thủ tục liên thông/);
});
test('childcare details retain all costs, hours and safety information in four groups',()=>{
  const html=render(preschool);
  const cards=html.split('<article class="child-option"').slice(1);
  assert.equal(cards.length,3);
  for(const card of cards) {
    const details=card.split('<details>')[1].split('</details>')[0];
    assert.equal((details.match(/<section>/g)||[]).length,4);
    for(const label of ['Độ tuổi','Chi phí','Thời gian','Trước khi chọn','Tiền ăn','Phụ phí / ngoài giờ','trẻ muộn','giấy phép','an toàn','địa chỉ','tình trạng nhận trẻ']) assert.ok(details.toLowerCase().includes(label.toLowerCase()),label);
    assert.match(details,/\d{2}:\d{2}–\d{2}:\d{2}/);
    assert.match(details,/\d[\d.,]*–\d[\d.,]* đồng\/ngày/);
    assert.equal((details.match(/Thông tin về học phí, giờ hoạt động và tuyển sinh có thể thay đổi/g)||[]).length,0); // One shared section note instead.
    assert.doesNotMatch(card.split('<details>')[0],/hỏi lại|cần xác nhận lại|chưa được xác nhận/i);
  }
});
test('compact mismatch summary never hides a known mismatch or introduces a false positive',()=>{
  for(const answers of [preschool,{...preschool,childcareAge:'UNDER_24'}, {...preschool,childcareArea:'ANY',childcareBudget:'UNKNOWN',childcarePickup:'VARIABLE'}]) {
    const ranked=rankChildcare(answers);
    const cards=render(answers).split('<article class="child-option"').slice(1);
    for(let i=0;i<ranked.length;i++) {
      const r=ranked[i], primary=cards[i].split('<details>')[0];
      if(r.overBudget) {assert.match(primary,/ngân sách/);assert.doesNotMatch(primary,/Học phí trong khoảng/);assert.match(cards[i],/Cao hơn khoảng ngân sách bạn chọn/);}
      if(answers.childcarePickup==='LATER') assert.match(primary,/giờ đón/);
      if(r.reasons.includes('Khác khu vực ưu tiên')) assert.match(primary,/khu vực/);
      if(r.ageTier===2) {assert.match(primary,/độ tuổi/);assert.doesNotMatch(primary,/✓ Phù hợp nhóm tuổi/);}
      assert.ok((primary.match(/<li /g)||[]).length<=2);
    }
  }
});

test('child starts at three stages and asks only the questions for that stage',()=>{
  assert.equal(childQuestions({}).length,1);
  assert.deepEqual(childQuestions({})[0].options.map(o=>o.value),['NEWBORN','UNDER_6','PRESCHOOL']);
  assert.deepEqual(childQuestions(newborn).map(q=>q.key),['childStage','childParent','childBorn','childInsuranceKnown','childAdminStatus']);
  assert.deepEqual(childQuestions(underSix).map(q=>q.key),['childStage','childNeed','childAdminStatus','childNextNeed']);
  assert.deepEqual(childQuestions(preschool).map(q=>q.key),['childStage','childcareAge','childcareArea','childcareBudget','childcarePickup']);
  assert.doesNotMatch(JSON.stringify([...childQuestions(newborn),...childQuestions(preschool)]),/CCCD|số BHXH|tài khoản|lương/);
});
test('changing stage clears branch answers and keeps unrelated journey state',()=>{
  const changed=updateChildAnswer({...newborn,...preschool,childStage:'NEWBORN',housingBudget:'2_3M'},'childStage','UNDER_6');
  assert.deepEqual(changed,{childStage:'UNDER_6',housingBudget:'2_3M'});
  assert.equal(updateChildAnswer(newborn,'childBorn','EXPECTED').childParent,'MOTHER');
  assert.deepEqual(updateChildAnswer(newborn,'childStage','NEWBORN'),newborn);
});
test('confirmed facts never turn insurance knowledge into eligibility or participation',()=>{
  const facts=childConfirmedFacts(newborn).join(' ');
  assert.match(facts,/Thông tin bảo hiểm: Đã rõ/);
  assert.doesNotMatch(facts,/đủ điều kiện|đang tham gia|đã đóng|được hưởng/);
  assert.doesNotMatch(childConfirmedFacts({...newborn,childInsuranceKnown:'UNKNOWN',childBorn:'UNKNOWN'}).join(' '),/Đã rõ|Bé:/);
  assert.doesNotMatch(childConfirmedFacts({...preschool,...newborn,childStage:'PRESCHOOL'}).join(' '),/Mẹ của trẻ|Bé:|Thông tin bảo hiểm/);
});
test('maternity is parent-specific only in newborn; helper never defaults to mother',()=>{
  assert.equal(childMaternityDirection(newborn)?.serviceId,'CHILD_SV_001');
  assert.equal(childMaternityDirection({...newborn,childParent:'FATHER'})?.serviceId,'CHILD_SV_002');
  assert.equal(childMaternityDirection({...newborn,childParent:'HELPER'}),null);
  assert.equal(childMaternityDirection({...newborn,childStage:'PRESCHOOL'}),null);
  assert.equal(childMaternityDirection({...newborn,childStage:'UNDER_6'}),null);
  assert.match(render({...newborn,childParent:'FATHER'}),/Lao động nam có vợ sinh con/);
  assert.doesNotMatch(render({...newborn,childParent:'FATHER'}),/Lao động nữ sinh con/);
});
test('newborn remains after-birth/admin plus maternity, never childcare listings',()=>{
  const html=render(newborn);
  assert.match(html,/Gia đình bạn có 2 việc nên làm song song|Hoàn thành các việc sau sinh|Kiểm tra hướng thai sản/);
  assert.doesNotMatch(html,/childcare-options|Hỗ trợ mầm non cho con người lao động/);
  assert.match(render({...newborn,childBorn:'EXPECTED'}),/Gia đình có thể tìm hiểu trước/);
  assert.match(childPlanSteps({...newborn,childBorn:'EXPECTED'})[0].next,/Sau khi bé sinh/);
});
test('under-six removes completed admin work and follows the next selected need',()=>{
  const html=render(underSix);
  assert.match(html,/Các việc bạn chọn hiện đã hoàn thành/);
  assert.doesNotMatch(html,/id="child-admin"|Việc nào của trẻ còn cần hoàn thành/);
  assert.doesNotMatch(html,/thai sản|child-care-path|childcare-options/);
  assert.match(render({...underSix,childcareNeed:'YES'}),/childcare-options/);
  assert.match(render({...underSix,childAdminStatus:'UNKNOWN'}),/chỉ hỏi cách hoàn thành phần còn thiếu/i);
});

test('exactly the three frozen childcare records are ranked deterministically without mutation',()=>{
  const snapshot=JSON.stringify(childcareOpportunities);
  assert.equal(rankChildcare(preschool).length,3);
  assert.deepEqual(rankChildcare(preschool),rankChildcare(preschool));
  assert.deepEqual(new Set(rankChildcare(preschool).map(r=>r.opportunity.id)),new Set(childcareOpportunities.map(o=>o.id)));
  assert.equal(JSON.stringify(childcareOpportunities),snapshot);
});
test('age first, then area, then budget and pickup; partial ages stay below full ages',()=>{
  assert.equal(rankChildcare(preschool)[0].opportunity.id,'DEMO_CHILDCARE_003');
  assert.equal(rankChildcare({...preschool,childcareAge:'AGE_2_3',childcareArea:'LIEN_CHIEU'})[0].opportunity.id,'DEMO_CHILDCARE_001');
  assert.equal(rankChildcare({...preschool,childcareAge:'UNDER_24',childcareArea:'HOA_HIEP'})[0].opportunity.id,'DEMO_CHILDCARE_002');
  assert.equal(rankChildcare({...preschool,childcareArea:'HOA_KHANH'})[0].opportunity.id,'DEMO_CHILDCARE_001');
  assert.equal(rankChildcare({...preschool,childcareAge:'UNKNOWN',childcareArea:'ANY',childcareBudget:'UNKNOWN',childcarePickup:'17_18'})[0].opportunity.id,'DEMO_CHILDCARE_002');
  const budgets=rankChildcare({...preschool,childcareAge:'UNKNOWN',childcareArea:'ANY',childcareBudget:'UNDER_1_5M'});
  assert.equal(budgets.at(-1)?.opportunity.id,'DEMO_CHILDCARE_002');
});
test('over-budget and late pickup cannot gain positive match reasons',()=>{
  for(const result of rankChildcare(preschool)) {
    assert.ok(result.overBudget);
    assert.equal(result.fullMatch,false);
    assert.equal(result.pickupMatch,false);
    assert.match(result.reasons.join(' '),/Học phí cao hơn/);
    assert.doesNotMatch(result.reasons.join(' '),/Trong ngân sách|Học phí trong khoảng|Giờ hoạt động gần/);
  }
  const html=render(preschool);
  assert.match(html,/Chưa có loại hình nào khớp hoàn toàn với nhu cầu bạn chọn/);
  assert.match(html,/Phương án gần nhất/);
  const defaults=html.split('<article class="child-option"').slice(1).map(card=>card.split('<details>')[0]);
  assert.equal(defaults.length,3);
  for(const card of defaults) {
    assert.match(card,/Chưa khớp hoàn toàn ở:.*ngân sách/);
    assert.match(card,/Chưa khớp hoàn toàn ở:.*giờ đón/);
    assert.ok((card.match(/<li /g)||[]).length<=2);
  }
});
test('unknown age does not claim suitability, 17–18 requires end time at least 18',()=>{
  for(const r of rankChildcare({...preschool,childcareAge:'UNKNOWN'})) assert.doesNotMatch(r.reasons.join(' '),/Phù hợp nhóm tuổi/);
  const timed=rankChildcare({...preschool,childcarePickup:'17_18'});
  assert.equal(timed.find(r=>r.opportunity.id==='DEMO_CHILDCARE_002')?.pickupMatch,true);
  assert.equal(timed.find(r=>r.opportunity.id==='DEMO_CHILDCARE_001')?.pickupMatch,false);
});
test('preschool support is separate, non-final, no maternity, no registration marketplace CTA',()=>{
  const html=render(preschool);
  assert.match(html,/Hỗ trợ mầm non cho con người lao động|Cần kiểm tra thêm|Xác định cơ sở trẻ đang học/);
  assert.match(html,/chưa xác nhận trẻ đang học tại cơ sở thuộc nhóm áp dụng/);
  assert.doesNotMatch(visible(html),/thai sản|Đăng ký ngay|Đặt chỗ|Ghi danh ngay|200\.000|đủ điều kiện hưởng\./);
  assert.equal((html.match(/Xem điều cần xác nhận/g)||[]).length,3);
  assert.match(html,/Thông tin về học phí, giờ hoạt động và tuyển sinh có thể thay đổi/);
});
test('plans have practical stage-specific steps and every result target exists',()=>{
  assert.equal(childPlanHeading(preschool),'Kế hoạch chăm sóc trẻ của gia đình');
  assert.equal(childPlanHeading(newborn),'Kế hoạch của gia đình sau khi có em bé');
  assert.deepEqual(childPlanSteps(preschool)[2].checklist,['Học phí','Tiền ăn','Phụ phí','Giờ đón/trả','Khoản ngoài giờ']);
  for(const a of [newborn,preschool,underSix,{...underSix,childcareNeed:'YES'}]) {
    const html=render(a);
    for(const step of childPlanSteps(a)) {assert.ok(step.why&&step.where&&step.next);assert.ok(html.includes(`id="${step.target}"`));}
  }
});
test('human summary follows stage and unknown details remain unknown',()=>{
  const summary=(a:Answers)=>visible(renderToStaticMarkup(createElement(ChildSupportSummary,{answers:a})));
  assert.match(summary(preschool),/ngân sách|Ngân sách|giờ đón|Giờ đón/);
  assert.doesNotMatch(summary(preschool),/thai sản/);
  assert.match(summary({...newborn,childBorn:'EXPECTED'}),/Gia đình sắp có em bé/);
  assert.doesNotMatch(summary({...newborn,childBorn:'UNKNOWN'}),/Gia đình vừa có em bé/);
  assert.doesNotMatch(summary(underSix),/thai sản|tìm nơi chăm sóc/);
});
test('all three branches, plans and support have public copy and secondary official sources',()=>{
  for(const answers of [newborn,{...newborn,childParent:'HELPER'},preschool,underSix]) {
    const html=render(answers);
    const plan=renderToStaticMarkup(createElement(ChildActionPlan,{answers,onResultSection:()=>{},onSupport:()=>{}}));
    const support=renderToStaticMarkup(createElement(ChildSupportSummary,{answers}));
    assert.doesNotMatch(visible(html+plan+support),/demo|mock|fixture|prototype|minh họa|trải nghiệm/i);
    if(answers!==underSix) { assert.match(html,/<details class="source-disclosure"><summary>Căn cứ để AN SINH 360 đưa hướng dẫn này/); assert.match(html,/Xem nguồn chính thức/); }
  }
});
test('clean root resets to Home; Child protected entry cannot reuse another journey',()=>{
  assert.equal(resolveDemoEntry(new URLSearchParams(), 'HAS_CHILD').screen,'home');
  assert.equal(resolveDemoEntry(new URLSearchParams('journey=child&screen=plan'),null).screen,'home');
  assert.equal(resolveDemoEntry(new URLSearchParams('journey=child&screen=results'),'JOB_LOSS').screen,'home');
});

