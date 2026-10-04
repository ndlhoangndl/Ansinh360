"use client";

import { useState } from "react";
import { Answers, dataset } from "@/lib/demo";

const labels: Record<string, string> = {
  LEGAL: "Theo quyết định / thỏa thuận hợp pháp (theo thông tin bạn có)",
  UNLAWFUL: "Tự ý nghỉ trái quy định (theo thông tin bạn có)",
  UNKNOWN: "Tôi chưa rõ",
};

export function JobTerminationQuestion({ answers, onAnswer, primary = false, actionLabel }: { answers: Answers; onAnswer: (value: string) => void; primary?: boolean; actionLabel?: string }) {
  const [open, setOpen] = useState(false);
  const field = dataset.profileFields.find((item) => item.field_name === "termination_legal")!;
  return <section className="verification-box" id="job-missing" tabIndex={-1}>
    <h3>{answers.terminationLegal ? "Thông tin bạn đã tự khai" : "Chúng tôi còn thiếu 1 thông tin để kiểm tra tiếp"}</h3>
    <p><strong>Bạn chấm dứt việc làm trong trường hợp nào?</strong></p>
    <p>Xem quyết định nghỉ việc hoặc thỏa thuận chấm dứt. Thông tin này giúp làm rõ hướng cần hỏi tiếp; lựa chọn của bạn chưa xác nhận quyền hưởng.</p>
    {!open ? <>{answers.terminationLegal && <p>{labels[answers.terminationLegal]}</p>}<button className={primary ? "primary-button" : "outline-button"} onClick={() => setOpen(true)}>{actionLabel ?? (answers.terminationLegal ? "Xem / sửa câu trả lời" : primary ? "Kiểm tra ngay" : "Trả lời câu này")}</button></> : <fieldset className="followup-options"><legend>{field.question_vi}</legend>{field.allowed_values.split("|").map((value) => <label className="group-option" key={value}><input type="radio" name="termination-legal" checked={answers.terminationLegal === value} onChange={() => onAnswer(value)} />{labels[value]}</label>)}<p>Chỉ ghi nhận câu trả lời. Nếu chưa rõ, hỏi Trung tâm DVVL với giấy tờ bạn đang có.</p><button className={primary ? "primary-button" : "outline-button"} onClick={() => setOpen(false)}>Ghi nhận câu trả lời</button></fieldset>}
  </section>;
}
