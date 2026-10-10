"use client";
import { useState } from "react";
import { type Answers } from "@/lib/demo";
import { terminationCircumstances } from "@/lib/job-journey";
export function JobTerminationQuestion({ answers, onAnswer, primary = false, actionLabel }: { answers: Answers; onAnswer: (value: string) => void; primary?: boolean; actionLabel?: string }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(answers.terminationCircumstance ?? "UNKNOWN");
  return <section className="job-termination-confirmation" id="job-missing" tabIndex={-1}>{!open ? <button className={primary ? "primary-button" : "outline-button"} onClick={() => { setDraft(answers.terminationCircumstance ?? "UNKNOWN"); setOpen(true); }}>{actionLabel ?? "Tôi đã kiểm tra"}</button> : <fieldset className="followup-options"><legend>Bạn nghỉ việc theo trường hợp nào gần nhất?</legend>{terminationCircumstances.map(({value,label}) => <label className="group-option" key={value}><input type="radio" name="termination-circumstance" checked={draft === value} onChange={() => setDraft(value)} />{label}</label>)}<p>Chỉ ghi sự việc bạn biết. Trung tâm sẽ đối chiếu giấy tờ và quy định; lựa chọn này không phải kết luận pháp lý hay quyền hưởng.</p><button className={primary ? "primary-button" : "outline-button"} onClick={() => { onAnswer(draft); setOpen(false); }}>Ghi nhận câu trả lời</button><button className="back-link" onClick={() => setOpen(false)}>Hủy thay đổi</button></fieldset>}</section>;
}
