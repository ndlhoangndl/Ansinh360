"use client";

import { useEffect, useState } from "react";
import { Check, CircleHelp, ClipboardCheck, FileCheck2, LoaderCircle, MapPin, ScanLine, Users } from "lucide-react";
import { analysisSummary, Answers, Journey } from "@/lib/demo";

export const ANALYSIS_DURATION_MS = 1900;

export function AnalysisScreen({ journey, answers, onComplete }: { journey: Journey; answers: Answers; onComplete: () => void }) {
  const [completed, setCompleted] = useState(0);
  const facts = analysisSummary(journey, answers);
  const steps = [
    { title: "Hoàn cảnh đã nhận diện", text: journey === "JOB_LOSS" && answers.employmentEnded === "true" ? "Vừa mất việc" : facts.situation, status: "Đã nhận diện", icon: Users },
    { title: "Thông tin đã ghi nhận", text: "", status: facts.conditions.every((c) => c.met) ? "Đã đối chiếu thông tin" : "Cần xác minh", icon: ClipboardCheck },
    { title: "Đối chiếu chính sách", text: "", status: "Đã đối chiếu", icon: FileCheck2 },
    { title: "Tìm dịch vụ phù hợp", text: "", status: "Đã tìm được dịch vụ", icon: MapPin },
    { title: "Xác định bước tiếp theo", text: "", status: "Có bước tiếp theo", icon: ScanLine },
  ];
  useEffect(() => {
    const timers = [220, 530, 860, 1180, 1490].map((time, index) => window.setTimeout(() => setCompleted(index + 1), time));
    timers.push(window.setTimeout(onComplete, ANALYSIS_DURATION_MS));
    return () => timers.forEach(window.clearTimeout);
  }, [onComplete]);

  return <section className="analysis-screen" aria-busy="true" aria-labelledby="analysis-title">
    <div className="analysis-orbit" aria-hidden><ScanLine size={31} /><span /></div>
    <span className="eyebrow">TỪ THÔNG TIN ĐẾN HƯỚNG ĐI</span>
    <h1 id="analysis-title">Đang nối các dữ kiện…</h1>
    <p className="analysis-subtitle">AN SINH 360 đang đối chiếu hoàn cảnh của bạn với chính sách, dịch vụ và bước tiếp theo phù hợp.</p>
    <div className="analysis-progress"><span style={{ width: `${completed * 20}%` }} /></div>
    <ol className="analysis-list">{steps.map((step, index) => {
      const done = index < completed; const current = index === completed;
      return <li key={step.title} className={done ? "complete" : current ? "processing" : "waiting"}>
        <span className="analysis-step-icon">{done ? <Check size={18} /> : current ? <LoaderCircle size={18} className="spin" /> : <step.icon size={18} />}</span>
        <div><span className="analysis-step-title">{step.title}</span>
          {index === 1 ? <div className="analysis-facts">{(journey === "JOB_LOSS" ? facts.conditions.slice(1, 2) : facts.conditions).map((fact) => <span className={fact.met ? "known" : "unknown"} key={fact.text}>{fact.met ? <Check size={13} /> : <CircleHelp size={13} />}{fact.text}</span>)}</div> : <strong>{step.text}</strong>}
          {done && index < 2 && <span className={`analysis-status ${step.status === "Cần xác minh" ? "review" : ""}`}>{step.status}</span>}
        </div>
      </li>;
    })}</ol>
    <p className="analysis-footnote">Điều kiện hưởng cần được cơ quan có thẩm quyền xác nhận.</p>
    <span className="sr-only" role="status">Đang đối chiếu thông tin. Kết quả sẽ hiển thị khi hoàn tất.</span>
  </section>;
}
