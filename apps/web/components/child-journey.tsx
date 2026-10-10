"use client";

import { ArrowRight, Check, ExternalLink } from 'lucide-react';
import { Answers, service } from '@/lib/demo';
import { childConfirmedFacts, childMaternityDirection, childPlanSteps, rankChildcare, childPrimaryNeed, childAdminState, childAdminLabels } from '@/lib/child-journey';
import { childcareOpportunities, type DemoChildcareOpportunity } from '@/lib/competition-demo';
import { officialDestination, isSearchFallback } from '@/lib/official-destinations';
import { plainLanguage, referenceAmount, opportunityReferenceText } from '@/lib/public-copy';
import { isConcreteOpportunity, directionTitle, safeSourceUrl } from '@/lib/opportunity-grounding';
import { SourceDisclosure } from './source-badge';

export function childMissingFact(a:Answers) {
  if(a.childStage==='NEWBORN') return !childMaternityDirection(a)?'Xác định cần hỏi hướng của cha hay mẹ và thông tin bảo hiểm liên quan.':a.childInsuranceKnown!=='KNOWN'?'Xem lại thông tin bảo hiểm của cha/mẹ.':'Đối chiếu quá trình tham gia bảo hiểm và trường hợp sinh con với nơi tiếp nhận.';
  const need=childPrimaryNeed(a), admin=childAdminState(a);
  return need==='DONE'?'Không có việc còn thiếu được bạn chọn.':need==='CARE'?'Tìm cơ sở thực tế có tên, địa chỉ và nguồn; xác nhận nhóm tuổi, học phí và giờ đón.':need==='SUPPORT'?'Xác định trẻ đang học ở đâu và hỏi xem trường hợp của gia đình có thuộc nhóm áp dụng hay không.':admin.unresolved?'Xác định việc nào đã hoàn thành trước khi hỏi cách làm phần còn thiếu.':`Hỏi cách hoàn thành: ${admin.missing.map(k=>childAdminLabels[k]).join(', ')}.`;
}
export function ChildSummary({answers}:{answers:Answers}) {
  const facts=childConfirmedFacts(answers);
  return <section className="situation-summary"><h2>Những gì bạn đã cho chúng tôi biết</h2>{facts.length?<ul className="plain-reasons">{facts.map(f=><li key={f}><Check size={15}/>{f}</li>)}</ul>:<p>Chưa có thông tin đã xác nhận.</p>}</section>;
}
function OfficialProcedure({id,label}:{id:string;label:string}) {
  return <><a className="text-action" href={officialDestination(service(id).online_url)} target="_blank" rel="noopener noreferrer">{isSearchFallback(service(id).online_url)?'Tra cứu thủ tục chính thức':label}<ExternalLink size={15}/></a>{isSearchFallback(service(id).online_url)&&<p>Tra cứu tên thủ tục trên cổng chính thức. Nếu chưa tìm được nơi tiếp nhận, gọi <a href="tel:1022">1022</a> để hỏi đầu mối.</p>}</>;
}
function AdminTrack({answers,onPlan}:{answers:Answers;onPlan:()=>void}) {
  const admin=childAdminState(answers), expected=answers.childStage==='NEWBORN'&&answers.childBorn==='EXPECTED';
  if(admin.complete) return <p className="completion-note">Các việc cơ bản bạn chọn đã hoàn thành.</p>;
  return <article className="child-track" id="child-admin" tabIndex={-1}><span className="eyebrow">VIỆC CÒN THIẾU CHO TRẺ</span><h2>{expected?'Việc cần làm sau sinh':admin.unresolved?'Xác định việc nào đã hoàn thành':admin.missing.length===1?`Hoàn thành ${childAdminLabels[admin.missing[0]].toLowerCase()} cho trẻ`:'Hoàn thành việc còn thiếu cho trẻ'}</h2>
    <p>{expected?'Gia đình có thể tìm hiểu trước; chỉ làm các việc sau khi bé sinh và có thông tin cần thiết.':admin.unresolved?'Chưa rõ tình trạng từng việc. Đối chiếu giấy tờ đang có, chỉ hỏi cách hoàn thành phần còn thiếu; không coi cả ba việc đều chưa xong.':'Bạn đã chọn những việc dưới đây còn thiếu. Không đề nghị làm lại những việc khác.'}</p>
    {admin.missing.length>0&&<ul className="child-admin-list">{admin.missing.map(k=><li key={k}>{childAdminLabels[k]}</li>)}</ul>}
    <h3>Tìm ở đâu?</h3><p>Giấy tờ gia đình đang có và hướng dẫn thủ tục liên thông. Hỏi cơ quan phụ trách đúng việc còn thiếu; chưa cần nộp lại phần đã hoàn thành.</p>
    <button className="primary-button" onClick={onPlan}>Xem bước cho việc còn thiếu<ArrowRight size={17}/></button><p className="child-provider">Đầu mối: {plainLanguage(service('CHILD_SV_003').provider)}</p><OfficialProcedure id="CHILD_SV_003" label="Xem hướng dẫn thủ tục chính thức"/>
  </article>;
}
function MaternityTrack({answers}:{answers:Answers}) {
  const direction=childMaternityDirection(answers);
  return <article className="child-track" id="child-support" tabIndex={-1}><span className="eyebrow">QUYỀN LỢI GIA ĐÌNH</span><h2>Kiểm tra hướng thai sản</h2><span className="badge badge-review">Cần kiểm tra thêm</span><p>{direction?direction.title:'Hỏi đúng hướng của cha hoặc mẹ; chưa xác định trường hợp cần áp dụng.'}</p><h3>Vì sao có gợi ý này?</h3><p>Gia đình đang ở giai đoạn sắp sinh hoặc vừa sinh.{direction?' Vai trò bạn chọn giúp xác định hướng hỏi; chưa xác nhận điều kiện hưởng.':' Người hỗ trợ cần hỏi thêm hoàn cảnh của cha/mẹ.'}</p><div className="child-missing"><h3>Việc bạn nên kiểm tra tiếp:</h3><p>{childMissingFact(answers)}</p><h4>Tìm ở đâu?</h4><p>Xem thông tin bảo hiểm đang có; hỏi đơn vị sử dụng lao động hoặc bảo hiểm xã hội về đúng trường hợp của cha/mẹ. Biết thông tin bảo hiểm chưa có nghĩa là đủ điều kiện hưởng.</p></div>{direction?<OfficialProcedure id={direction.serviceId} label="Xem hướng dẫn cho trường hợp này"/>:<details><summary>Xem hướng hỏi của cha và mẹ</summary><OfficialProcedure id="CHILD_SV_001" label="Hướng lao động nữ sinh con"/><OfficialProcedure id="CHILD_SV_002" label="Hướng lao động nam có vợ sinh con"/></details>}</article>;
}
const warningReason=(reason:string)=>/cao hơn|chưa khớp|Chỉ một phần|Khác|Cần xác nhận|chưa xác nhận/.test(reason);
const conciseField=(text:string)=>opportunityReferenceText(text).split(';')[0].replace(/\. Cần xác nhận lại với cơ sở\.$/,'').replace(/^Tham khảo: /,'').replace(/^Giờ tham khảo /,'').replace(/^Học phí tham khảo /,'Khoảng ');
const naturalReason=(reason:string)=>reason
  .replace('Học phí cao hơn khoảng bạn chọn','Cao hơn khoảng ngân sách bạn chọn')
  .replace('Giờ đón trẻ chưa khớp nhu cầu; cần hỏi lại','Giờ đón trẻ chưa phù hợp nhu cầu')
  .replace('Chỉ một phần nhóm tuổi phù hợp; cần hỏi tuổi nhận','Chỉ phù hợp một phần nhóm tuổi')
  .replace('Nhóm tuổi chưa khớp; cần xác nhận với cơ sở','Nhóm tuổi chưa phù hợp')
  .replace('Cần xác nhận nhóm tuổi nhận','Chưa rõ nhóm tuổi nhận')
  .replace('Có hướng hỏi về đón muộn; chưa xác nhận giờ và phụ phí','Giờ đón muộn và phụ phí chưa rõ')
  .replace('Học phí trong khoảng bạn chọn; chưa gồm tiền ăn và phụ phí','Học phí trong khoảng bạn chọn')
  .replace('Giờ hoạt động gần nhu cầu đón trẻ; cần xác nhận lại','Giờ hoạt động gần nhu cầu đón trẻ');

export function ChildcareCards({answers,items=childcareOpportunities}:{answers:Answers;items?:DemoChildcareOpportunity[]}) {
  const ranked=rankChildcare(answers,items);
  const hasConcrete=items.some(isConcreteOpportunity);
  return <section className="child-section" id="childcare-options" tabIndex={-1} aria-labelledby="childcare-options-title">
    <h2 id="childcare-options-title">Hướng chăm sóc đáng tìm trước</h2>
    <div className="child-match-note"><p>{ranked[0]?.fullMatch?'Có một loại hình khá sát nhu cầu bạn chọn.':'Chưa có loại hình nào khớp hoàn toàn với nhu cầu bạn chọn.'}</p>{ranked[0]&&<p>{childcareMismatchSummary(ranked[0])}</p>}</div>
    <p className="direction-note">{!hasConcrete&&<>Chưa có cơ sở cụ thể đã được xác minh trong dữ liệu hiện tại. </>}{items.some(o=>!isConcreteOpportunity(o))&&<>Gợi ý loại hình chăm sóc dùng để xác định loại cơ sở trước khi tìm nơi thực tế. Các mức phí và lịch là khoảng tham khảo cho loại hình, chưa có nguồn/ngày đối chiếu để khẳng định thông tin thị trường hiện tại. </>}Thông tin về học phí, giờ hoạt động và tuyển sinh có thể thay đổi. Vui lòng xác nhận lại với cơ sở.</p>
    <div className="child-option-list">{ranked.slice(0,3).map((r,index)=>{
      const o=r.opportunity;
      // Summarize existing reasons only; ordering and matching remain in rankChildcare.
      const mismatchLabels=[
        r.reasons.some(reason=>/Chỉ một phần|Nhóm tuổi chưa khớp/.test(reason))?'độ tuổi':'',
        r.reasons.some(reason=>reason.startsWith('Học phí')&&warningReason(reason))?'ngân sách':'',
        r.reasons.some(reason=>/Giờ đón trẻ chưa khớp|Có hướng hỏi về đón muộn/.test(reason))?'giờ đón':'',
        r.reasons.includes('Khác khu vực ưu tiên')?'khu vực':'',
      ].filter(Boolean);
      const positives=r.reasons.filter(reason=>!warningReason(reason)).map(naturalReason);
      const visible=mismatchLabels.length?
        [`Chưa khớp hoàn toàn ở: ${mismatchLabels.join(' · ')}`,...positives.slice(0,1)]:
        [...positives,...r.reasons.filter(warningReason).map(naturalReason)].slice(0,2);
      const ageReasons=r.reasons.filter(reason=>/nhóm tuổi|Nhóm tuổi/.test(reason));
      const priceReasons=r.reasons.filter(reason=>reason.startsWith('Học phí'));
      const timeReasons=r.reasons.filter(reason=>/Giờ hoạt động|Giờ đón|đón muộn/.test(reason));
      const concrete=isConcreteOpportunity(o);
      const card=<article className="child-option" data-primary={index===0} data-kind={concrete?'concrete':'direction'} key={o.id}>
        <span className="child-match-label">{index===0?r.fullMatch?'Phù hợp nhất hiện có':'Phương án gần nhất':'Có một số điểm để đối chiếu'}</span>
        <h3>{concrete?o.facilityName:directionTitle(o)}</h3><p>{o.area}</p>
        <span className="badge badge-review">{concrete?o.enrollmentStatus==='EXPIRED'?'Thông tin đã hết hạn':o.enrollmentStatus==='RECENT'?'Có thông tin cập nhật gần đây':'Cần xác nhận tuyển sinh':'Gợi ý loại hình chăm sóc'}</span>
        <p>{conciseField(o.ageRangeText)}</p>
        <strong className="child-price">{concrete?conciseField(o.tuitionText):referenceAmount(conciseField(o.tuitionText))}</strong>
        <small className="child-price-note">Chưa gồm tiền ăn và phụ phí.</small>
        <p>{concrete?conciseField(o.openingHoursText):referenceAmount(conciseField(o.openingHoursText))}</p>
        <h4>Vì sao đáng xem?</h4>
        <ul className="child-reasons">{visible.map(reason=><li className={reason.startsWith('Chưa khớp')?'child-mismatch-summary':undefined} key={reason}>{reason.startsWith('Chưa khớp')?reason:`${positives.includes(reason)?'✓':'ℹ'} ${reason}`}</li>)}</ul>
        {concrete?<><p>{o.exactAddress} · Nguồn: {o.sourceName} · Cập nhật: {o.verifiedAt}</p><a className="text-action" href={safeSourceUrl(o.sourceUrl)!} target="_blank" rel="noopener noreferrer">Mở nguồn / Liên hệ cơ sở<ExternalLink size={15}/></a></>:<a className="text-action" href="#childcare-search-destination">Xem nơi tìm cơ sở thực tế<ArrowRight size={15}/></a>}
        <details><summary>Xem điều cần xác nhận</summary>
          <div className="child-detail-groups">
            <section><h4>Độ tuổi</h4><p>{conciseField(o.ageRangeText)}</p>{ageReasons.map(reason=><p className="child-detail-reason" key={reason}>{naturalReason(reason)}</p>)}</section>
            <section><h4>Chi phí</h4><dl>
              <dt>Học phí</dt><dd>{concrete?conciseField(o.tuitionText):referenceAmount(conciseField(o.tuitionText))}</dd>
              <dt>Tiền ăn</dt><dd>{concrete?conciseField(o.mealFeeText):referenceAmount(conciseField(o.mealFeeText))}</dd>
              <dt>Phụ phí / ngoài giờ</dt><dd>Hỏi phí đầu năm, các khoản ngoài giờ và cách tính tiền ăn vào ngày nghỉ.</dd>
            </dl>{priceReasons.map(reason=><p className="child-detail-reason" key={reason}>{warningReason(reason)?'⚠':'✓'} {naturalReason(reason)}</p>)}</section>
            <section><h4>Thời gian</h4><p>{concrete?conciseField(o.openingHoursText):referenceAmount(conciseField(o.openingHoursText))}</p>
              <p>{!concrete?'Hỏi cơ sở thực tế có nhận trả trẻ muộn và phụ phí không.':o.latePickupAvailable?'Có hướng hỏi về giữ trẻ muộn; giờ nhận/trả và phụ phí chưa rõ.':'Chưa có thông tin về giữ trẻ muộn.'}</p>
              {timeReasons.map(reason=><p className="child-detail-reason" key={reason}>{naturalReason(reason)}</p>)}
            </section>
            <section><h4>Trước khi chọn</h4><p>{concrete?o.exactAddress:'Chưa có địa chỉ cơ sở thực tế để liên hệ; không coi một khu vực là tên trường.'}</p>
              {r.reasons.includes('Khác khu vực ưu tiên')&&<p className="child-detail-reason">Khác khu vực ưu tiên</p>}
              <p>Chưa rõ tình trạng nhận trẻ hiện tại. Hỏi địa chỉ cơ sở thực tế, giấy phép và điều kiện an toàn; nên trao đổi và xem trực tiếp trước khi chọn.</p>
            </section>
          </div>
          
        </details>
      </article>;
      return index===0?card:<details className="child-alternative" key={o.id}><summary>{index===1?'Có thể xem thêm':'Gợi ý khác'} · {concrete?o.facilityName:directionTitle(o)} · {o.area}</summary>{card}</details>;
    })}</div><ChildcareSearchDestination/>
  </section>;
}
function ChildcareSearchDestination() {
  return <div className="direction-destination" id="childcare-search-destination" tabIndex={-1}><h3>Tìm cơ sở thực tế trong khu vực</h3><p>Gọi 1022 để hỏi đầu mối/cơ sở phù hợp tại khu vực. Chuẩn bị nhóm tuổi, khu vực, tổng ngân sách và giờ đón; hỏi nơi tìm cơ sở có tên, địa chỉ, giấy phép rồi liên hệ cơ sở để kiểm tra.</p><a className="text-action" href="tel:1022">Gọi 1022 để hỏi nơi tìm cơ sở</a></div>;
}
function PreschoolSupport({answers}:{answers:Answers}) {
  return <section className="child-section child-support-direction" id="child-support" tabIndex={-1}><p>Gia đình bạn cũng có một hướng hỗ trợ nên kiểm tra</p><h2>Hỗ trợ mầm non cho con người lao động</h2><span className="badge badge-review">Cần kiểm tra thêm</span><h3>Vì sao có gợi ý này?</h3><p>{answers.childStage==='PRESCHOOL'?'Bạn chọn giai đoạn đang hoặc sắp đi nhà trẻ / mầm non.':childPrimaryNeed(answers)==='SUPPORT'?'Bạn chọn kiểm tra hỗ trợ liên quan.':'Bạn chọn tìm nơi gửi trẻ; hướng này chỉ nên hỏi nếu trẻ đang học mầm non.'} Đây là hướng tìm hiểu liên quan, chưa xác nhận trẻ đang học tại cơ sở thuộc nhóm áp dụng. Chưa có kết luận về điều kiện hưởng của gia đình.</p><div className="child-missing"><h3>Việc bạn nên kiểm tra tiếp:</h3><p>Xác định cơ sở trẻ đang học và hỏi trường hợp của gia đình có thuộc nhóm áp dụng hay không.</p><h4>Tìm ở đâu?</h4><p>Hỏi cơ sở mầm non trẻ đang học hoặc Ủy ban nhân dân xã/phường theo hướng dẫn của Ủy ban nhân dân / Sở Giáo dục và Đào tạo Đà Nẵng. Hỏi rõ loại hình cơ sở, trường hợp của gia đình và giấy tờ cần đối chiếu. Nếu trẻ chưa học tại cơ sở, hỏi đầu mối địa phương / cơ quan được nêu trong hướng dẫn. Gọi 1022 nếu chưa biết nơi phụ trách để hỏi.</p></div><p>Bước tiếp theo: mở hướng dẫn, ghi câu hỏi về trường hợp của gia đình rồi hỏi cơ sở đang học hoặc đầu mối địa phương. Nếu trẻ chưa học mầm non, chưa coi hướng này là quyền lợi hiện có.</p><p>Đầu mối trong dữ liệu: Ủy ban nhân dân / Sở Giáo dục và Đào tạo Đà Nẵng.</p><OfficialProcedure id="CHILD_SV_004" label="Xem hướng dẫn hỗ trợ mầm non"/><a className="text-action" href="tel:1022">Gọi 1022 để hỏi đầu mối địa phương</a></section>;
}
export function ChildJourneyResults({answers,onPlan,onSupport,onCare,onChooseNeed}:{answers:Answers;onPlan:()=>void;onSupport:()=>void;onCare:()=>void;onChooseNeed?:(need:'CARE'|'SUPPORT')=>void}) {
  const need=childPrimaryNeed(answers), newborn=answers.childStage==='NEWBORN', admin=childAdminState(answers);
  const sourceIds=newborn?['SRC_CHILD_LAW_001','SRC_CHILD_PROC_003',...(childMaternityDirection(answers)?[service(childMaternityDirection(answers)!.serviceId).source_id]:['SRC_CHILD_PROC_001','SRC_CHILD_PROC_002'])]:need==='CARE'||need==='SUPPORT'?['SRC_CHILD_DN_001','SRC_CHILD_DN_002']:need==='ADMIN'?['SRC_CHILD_PROC_003']:[];
  return <>
    {newborn?<><h2 className="child-story-heading">{admin.complete?'Các việc cơ bản bạn chọn đã hoàn thành.':'Gia đình bạn có 2 việc nên làm song song'}</h2><div className="child-tracks">{!admin.complete&&<AdminTrack answers={answers} onPlan={onPlan}/>}<MaternityTrack answers={answers}/></div></>:need==='CARE'?<><ChildcareCards answers={answers}/><PreschoolSupport answers={answers}/></>:need==='SUPPORT'?<><h2 className="child-story-heading">Kiểm tra hướng hỗ trợ liên quan</h2>{admin.complete&&<p className="completion-note">Các việc cơ bản bạn chọn đã hoàn thành.</p>}<p>Đây là nhu cầu bạn chọn. Nguồn hiện có hướng hỗ trợ mầm non; cần xác định trường hợp thực tế, không tự kết luận được hưởng.</p><PreschoolSupport answers={answers}/></>:need==='ADMIN'?<AdminTrack answers={answers} onPlan={onPlan}/>:<section className="child-completed"><h2>Các việc bạn chọn hiện đã hoàn thành.</h2><p>Không có việc còn thiếu được bạn chọn; không cần làm lại khai sinh, cư trú hay bảo hiểm y tế.</p><details><summary>Bạn có thể xem thêm khi cần</summary><button className="text-action" onClick={()=>onChooseNeed?onChooseNeed('CARE'):onCare()}>Tìm nơi gửi trẻ</button><button className="text-action" onClick={()=>onChooseNeed?onChooseNeed('SUPPORT'):onSupport()}>Kiểm tra hỗ trợ liên quan</button></details></section>}
    <div className="child-result-actions">{(need!=='ADMIN'||admin.complete)&&need!=='DONE'&&<button className="primary-button" onClick={onPlan}>Xem bước tiếp theo cho nhu cầu này<ArrowRight size={17}/></button>}<button className={need==='DONE'?'primary-button':'outline-button'} onClick={onSupport}>Tôi cần người hỗ trợ</button></div>
    {sourceIds.length>0&&<SourceDisclosure entries={sourceIds.map(id=>({id}))}/>}
  </>;
}
export function ChildActionPlan({answers,onResultSection,onSupport}:{answers:Answers;onResultSection:(id:string)=>void;onSupport:()=>void}) {
  const direction=childMaternityDirection(answers);
  const admin=service('CHILD_SV_003');
  const plainName=(text:string)=>plainLanguage(text.replace('UBND/Sở GD&ĐT','Ủy ban nhân dân / Sở Giáo dục và Đào tạo'));
  const cta=(target:string)=>target==='childcare-search-destination'?'Xem nơi hỏi cơ sở trong khu vực':target==='childcare-options'?'Xem hướng tìm cơ sở thực tế':target==='child-admin'?'Xem nơi thực hiện việc còn thiếu':answers.childStage==='NEWBORN'?'Xem hướng thai sản':'Xem hướng hỗ trợ liên quan';
  const steps = childPlanSteps(answers);
  return <>{steps.length===0&&<p className="completion-note">Các việc bạn chọn hiện đã hoàn thành. Không có việc cần làm lại.</p>}<div className="child-plan-list">{steps.map((step,index)=><article className="child-plan-step" key={step.title}><span className="eyebrow">{index+1} · {step.time}</span><h2>{step.title}</h2><h3>Vì sao?</h3><p>{step.why}</p><h3>Tìm ở đâu?</h3><p>{step.where}</p>
    {step.target==='child-admin'&&<p className="child-provider">Đầu mối: {plainName(admin.provider)}. Hướng dẫn: {plainName(admin.service_name)}.</p>}
    {step.target==='child-support'&&<p className="child-provider">Đầu mối: {answers.childStage==='NEWBORN' ? direction?plainName(service(direction.serviceId).provider):'Đơn vị sử dụng lao động hoặc Bảo hiểm xã hội; hỏi đúng hướng cha/mẹ' : plainName(service('CHILD_SV_004').provider)}.</p>}
    {step.target==='childcare-search-destination'&&<a className="text-action" href="tel:1022">Gọi 1022 để hỏi nơi tìm cơ sở</a>}{step.checklist&&<ul>{step.checklist.map(item=><li key={item}>{item}</li>)}</ul>}<h3>Bước tiếp theo</h3><p>{step.next}</p>{!steps.slice(0,index).some(previous=>previous.target===step.target) && <button className={index===0?"primary-button":"text-action"} onClick={()=>onResultSection(step.target)}>{cta(step.target)}<ArrowRight size={16}/></button>}</article>)}</div><button className="outline-button" onClick={onSupport}>Tôi cần người hỗ trợ</button></>;
}
export function ChildSupportSummary({answers}:{answers:Answers}) {
  const preschool=answers.childStage==='PRESCHOOL', newborn=answers.childStage==='NEWBORN';
  const facts=childConfirmedFacts(answers);
  return <section className="child-support-summary"><h3>Tóm tắt để nhờ hỗ trợ</h3><dl><dt>Hoàn cảnh</dt><dd>{preschool?'Có con đang hoặc sắp đi nhà trẻ / mầm non':newborn?answers.childBorn==='EXPECTED'?'Gia đình sắp có em bé':answers.childBorn==='BORN'?'Gia đình vừa có em bé':'Gia đình đang tìm hiểu các việc khi có em bé':'Gia đình có trẻ dưới 6 tuổi'}</dd><dt>Đã biết</dt><dd>{facts.length?<ul>{facts.map(f=><li key={f}>{f}</li>)}</ul>:'Chưa có thông tin đã xác nhận.'}</dd><dt>Cần kiểm tra tiếp</dt><dd>{childMissingFact(answers)}</dd><dt>Đang cần</dt><dd>{newborn?childAdminState(answers).complete?'Kiểm tra hướng thai sản; các việc cơ bản đã xong':'Chỉ làm việc sau sinh còn thiếu + kiểm tra hướng thai sản':childPrimaryNeed(answers)==='CARE'?'Tìm nơi chăm sóc phù hợp':childPrimaryNeed(answers)==='SUPPORT'?'Kiểm tra hướng hỗ trợ liên quan':childPrimaryNeed(answers)==='DONE'?'Hiện chưa cần việc khác':'Hoàn thành việc còn thiếu đã chọn'}</dd></dl><p>Bạn có thể chụp màn hình hoặc đọc phần này khi liên hệ nơi hỗ trợ.</p></section>;
}


function childcareMismatchSummary(r:ReturnType<typeof rankChildcare>[number]) {
  const labels=[r.reasons.some(x=>/Chỉ một phần|Nhóm tuổi chưa khớp/.test(x))?'độ tuổi':'',r.reasons.some(x=>x.startsWith('Học phí')&&warningReason(x))?'ngân sách':'',r.reasons.some(x=>/Giờ đón trẻ chưa khớp|Có hướng hỏi về đón muộn/.test(x))?'giờ đón':'',r.reasons.includes('Khác khu vực ưu tiên')?'khu vực':''].filter(Boolean);
  return labels.length?`Chưa khớp ở: ${labels.join(' · ')}`:'';
}
