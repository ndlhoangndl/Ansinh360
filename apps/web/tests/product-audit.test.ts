import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { type Answers, type Screen } from '../lib/demo';
import { JobResults } from '../components/job-results';
import { JobActionPlan } from '../components/job-action-plan';
import { HousingResultsV2, HousingActionPlan } from '../components/housing-journey';
import { ChildJourneyResults, ChildActionPlan } from '../components/child-journey';
import { UserJourneyProgress } from '../components/user-journey-progress';
import { MechanismExplainer } from '../components/mechanism-explainer';
import { jobNextAction } from '../lib/action-plan';
import { rankHousingOptions, housingSupportDirections, housingPlanSteps } from '../lib/housing-journey';
import { rankChildcare, childPlanSteps } from '../lib/child-journey';

const noop=()=>{};
const text=(html:string)=>html.replace(/<[^>]+>/g,' ');
const job=(answers:Answers)=>renderToStaticMarkup(createElement(JobResults,{answers,onPlan:noop,onSupport:noop}));
const jobPlan=(answers:Answers)=>renderToStaticMarkup(createElement(JobActionPlan,{answers,onAnswer:noop,checked:[],onToggle:noop,onIncomePath:noop,onSupport:noop}));
const house=(answers:Answers)=>renderToStaticMarkup(createElement(HousingResultsV2,{answers,onPlan:noop,onSupport:noop,onChild:noop}));
const housePlan=(answers:Answers)=>renderToStaticMarkup(createElement(HousingActionPlan,{answers,onResultSection:noop,onSupport:noop,onChild:noop}));
const child=(answers:Answers)=>renderToStaticMarkup(createElement(ChildJourneyResults,{answers,onPlan:noop,onSupport:noop,onCare:noop}));
const childPlan=(answers:Answers)=>renderToStaticMarkup(createElement(ChildActionPlan,{answers,onResultSection:noop,onSupport:noop}));
const jobs:Answers[]=[
  {employmentEnded:'true',insurance:'YES',employmentRecency:'RECENT',goal:'BOTH'},
  {employmentEnded:'true',insurance:'UNKNOWN',employmentRecency:'RECENT',goal:'SUPPORT'},
  {employmentEnded:'true',insurance:'YES',employmentRecency:'RECENT',goal:'JOB'},
];
const housing:Answers[]=[
  {housingIntent:'ROOM',housingBudget:'UNDER_2M',householdSize:'1',housingHasChild:'NO',housingArea:'HOA_KHANH'},
  {housingIntent:'ROOM',housingBudget:'2_3M',householdSize:'3',housingHasChild:'YES',housingArea:'LIEN_CHIEU'},
  {housingIntent:'RENT',housingBudget:'3_5M',householdSize:'2',housingHasChild:'NO',housingArea:'HOA_HIEP'},
];
const children:Answers[]=[
  {childStage:'NEWBORN',childParent:'MOTHER',childBorn:'BORN',childInsuranceKnown:'KNOWN'},
  {childStage:'UNDER_6',childNeed:'DOCUMENTS',childAdminStatus:'NEED_CHECK',childcareNeed:'NO'},
  {childStage:'PRESCHOOL',childcareAge:'AGE_3_5',childcareArea:'HOA_HIEP',childcareBudget:'UNDER_1_5M',childcarePickup:'LATER'},
];

test('four progress labels and current step are consistent across every screen',()=>{
  for(const [screen,active] of [['home',0],['questions',1],['analysis',1],['results',2],['plan',3]] as [Screen,number][]) {
    const html=renderToStaticMarkup(createElement(UserJourneyProgress,{screen}));
    const items=[...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)];
    assert.equal(items.length,4);
    assert.equal((html.match(/aria-current="step"/g)||[]).length,1);
    assert.equal(items.findIndex(item=>item[0].includes('aria-current="step"')),active);
    assert.doesNotMatch(text(html),/Policy|Service|Opportunity|Engine|AI|Matching|trải nghiệm/);
  }
});
test('mechanism is a collapsed, non-clickable plain-language conceptual flow',()=>{
  const html=renderToStaticMarkup(createElement(MechanismExplainer));
  assert.match(html,/<details class="mechanism-explainer judge-explainer">/);
  assert.doesNotMatch(html,/<a |<button| open[ =>]/);
  const labels=[...html.matchAll(/<strong>([^<]+)<\/strong>/g)].map(m=>m[1]);
  assert.deepEqual(labels,['Hoàn cảnh','Quyền lợi','Dịch vụ','Cơ hội','Hành động']);
});
test('job audit scenarios retain one missing priority, training and actionable support',()=>{
  assert.equal(jobNextAction(jobs[0]),'termination');
  assert.equal(jobNextAction(jobs[1]),'insurance');
  assert.equal(jobNextAction(jobs[2]),'termination');
  for(const answers of jobs) {
    const html=job(answers);
    assert.equal((html.match(/Việc bạn nên kiểm tra tiếp:/g)||[]).length,1);
    assert.match(html,/Vì sao có gợi ý này|Xem hướng học nghề|Xem việc phù hợp/);
    assert.match(jobPlan(answers),/Trung tâm Dịch vụ việc làm|Những thứ nên có trước khi liên hệ/);
  }
});
test('housing audit scenarios retain budget warnings, truthful context and selected support',()=>{
  for(const answers of housing) {
    const ranked=rankHousingOptions(answers);
    assert.equal(ranked.length,3);
    for(const option of ranked) if(option.overBudget) assert.doesNotMatch(option.reasons.join(' '),/Trong khoảng ngân sách/);
    const plan=housePlan(answers);
    assert.match(plan,/Xem phương án|Xem hướng hỗ trợ/);
    assert.equal((plan.match(/<button/g)||[]).length,new Set(housingPlanSteps(answers).map(step=>step.target)).size+1+(answers.housingHasChild==='YES'?1:0));
  }
  assert.equal(rankHousingOptions(housing[0])[0].opportunity.id,'DEMO_HOUSING_001');
  assert.match(house(housing[0]),/Không vượt ngân sách bạn chọn/);
  assert.equal(housingSupportDirections(housing[2])[0],'POL_HOUSE_002');
  assert.doesNotMatch(housingPlanSteps(housing[0])[0].title,/phương án trong ngân sách/);
});
test('child audit scenarios never substitute the wrong primary direction',()=>{
  assert.match(child(children[0]),/Hoàn thành các việc sau sinh|Lao động nữ sinh con/);
  assert.doesNotMatch(child(children[0]),/childcare-options/);
  assert.doesNotMatch(child(children[1]),/thai sản|childcare-options|child-care-path|Hỗ trợ mầm non/);
  assert.doesNotMatch(child(children[2]),/thai sản/);
  assert.equal(rankChildcare(children[2])[0].opportunity.id,'DEMO_CHILDCARE_003');
  assert.match(child(children[2]),/Chưa khớp hoàn toàn ở: ngân sách · giờ đón/);
  for(const answers of children) assert.equal((childPlan(answers).match(/<button/g)||[]).length,new Set(childPlanSteps(answers).map(step=>step.target)).size+1);
});
test('all current results have exactly one primary button and a real support action',()=>{
  for(const html of [...jobs.map(job),...housing.map(house),...children.map(child)]) {
    assert.equal((html.match(/<button class="primary-button"/g)||[]).length,1);
    assert.match(html,/<button[^>]*>Tôi cần người hỗ trợ/);
    assert.match(html,/<details class="source-disclosure">/);
  }
});
test('all nine scenarios have safe real links and no public development framing',()=>{
  for(const html of [...jobs.flatMap(a=>[job(a),jobPlan(a)]),...housing.flatMap(a=>[house(a),housePlan(a)]),...children.flatMap(a=>[child(a),childPlan(a)])]) {
    assert.doesNotMatch(text(html),/\bdemo\b|\bmock\b|\bfixture\b|\bprototype\b|\bMVP\b|minh họa|lượt trải nghiệm|matching|engine/i);
    assert.doesNotMatch(html,/localhost|127\.0\.0\.1|file:\/\/|href=""/);
    for(const anchor of html.matchAll(/<a\b([^>]+)>/g)) {
      const attrs=anchor[1], href=attrs.match(/href="([^"]+)"/)?.[1];
      assert.ok(href && /^(https:\/\/|tel:[+\d]+$|#[\w-]+$)/.test(href),href);
      if(attrs.includes('target="_blank"')) assert.match(attrs,/rel="noopener noreferrer"/);
    }
  }
});
