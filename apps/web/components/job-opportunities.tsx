"use client";
import { referenceAmount } from "@/lib/public-copy";
import { useState } from "react";
import { opportunityDisclosure, opportunityReferenceText, opportunityLabel } from "@/lib/public-copy";
import { isConcreteOpportunity, safeSourceUrl } from "@/lib/opportunity-grounding";
import { jobPreferenceQuestions, rankJobDirections, type JobPreference } from "@/lib/job-journey";
import { ArrowRight, ExternalLink, Info } from "lucide-react";
import { JobServiceHandoff } from "./job-service-handoff";

export function JobOpportunities() {
  const [preference, setPreference] = useState<JobPreference>({ occupation: "", area: "", shift: "" });
  const [index, setIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const question = jobPreferenceQuestions[index];

  const directions = rankJobDirections(preference);
  function move(next: number) { setIndex(next); document.getElementById("job-opportunities")?.focus(); }
  return <>
    {!submitted ? <section className="job-preference-form" aria-label="Nhu cầu tìm việc"><span className="card-kicker">TÌM LẠI THU NHẬP · CÂU {index + 1}/3</span><h2>{question.title}</h2><p>Ba lựa chọn ngắn giúp tìm hướng việc làm phù hợp hơn. Tin tuyển dụng cần được xác nhận lại.</p>
      <div className="answer-options" role="radiogroup" aria-label={question.title}>{question.options.map(([value, label], optionIndex) => <button key={value} role="radio" aria-checked={preference[question.key] === value} className={`answer-option ${preference[question.key] === value ? "selected" : ""}`} onKeyDown={(event) => {
        if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const options=question.options;
        const next=event.key === "Home" ? 0 : event.key === "End" ? options.length-1 : (optionIndex+(event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1)+options.length)%options.length;
        setPreference(previous=>({...previous,[question.key]:options[next][0]}));
        (event.currentTarget.parentElement?.children[next] as HTMLElement)?.focus();
      }} onClick={() => setPreference((previous) => ({ ...previous, [question.key]: value }))}><strong>{label}</strong><span className="radio-dot" /></button>)}</div>
      <div className="job-filter-controls">{index > 0 && <button className="back-link" onClick={() => move(index - 1)}>← Quay lại lựa chọn trước</button>}<button className="primary-button" disabled={!preference[question.key]} onClick={() => { if (index < 2) move(index + 1); else { setSubmitted(true); document.getElementById("job-opportunities")?.focus(); } }}>{index === 2 ? "Xem các hướng việc làm" : "Tiếp tục"}<ArrowRight size={17} /></button></div>
    </section> : <section className="job-opportunity-results" aria-labelledby="job-directions-title"><h2 id="job-directions-title">Một số hướng công việc đáng tìm</h2><p>Ưu tiên hướng gần các lựa chọn bạn vừa cung cấp. Đây chưa phải danh sách việc đang tuyển.</p><button className="text-action" onClick={() => { setSubmitted(false); move(0); }}>Đổi lựa chọn tìm việc</button>
      {directions.every((item) => item.score === 0) && <p>Chưa có hướng sát ba lựa chọn của bạn trong thông tin hiện có. Bạn có thể hỏi Trung tâm về nhu cầu này.</p>}
      <p className="job-demo-disclosure"><Info size={17} aria-hidden /><span>{opportunityDisclosure} Thu nhập và lịch là khoảng tham khảo cho hướng công việc; chưa có nguồn/ngày đối chiếu của tin tuyển dụng cụ thể.</span></p>
      <JobOpportunityCards directions={directions} />
    </section>}
  </>;
}

export function JobOpportunityCards({ directions }: { directions: ReturnType<typeof rankJobDirections> }) {
  const [selectedTitle,setSelectedTitle] = useState<string>();
  const openDestination=(title:string)=>{setSelectedTitle(title); requestAnimationFrame(()=>{const target=document.getElementById("job-search-destination");target?.focus();target?.scrollIntoView({block:"start",behavior:"instant"});});};
  return <><div className="job-opportunity-list">{directions.map(({ opportunity, reasons }) => <article className="job-opportunity-item" key={opportunity.id} data-opportunity-id={opportunity.id}>
        <div className="job-opportunity-heading"><h3>{opportunity.jobTitle}</h3><span className="badge badge-review">{isConcreteOpportunity(opportunity)?opportunityLabel("JOB"):"Gợi ý hướng công việc"}</span></div><p className="job-area">{opportunity.area}</p><dl><dt>Thu nhập</dt><dd>{isConcreteOpportunity(opportunity)?opportunity.salaryText:referenceAmount(opportunity.salaryText)}</dd><dt>Lịch làm việc</dt><dd>{opportunityReferenceText(opportunity.shift)}</dd></dl>
        <h4>Vì sao đáng tìm?</h4><ul className="job-short-reasons">{reasons.slice(0, 2).map((reason) => <li key={reason}>{reason}</li>)}</ul>
        <details className="job-extra-details"><summary>Xem thêm</summary><p>{opportunityReferenceText(opportunity.whyRecommended)}</p><h4>Yêu cầu nên hỏi lại</h4><ul>{opportunity.requirements.slice(0, 2).map((requirement) => <li key={requirement}>{requirement}</li>)}</ul></details>
        {isConcreteOpportunity(opportunity)?<><p>{opportunity.employer} · Nguồn: {opportunity.sourceName} · Cập nhật: {opportunity.verifiedAt}</p><a className="text-action" href={safeSourceUrl(opportunity.sourceUrl)!} target="_blank" rel="noopener noreferrer">Mở tin gốc<ExternalLink size={15}/></a></>:<><button className="text-action" onClick={()=>openDestination(opportunity.jobTitle)}>Tìm tin đang tuyển cho công việc này<ArrowRight size={16}/></button></>}
      </article>)}</div>{selectedTitle&&<p className="job-search-context">Bạn đang tìm tin cho hướng: <strong>{selectedTitle}</strong></p>}<JobServiceHandoff /></>;
}
