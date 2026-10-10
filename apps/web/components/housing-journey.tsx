"use client";

import { ArrowRight, Check, ExternalLink } from 'lucide-react';
import { Answers, dataset, formatDate, policy, service, source, type Opportunity } from '@/lib/demo';
import { officialDestination } from '@/lib/official-destinations';
import { housingOpportunities, type DemoHousingOpportunity } from '@/lib/competition-demo';
import { housingBudgetCeilings } from '@/lib/housing-journey';
import { plainLanguage, referenceAmount, opportunityReferenceText } from '@/lib/public-copy';
import { housingConfirmedFacts, housingPlanSteps, housingRoundPresentation, rankHousingOptions, housingSupportDirections } from '@/lib/housing-journey';
import { isConcreteOpportunity, housingFreshness, knownHousingChildSuitability, directionTitle, safeSourceUrl } from '@/lib/opportunity-grounding';
import { SourceDisclosure } from './source-badge';

const focusHousing = (id: string) => { const element = document.getElementById(id); element?.focus(); element?.scrollIntoView({block:'start',behavior:'instant'}); };
const rounds = dataset.opportunities.filter(o=>o.opportunity_id.startsWith('OPP_HOUSE_'));
const sourceEntries = [{id:'SRC_HOUSE_LAW_001'}, {id:'SRC_HOUSE_VBHN_001'}, {id:service('HOUSE_SV_001').source_id}, ...rounds.map(o=>({id:o.source_id}))];

function OfficialHousingRound({round}: {round:Opportunity}) {const view=housingRoundPresentation(round);return <article className="housing-round" key={round.opportunity_id}><div><h3>{plainLanguage(round.name)}</h3><span className={`badge ${view.status==='UPCOMING'?'badge-scheduled':'badge-neutral'}`}>{view.label}</span></div><p>{formatDate(round.open_from)} – {formatDate(round.open_until)} · {round.location}</p><p>{round.opportunity_id==='OPP_HOUSE_002'?'Khảo sát nhu cầu trong lịch sử; không phải đợt mở để nộp hồ sơ.':round.policy_id==='POL_HOUSE_001'?'Thông báo về mua nhà ở xã hội; không dùng cho nhu cầu thuê.':'Đợt thuê dành cho người có công; chưa xác nhận phù hợp với bạn.'}</p><a className="text-action" href={officialDestination(source(round.source_id).canonical_url)} target="_blank" rel="noopener noreferrer">{view.cta}<ExternalLink size={15}/></a></article>; }

export function HousingSummary({ answers }: {answers: Answers}) {
  const facts = housingConfirmedFacts(answers);
  return <section className="situation-summary"><h2>Những gì bạn đã cho chúng tôi biết</h2>{facts.length ? <ul className="plain-reasons">{facts.map(fact=><li key={fact}><Check size={15}/>{fact}</li>)}</ul> : <p>Chưa có thông tin đã xác nhận.</p>}</section>;
}

function HousingSupportDirection({id,answers,primary=false}: {id:string;answers:Answers;primary?:boolean}) {
  const p = policy(id);
  return <article className={primary?'housing-primary-support':'housing-secondary-support'} data-policy-id={id}>
    <h3>{id==='POL_HOUSE_002'?'Thuê nhà ở xã hội':id==='POL_HOUSE_001'?'Mua nhà ở xã hội':'Nhà ở / lưu trú dành cho người lao động'}</h3><span className="badge badge-review">Cần kiểm tra thêm</span>
    <p>{id==='POL_HOUSE_003'?'Kiểm tra khi có chương trình hoặc đợt tiếp nhận chính thức.':`Xem thông báo đúng loại hình ${id==='POL_HOUSE_001'?'mua':'thuê'} và yêu cầu đối với trường hợp của bạn.`}</p>
    <details><summary>Vì sao có gợi ý này?</summary><p>{id==='POL_HOUSE_003'?'Có hướng nhà lưu trú công nhân; cần hỏi đúng chương trình.':answers.housingIntent===(id==='POL_HOUSE_001'?'BUY':'RENT')?'Bạn đã chọn nhu cầu này.':'Đây là hướng hỗ trợ có thể kiểm tra song song với việc tìm chỗ ở; chưa xác nhận có chương trình phù hợp với bạn.'}</p><p>{plainLanguage(p.summary)}</p></details>
  </article>;
}

function ChildSuggestion({answers,onChild}: {answers:Answers;onChild:()=>void}) {
  return answers.housingHasChild === 'YES' ? <aside className="housing-child-note"><h3>Gia đình có trẻ nhỏ?</h3><p>Bạn cũng có thể kiểm tra các hướng chăm sóc trẻ và hỗ trợ liên quan.</p><button className="text-action" onClick={onChild}>Xem tình huống có con nhỏ<ArrowRight size={16}/></button></aside> : null;
}

export function HousingResultsV2({answers,onPlan,onSupport,onChild,items=housingOpportunities}: {answers:Answers;onPlan:()=>void;onSupport:()=>void;onChild:()=>void;items?:DemoHousingOpportunity[]}) {
  const target = service('HOUSE_SV_001');
  const options = rankHousingOptions(answers,items);
  const budgetKnown = housingBudgetCeilings[answers.housingBudget ?? ''] !== undefined;
  const capacityOptions = options.filter(option=>!option.capacityMismatch);
  const noCapacityMatch = !!answers.householdSize && capacityOptions.length===0;
  const noBudgetMatch = budgetKnown && !(capacityOptions.length?capacityOptions:options).some(option=>option.budgetFull);
  const supportDirections = housingSupportDirections(answers);
  return <>
    <h2 className="housing-story-heading">Bạn có 2 hướng đáng xem</h2>
    <div className="housing-tracks">
      <article className="housing-track"><span className="eyebrow">CHỖ Ở TRƯỚC MẮT</span><h2>Tìm chỗ phù hợp khả năng</h2><p>Dựa trên ngân sách, khu vực và quy mô gia đình, đây là một số phương án tham khảo đáng xem trước.</p><button className="primary-button" onClick={()=>focusHousing('housing-options')}>Xem hướng tìm chỗ ở<ArrowRight size={17}/></button></article>
      <article className="housing-track"><span className="eyebrow">HỖ TRỢ NHÀ Ở</span><h2>Kiểm tra phương án hỗ trợ nhà ở</h2><p>Bạn cũng có thể kiểm tra các hướng thuê, mua nhà ở xã hội hoặc chương trình nhà ở phù hợp.</p><button className="outline-button" onClick={()=>focusHousing('housing-support')}>Xem hướng hỗ trợ<ArrowRight size={17}/></button></article>
    </div>
    <section id="housing-options" className="housing-section" tabIndex={-1} aria-labelledby="housing-options-title"><h2 id="housing-options-title">Loại chỗ ở và nơi tìm thông tin</h2><p>Các lựa chọn được sắp xếp theo thông tin bạn vừa cung cấp.</p>
      {!options.some(item=>isConcreteOpportunity(item.opportunity))&&<p className="direction-note">AN SINH 360 chưa có tin phòng cụ thể đã được xác minh cho lựa chọn này. Các mức giá là khoảng tham khảo cho loại hình, chưa có nguồn/ngày đối chiếu để khẳng định giá thị trường hiện tại. Giá và tình trạng chỗ ở có thể thay đổi. Vui lòng xác nhận lại trước khi quyết định.</p>}
      {noCapacityMatch && <div className="housing-budget-message"><p>Chưa có phương án nào trong dữ liệu hiện tại đáp ứng đủ số người ở.</p><h3>Phương án gần nhất để tham khảo</h3></div>}
      {noBudgetMatch && <div className="housing-budget-message"><p>Đối với các loại hình đáp ứng số người ở bạn chọn:</p><p>Chưa có phương án nào trong dữ liệu hiện tại khớp hoàn toàn với ngân sách bạn chọn.</p><h3>Phương án gần nhất để tham khảo</h3></div>}
      
      {options.some(item=>isConcreteOpportunity(item.opportunity))&&<p className="housing-info-note">Giá và tình trạng chỗ ở có thể thay đổi. Vui lòng xác nhận lại trước khi quyết định.</p>}<div className="housing-option-list">{options.map(item=><HousingOptionCard key={item.opportunity.id} item={item} answers={answers}/>)}</div><HousingSearchDestination/>
    </section>
    <section id="housing-support" className="housing-section housing-support-path" tabIndex={-1}><span className="eyebrow">HỖ TRỢ NHÀ Ở · SONG SONG</span><h2>{answers.housingIntent === 'BUY' || answers.housingIntent === 'RENT' ? 'Các hướng bạn có thể kiểm tra' : 'Hướng hỗ trợ bạn có thể kiểm tra'}</h2><p>Nhu cầu chỗ ở giúp chọn hướng tìm hiểu; chưa xác nhận điều kiện hưởng.</p>
      <div className="housing-support-directions"><HousingSupportDirection id={supportDirections[0]} answers={answers} primary/><details className="housing-other-directions"><summary>Các hướng khác có thể xem thêm</summary>{supportDirections.slice(1).map(id=><HousingSupportDirection key={id} id={id} answers={answers}/>)}</details></div>
      <div className="housing-missing"><h3>Việc bạn nên kiểm tra tiếp:</h3><p><strong>Xác định bạn thuộc nhóm nào trong thông báo của chương trình.</strong></p><h4>Tìm ở đâu?</h4><p>Đọc mục đối tượng trong thông báo chính thức của đúng chương trình. Nếu chưa rõ, hỏi đầu mối nhà ở về trường hợp của bạn trước khi chuẩn bị giấy tờ.</p></div>
      <a className="text-action" href={target.online_url || source(target.source_id).canonical_url} target="_blank" rel="noopener noreferrer">Xem hướng dẫn nhà ở Đà Nẵng<ExternalLink size={15}/></a>
    </section>
    <section id="housing-rounds" className="housing-section" tabIndex={-1}><h2>Các đợt / chương trình nên theo dõi</h2>{answers.housingIntent==='RENT' && <p>Chưa có đợt tiếp nhận thuê nhà ở xã hội hiện hành đã được xác minh trong dữ liệu hiện tại.</p>}<p>Tra cứu thông báo mới trên cổng Đà Nẵng; xem cơ quan và cách liên hệ trong đúng thông báo. Nếu chưa tìm được nơi hỏi, gọi 1022.</p><a className="text-action" href="https://danang.gov.vn/" target="_blank" rel="noopener noreferrer">Tra cứu thông báo nhà ở xã hội</a><a className="text-action" href="tel:1022">Gọi 1022 để hỏi đầu mối nhà ở</a><p>Thông báo chính thức về các đợt và chương trình nhà ở. Trạng thái theo dữ liệu ngày {formatDate(dataset.provenance.snapshotDate)}; cần kiểm tra thông báo mới nhất.</p>
      {rounds.filter(round=>housingRoundPresentation(round).status!=='CLOSED').map(round=><OfficialHousingRound key={round.opportunity_id} round={round}/>)}
      <details className="housing-history"><summary>Các đợt trước đây</summary><p>Các thông báo dưới đây chỉ để tham khảo; không phải phương án đang tiếp nhận cho bạn.</p>{rounds.filter(round=>housingRoundPresentation(round).status==='CLOSED').map(round=><OfficialHousingRound key={round.opportunity_id} round={round}/>)}</details>
    </section>
    <section className="housing-next"><h2>Từ phương án đến việc cần làm</h2><p>Đi từng bước theo nhu cầu bạn đã chọn.</p><button className="outline-button" onClick={onPlan}>Xem tôi cần làm gì<ArrowRight size={17}/></button></section>
    <ChildSuggestion answers={answers} onChild={onChild}/><button className="outline-button" onClick={onSupport}>Tôi cần người hỗ trợ</button><SourceDisclosure entries={sourceEntries}/>
  </>;
}

export function HousingActionPlan({answers,onSupport,onResultSection,onChild}: {answers:Answers;onSupport:()=>void;onResultSection:(id:string)=>void;onChild:()=>void}) {
  const steps = housingPlanSteps(answers);
  return <><div className="housing-plan-steps">{steps.map((step,index)=><article key={step.time}><span className="eyebrow">{step.time}</span><h2>{index+1}. {step.title}</h2><p>{step.text}</p>{'checklist' in step && step.checklist && <ul>{step.checklist.map(item=><li key={item}>{item}</li>)}</ul>}{!steps.slice(0,index).some(previous=>previous.target===step.target) && <button className={index===0?'primary-button':'text-action'} onClick={()=>onResultSection(step.target)}>{step.target==='housing-search-destination'?'Xem nơi tìm tin cụ thể':step.target==='housing-options'?'Xem điều cần hỏi với tin tìm được':step.target==='housing-support'?'Xem hướng hỗ trợ':'Xem thông báo các đợt'}<ArrowRight size={16}/></button>}</article>)}</div><ChildSuggestion answers={answers} onChild={onChild}/><button className="outline-button" onClick={onSupport}>Tôi cần người hỗ trợ</button><SourceDisclosure entries={sourceEntries}/></>;
}

export function HousingSupportSummary({answers}: {answers:Answers}) {
  return <section className="job-support-summary"><h3>Tóm tắt để nhờ hỗ trợ</h3><dl><dt>Hoàn cảnh</dt><dd>Đang khó khăn về nhà ở</dd><dt>Đã biết</dt><dd>{housingConfirmedFacts(answers).length ? <ul>{housingConfirmedFacts(answers).map(fact=><li key={fact}>{fact}</li>)}</ul> : 'Chưa có thông tin đã xác nhận.'}</dd><dt>Đang cần</dt><dd>{answers.housingIntent==='BUY'||answers.housingIntent==='RENT'?'Kiểm tra hướng hỗ trợ nhà ở và tìm chỗ phù hợp khả năng':'Tìm chỗ ở phù hợp và kiểm tra hướng hỗ trợ nhà ở'}</dd></dl><p>Bạn có thể chụp màn hình hoặc dùng phần này khi hỏi nơi hỗ trợ.</p></section>;
}

export function HousingOptionCard({item,answers}:{item:ReturnType<typeof rankHousingOptions>[number];answers:Answers}) {
  const o=item.opportunity;
  const concrete=isConcreteOpportunity(o), freshness=housingFreshness(o), child=knownHousingChildSuitability(o);
  return <article className="housing-option" data-kind={concrete?'concrete':'direction'}>
    <div className="housing-match-labels"><span>{item.matchLabel}</span>{item.capacityMismatch&&<span className="housing-budget-warning">⚠ Chưa đáp ứng đủ số người ở</span>}{item.overBudget&&<span className="housing-budget-warning">Vượt ngân sách bạn chọn</span>}</div>
    <div className="housing-option-heading"><h3>{concrete?o.title:directionTitle(o)}</h3><span className="badge badge-review">{freshness.label}</span></div>
    <p>{concrete?o.exactAddress:`Khu vực nên tìm: ${o.area.replace('Khu vực ','')}`}</p>
    {concrete&&<p>{o.area} {o.sizeText&&`· ${o.sizeText}`}</p>}
    <strong className="housing-price">{concrete?o.monthlyPriceText:referenceAmount(o.monthlyPriceText)}</strong>
    
    <p>{o.capacityText.replace(/^Minh họa /,'Loại hình cho ')}</p>
    {answers.housingHasChild==='YES'&&<p>{child===true?'Nguồn có thông tin về điều kiện ở cùng trẻ nhỏ; cần khảo sát thực tế.':child===false?'Nguồn không xác nhận loại chỗ ở này phù hợp khi có trẻ nhỏ.':'Chưa có thông tin xác nhận về điều kiện ở cùng trẻ nhỏ.'}</p>}
    {concrete&&<p className="source-meta">Nguồn: {o.sourceName} · Cập nhật: {o.verifiedAt}</p>}
    <h4>Vì sao đáng xem?</h4><ul>{item.reasons.filter(reason=>reason!=='Vượt ngân sách bạn chọn').map(reason=><li key={reason}>{reason}</li>)}</ul>
    {concrete?<a className="text-action" href={safeSourceUrl(o.sourceUrl)!} target="_blank" rel="noopener noreferrer">Mở nguồn để kiểm tra<ExternalLink size={15}/></a>:<a className="text-action" href="#housing-search-destination" onClick={event=>{event.preventDefault();focusHousing('housing-search-destination');}}>Xem nơi tìm tin có địa chỉ và nguồn<ArrowRight size={16}/></a>}
    <details><summary>Xem điều cần xác nhận</summary>
      {concrete?<dl><dt>Tiền cọc</dt><dd>{opportunityReferenceText(o.depositText)}</dd><dt>Điện nước / phí khác</dt><dd>{o.utilitiesText}</dd><dt>Số người tối đa</dt><dd>{o.capacityText.replace(/^Minh họa /,'')}</dd>{o.sizeText&&<><dt>Diện tích</dt><dd>{o.sizeText}</dd></>}<dt>Nơi xác nhận</dt><dd>Mở nguồn gốc; hỏi người đăng thông tin về giá và tình trạng hiện tại.</dd></dl>:<p>Khi tìm được tin có địa chỉ và nguồn, hỏi giá thuê, tiền cọc, điện nước, phí khác, diện tích, số người tối đa và điều kiện ở cùng trẻ nhỏ. Không chuyển tiền khi chưa đối chiếu tin và xem trực tiếp.</p>}
      
    </details>
  </article>;
}
function HousingSearchDestination() {
  return <div className="direction-destination" id="housing-search-destination" tabIndex={-1}><h3>Tìm ở đâu, tiếp tục thế nào?</h3><p>Chưa có đầu mối phòng trọ cụ thể trong dữ liệu hiện tại. Bạn có thể gọi 1022 để hỏi đầu mối tại địa phương.</p><p>Ghi khu vực, ngân sách tối đa và số người. Khi tìm được tin có địa chỉ và nguồn, hỏi người đăng rồi hẹn xem trực tiếp.</p><a className="text-action" href="tel:1022">Gọi 1022 để hỏi đầu mối tìm chỗ ở</a></div>;
}
