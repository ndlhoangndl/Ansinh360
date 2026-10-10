"use client";

import { useEffect, useState } from "react";
import { Check, ClipboardCheck, FileCheck2, LoaderCircle, MapPin, ScanLine, Users } from "lucide-react";
import { analysisSummary, Answers, Journey } from "@/lib/demo";
import { jobConfirmedFacts } from "@/lib/job-journey";
import { childConfirmedFacts } from "@/lib/child-journey";

export const ANALYSIS_DURATION_MS = 1900;

export function AnalysisScreen({ journey, answers, onComplete }: { journey: Journey; answers: Answers; onComplete: () => void }) {
  const [completed, setCompleted] = useState(0);
  const facts = analysisSummary(journey, answers);
  const steps = journey === "HOUSING_DIFFICULTY" ? [
    {title:"Đã ghi nhận nhu cầu nhà ở",text:"",status:"Đã ghi nhận",icon:Users},
    {title:"Đã ghi nhận ngân sách và quy mô hộ",text:"",status:"Đã ghi nhận",icon:ClipboardCheck},
    {title:"So sánh phương án phù hợp",text:"",status:"Đã ghi nhận",icon:FileCheck2},
    {title:"Kiểm tra hướng hỗ trợ nhà ở",text:"",status:"Đã ghi nhận",icon:MapPin},
    {title:"Xác định bước tiếp theo",text:"",status:"Đã ghi nhận",icon:ScanLine},
  ] : journey === "HAS_CHILD" ? [
    {title:"Đã ghi nhận giai đoạn của trẻ",text:"",status:"Đã ghi nhận",icon:Users},
    {title:"Đã ghi nhận nhu cầu chính",text:"",status:"Đã ghi nhận",icon:ClipboardCheck},
    {title:"Xác định việc gia đình nên làm",text:"",status:"Đã đối chiếu",icon:FileCheck2},
    {title:"Kiểm tra quyền lợi / hỗ trợ liên quan",text:"",status:"Đã đối chiếu",icon:MapPin},
    ...(answers.childStage === "PRESCHOOL" ? [{title:"So sánh các hướng chăm sóc trẻ",text:"",status:"Cần xác nhận",icon:Users}] : []),
    {title:"Tìm bước tiếp theo",text:"",status:"Có bước tiếp theo",icon:ScanLine},
  ] : [
    { title: "Đã nhận diện hoàn cảnh", text: journey === "JOB_LOSS" ? answers.employmentEnded === "true" ? "Vừa mất việc" : answers.employmentEnded === "false" ? "Chưa nghỉ hẳn" : "Cần làm rõ tình trạng việc làm" : facts.situation, status: "Đã nhận diện", icon: Users },
    { title: "Đã ghi nhận thông tin chính", text: "", status: facts.conditions.every((c) => c.met) ? "Đã đối chiếu thông tin" : "Cần xác minh", icon: ClipboardCheck },
    { title: journey === "JOB_LOSS" ? "Đối chiếu hướng quyền lợi" : "Đối chiếu hướng chính sách", text: "", status: "Đã đối chiếu", icon: FileCheck2 },
    { title: journey === "JOB_LOSS" ? "Tìm nơi có thể hỗ trợ" : "Tìm nơi thực hiện phù hợp", text: "", status: "Đã tìm được dịch vụ", icon: MapPin },
    { title: journey === "JOB_LOSS" ? "Xác định cơ hội và bước tiếp theo" : "Xác định bước tiếp theo", text: "", status: "Có bước tiếp theo", icon: ScanLine },
  ];
  useEffect(() => {
    const timings = steps.length === 6 ? [220, 450, 680, 910, 1180, 1490] : [220, 530, 860, 1180, 1490];
    const timers = timings.map((time, index) => window.setTimeout(() => setCompleted(index + 1), time));
    timers.push(window.setTimeout(onComplete, ANALYSIS_DURATION_MS));
    return () => timers.forEach(window.clearTimeout);
  }, [onComplete, steps.length]);

  return <section className="analysis-screen" aria-busy="true" aria-labelledby="analysis-title">
    <div className="analysis-orbit" aria-hidden><ScanLine size={31} /><span /></div>
    <span className="eyebrow">TỪ THÔNG TIN ĐẾN HƯỚNG ĐI</span>
    <h1 id="analysis-title">Đang nối các dữ kiện…</h1>
    <p className="analysis-subtitle">{journey === "HOUSING_DIFFICULTY" ? "AN SINH 360 đang đối chiếu nhu cầu của bạn để tìm những hướng nhà ở đáng xem." : journey === "HAS_CHILD" ? "AN SINH 360 đang đối chiếu giai đoạn của trẻ để tìm những việc và hỗ trợ phù hợp." : "AN SINH 360 đang đối chiếu thông tin của bạn để tìm hướng phù hợp."}</p>
    <div className="analysis-progress"><span style={{ width: `${completed / steps.length * 100}%` }} /></div>
    <ol className="analysis-list">{steps.map((step, index) => {
      const done = index < completed; const current = index === completed;
      return <li key={step.title} className={done ? "complete" : current ? "processing" : "waiting"}>
        <span className="analysis-step-icon">{done ? <Check size={18} /> : current ? <LoaderCircle size={18} className="spin" /> : <step.icon size={18} />}</span>
        <div><span className="analysis-step-title">{step.title}</span>
          {index === 1 ? <div className="analysis-facts">{journey === "HOUSING_DIFFICULTY" ? <span>Thông tin bạn cung cấp đã được ghi nhận</span> : journey === "JOB_LOSS" ? <span>{jobConfirmedFacts(answers).length ? "Thông tin bạn cung cấp đã được ghi nhận" : "Còn thông tin cần làm rõ"}</span> : <span>{childConfirmedFacts(answers).length ? "Thông tin bạn cung cấp đã được ghi nhận" : "Còn thông tin cần làm rõ"}</span>}</div> : <strong>{step.text}</strong>}
          {done && index < 2 && <span className={`analysis-status ${step.status === "Cần xác minh" ? "review" : ""}`}>{journey === "JOB_LOSS" && index === 1 ? "Đã ghi nhận" : step.status}</span>}
        </div>
      </li>;
    })}</ol>
    <p className="analysis-footnote">Điều kiện hưởng cần được cơ quan có thẩm quyền xác nhận.</p>
    <span className="sr-only" role="status">Đang đối chiếu thông tin. Kết quả sẽ hiển thị khi hoàn tất.</span>
  </section>;
}
