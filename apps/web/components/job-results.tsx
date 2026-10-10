"use client";
import { useEffect, useState } from "react";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import { type Answers, policy, service } from "@/lib/demo";
import { jobBenefitDirection } from "@/lib/job-journey";
import { jobNextAction, jobFirstAction } from "@/lib/action-plan";
import { competitionActions, jobRecommendations, competitionServices } from "@/lib/competition-demo";
import { SourceDisclosure } from "./source-badge";
import { JobOpportunities } from "./job-opportunities";

export function JobResults({ answers, onPlan, onSupport, requestedSection }: { answers: Answers; onPlan: () => void; onSupport: () => void; requestedSection?: "jobs" | "training" }) {
  const [jobsOpen, setJobsOpen] = useState(requestedSection === "jobs");
  const [trainingOpen, setTrainingOpen] = useState(requestedSection === "training");
  const direction = jobBenefitDirection(answers);
  const next = jobNextAction(answers);
  const center = competitionServices.find((item) => item.id === "JOB_SV_006")!;
  const training = competitionServices.find((item) => item.id === "JOB_SV_010")!;
  const reasonAction = competitionActions.find((item) => item.id === "ACTION_JOB_REASON")!;
  const missing = { employment: "Tình trạng chấm dứt việc làm", insurance: "Thông tin tham gia bảo hiểm thất nghiệp", termination: "Lý do chấm dứt việc làm", duration: "Thông tin quá trình tham gia bảo hiểm thất nghiệp", support: "Hướng hỗ trợ cần trao đổi với Trung tâm", preparation: "Đối chiếu hồ sơ với nơi tiếp nhận" }[next];
  useEffect(() => { if (requestedSection === "jobs") setJobsOpen(true); if (requestedSection === "training") setTrainingOpen(true); }, [requestedSection]);
  useEffect(() => {
    if (!jobsOpen) return;
    const frame = requestAnimationFrame(() => { const target = document.getElementById("job-opportunities"); target?.focus(); target?.scrollIntoView({ block: "start", behavior: "instant" }); });
    return () => cancelAnimationFrame(frame);
  }, [jobsOpen]);
  return <>
    <h2 className="job-story-heading">Bạn có 2 việc nên làm song song</h2>
    <div className="job-two-tracks">
      <article className="job-benefit-track"><span className="action-label">ỔN ĐỊNH TRƯỚC MẮT</span><h2>{jobRecommendations[0].title}</h2><span className={`badge ${direction.badge === "Có dấu hiệu phù hợp" ? "badge-good" : "badge-review"}`}>{direction.badge}</span><h3>Việc bạn nên làm trước</h3><p>{jobFirstAction(answers)}</p><h3>Nơi có thể hỏi</h3><p className="compact-contact"><strong>{center.title}</strong><br/>{center.address}<br/><a href={`tel:${center.phone!.replace(/\s/g, "")}`}>{center.phone}</a></p><button className="primary-button" onClick={onPlan}>Xem 3 bước kiểm tra trợ cấp<ArrowRight size={17} /></button></article>
      <article className="job-income-track"><span className="action-label">QUAY LẠI THU NHẬP</span><h2>{jobRecommendations[1].title}</h2><p>Bạn có thể bắt đầu tìm cơ hội mới song song với việc kiểm tra quyền lợi.</p><p className="job-caution">Ba lựa chọn ngắn giúp tìm hướng việc làm phù hợp hơn; cần xác nhận lại tin tuyển dụng.</p><button className="outline-button" onClick={() => { setJobsOpen(true); if (jobsOpen) { const target = document.getElementById("job-opportunities"); target?.focus(); target?.scrollIntoView({ block: "start", behavior: "instant" }); } }}>Xem việc phù hợp<ArrowRight size={17} /></button></article>
    </div>
    <section className="job-recommendation-detail" aria-label="Lý do gợi ý và việc cần kiểm tra">
      <div className="job-why"><h3>Vì sao có gợi ý này?</h3>{direction.reasons.length ? <ul className="job-reasons">{direction.reasons.map((reason) => <li key={reason}><Check size={16} />{reason}</li>)}</ul> : <p>Thông tin bạn cung cấp chưa đủ để chọn hướng quyền lợi cụ thể. Hãy hỏi Trung tâm về trường hợp của bạn.</p>}</div>
      <div className="job-priority-fact"><h3>Việc bạn nên kiểm tra tiếp:</h3><strong>{missing}</strong><h4>Tìm ở đâu?</h4><p>{next === "termination" || next === "employment" ? reasonAction.whereToFindInfo : next === "insurance" || next === "duration" ? "Thông tin quá trình tham gia bảo hiểm đang có, đơn vị sử dụng lao động hoặc Trung tâm Dịch vụ việc làm." : "Hướng dẫn của đúng thủ tục và trao đổi với Trung tâm Dịch vụ việc làm."}</p></div>
      <p className="job-caution">{direction.explanation}</p>
    </section>
    <section id="job-opportunities" tabIndex={-1} className="job-opportunities-section">{jobsOpen && <JobOpportunities />}</section>
    <section id="job-training" tabIndex={-1} className="job-training"><span className="action-label">NẾU CHƯA TÌM ĐƯỢC VIỆC PHÙ HỢP</span><h2>{jobRecommendations[2].title}</h2><p>Bạn có thể kiểm tra hướng tư vấn hoặc hỗ trợ đào tạo khi muốn đổi công việc hoặc bổ sung kỹ năng.</p><button className="outline-button" onClick={() => setTrainingOpen((open) => !open)} aria-expanded={trainingOpen}>{trainingOpen ? "Ẩn hướng học nghề" : "Xem hướng học nghề"}</button>{trainingOpen && <div><p>Ghi kỹ năng muốn học, lịch có thể tham gia và nhu cầu công việc. Hỏi Trung tâm về khóa học thực tế và điều kiện hỗ trợ riêng trước khi đăng ký.</p><a className="text-action" href={`tel:${center.phone!.replace(/\s/g, "")}`}>Hỏi Trung tâm về hướng học nghề</a><a className="text-action" href={training.url!} target="_blank" rel="noopener noreferrer">Tra cứu hướng dẫn hỗ trợ đào tạo<ExternalLink size={15} /></a><small>Mã thủ tục {training.procedureCode}. Link hiện có mở cổng tra cứu; dùng mã để tìm đúng thủ tục.</small></div>}</section>
    <button className="outline-button job-support-button" onClick={onSupport}>Tôi cần người hỗ trợ</button><SourceDisclosure entries={[{ id: policy("POL_JOB_001").legal_source_id, detail: "Điều 38" }, { id: service("JOB_SV_001").source_id, detail: "Mã thủ tục 1.014748" }, { id: center.sourceId }, { id: service("JOB_SV_007").source_id }, { id: training.sourceId, detail: "Mã thủ tục 1.014747" }]} />
  </>;
}
