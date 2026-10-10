import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { opportunityLabel, opportunityReferenceText } from '../lib/public-copy';
import { JobResults } from '../components/job-results';
import { JobOpportunityCards } from '../components/job-opportunities';
import { JobActionPlan } from '../components/job-action-plan';
import { HousingResultsV2, HousingActionPlan } from '../components/housing-journey';
import { ChildResults } from '../components/family-housing-results';
import { jobDemoAnswers, rankJobDirections } from '../lib/job-journey';
import { resolveDemoEntry } from '../lib/demo-entry';

const noop = () => {};
const visibleText = (html: string) => html.replace(/<[^>]*>/g,' ');

test('public status labels remain unverified for all opportunity types',()=>{
  assert.equal(opportunityLabel('JOB'),'Cần xác nhận tin tuyển dụng');
  assert.equal(opportunityLabel('HOUSING'),'Cần xác nhận còn chỗ');
  assert.equal(opportunityLabel('CHILDCARE'),'Cần xác nhận tuyển sinh');
  assert.equal(opportunityReferenceText('Minh họa ca ngày; cần hỏi rõ tăng ca.'),'Tham khảo: ca ngày; cần hỏi rõ tăng ca.');
  assert.equal(opportunityReferenceText('Tham khảo 2,5–3,2 triệu đồng/tháng'),'Tham khảo 2,5–3,2 triệu đồng/tháng');
});

test('rendered journey results and plans contain no visible development framing',()=>{
  const housingAnswers = {housingIntent:'ROOM',housingBudget:'2_3M',householdSize:'3',housingHasChild:'YES',housingArea:'LIEN_CHIEU'};
  const screens = [
    createElement(JobResults,{answers:jobDemoAnswers,onPlan:noop,onSupport:noop}),
    createElement(JobOpportunityCards,{directions:rankJobDirections({occupation:'PRODUCTION',area:'HOA_KHANH',shift:'SHIFT'})}),
    createElement(JobActionPlan,{answers:jobDemoAnswers,checked:[],onToggle:noop,onAnswer:noop,onSupport:noop,onIncomePath:noop}),
    createElement(HousingResultsV2,{answers:housingAnswers,onPlan:noop,onSupport:noop,onChild:noop}),
    createElement(HousingActionPlan,{answers:housingAnswers,onSupport:noop,onChild:noop,onResultSection:noop}),
    createElement(ChildResults,{answers:{childContext:'PRESCHOOL',childAge:'UNDER6'},onPlan:noop}),
  ];
  for (const screen of screens) assert.doesNotMatch(visibleText(renderToStaticMarkup(screen)),/\bdemo\b|\bmock\b|\bfixture\b|\bprototype\b|minh họa/i);
});

test('public opportunity copy retains confirmation details and shared disclosure',()=>{
  const jobHtml = renderToStaticMarkup(createElement(JobOpportunityCards,{directions:rankJobDirections({occupation:'WAREHOUSE',area:'LIEN_CHIEU',shift:'DAY'})}));
  assert.equal((jobHtml.match(/Gợi ý hướng công việc/g)||[]).length,3);
  assert.match(jobHtml,/Tham khảo|Vui lòng xác nhận lại trước khi liên hệ hoặc quyết định/);
  const housingHtml = renderToStaticMarkup(createElement(HousingResultsV2,{answers:{},onPlan:noop,onSupport:noop,onChild:noop}));
  assert.ok(housingHtml.includes('Giá và tình trạng chỗ ở có thể thay đổi. Vui lòng xác nhận lại trước khi quyết định.'));
  assert.equal((housingHtml.match(/>Gợi ý loại hình<\/span>/g)||[]).length,3);
  assert.match(housingHtml,/tiền cọc|điện nước|chưa xác nhận điều kiện hưởng/);
  assert.doesNotMatch(housingHtml,/Thuê ngay|Nộp ngay/);
});

test('internal presentation URL still works while ordinary root remains Home',()=>{
  assert.equal(resolveDemoEntry(new URLSearchParams('demo=jobloss'),null).screen,'questions');
  assert.equal(resolveDemoEntry(new URLSearchParams('demo=jobloss&screen=results'),null).screen,'results');
  assert.equal(resolveDemoEntry(new URLSearchParams(),null).screen,'home');
});
