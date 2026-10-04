"use client";

import { useState } from "react";
import { Check, ClipboardCheck, Lightbulb, Users } from "lucide-react";
import type { Answers, Journey } from "@/lib/demo";
import { situationFacts } from "@/lib/presentation";

export function SituationSummary({ journey, answers }: { journey: Journey; answers: Answers }) {
  const facts = situationFacts(journey, answers);
  return <section className="situation-summary"><h2><Users size={20} />Những gì bạn đã cho chúng tôi biết</h2>
    {facts.length ? <><ul className="plain-reasons">{facts.map((fact) => <li key={fact}><Check size={15} />{fact}</li>)}</ul><p>Nhờ những thông tin này, bạn không cần bắt đầu tìm hiểu từ đầu.</p></> : <p>Chưa có câu trả lời để tóm tắt. Bạn có thể quay lại phần câu hỏi.</p>}
  </section>;
}

export function RecommendationGuidance({ reasons, missing, explanation }: { reasons: string[]; missing: string[]; explanation: string }) {
  return <div className="recommendation-guidance">
    <section><h3>Vì sao có gợi ý này?</h3><ul className="plain-reasons">{reasons.map((reason) => <li key={reason}><Check size={15} />{reason}</li>)}</ul></section>
    <section className="verification-box"><h3>Điều cần làm rõ trước</h3><p>{missing[0]}</p><p>Ghi lại thông tin này để hỏi nơi tiếp nhận. Sau đó, bạn sẽ biết cần chuẩn bị gì cho đúng trường hợp.</p></section>
    <PlainExplanation>{explanation}</PlainExplanation>
  </div>;
}

export function PlainExplanation({ children }: { children: string }) {
  return <section className="plain-explanation"><h3><Lightbulb size={17} />AN SINH 360 giải thích</h3><p>{children}</p></section>;
}

export function PracticalChecklist({ items, checked, onToggle, heading = "Tôi cần chuẩn bị gì?" }: { heading?: string; items: string[]; checked?: string[]; onToggle?: (id: string) => void }) {
  const [localChecked, setLocalChecked] = useState<string[]>([]);
  const values = checked ?? localChecked;
  const toggle = onToggle ?? ((id: string) => setLocalChecked((previous) => previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id]));
  return <section className="practical-checklist"><h3><ClipboardCheck size={18} />{heading}</h3>
    <p className="checklist-hint">Đánh dấu để tự theo dõi. Bạn không cần nhập thông tin cá nhân tại đây.</p>
    {items.map((item) => <label key={item}><input type="checkbox" checked={values.includes(item)} onChange={() => toggle(item)} /><span>{item}</span></label>)}
  </section>;
}

export function NextActions({ items }: { items: string[] }) {
  return <section className="next-actions"><h3>Bạn nên làm gì bây giờ?</h3><ol>{items.map((item) => <li key={item}>{item}</li>)}</ol></section>;
}
