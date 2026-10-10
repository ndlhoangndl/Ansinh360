import { ArrowRight, Check } from "lucide-react";
import type { Screen } from "@/lib/demo";

const labels = ["Tình huống", "Một vài câu hỏi", "Dành cho bạn", "Việc cần làm"];

export function UserJourneyProgress({ screen, stepsLabel = "Các bước của bạn" }: { screen: Screen; stepsLabel?: string }) {
  const active = screen === "home" ? 0 : screen === "questions" || screen === "analysis" ? 1 : screen === "results" ? 2 : 3;
  return <nav className="user-progress" aria-label="Tiến trình hành trình">
    <ol aria-label={stepsLabel} className="user-progress-steps">
      {labels.map((label, index) => <li key={label} className={index === active ? "current" : index < active ? "done" : ""} aria-current={index === active ? "step" : undefined}>
        <span className="user-step-number" aria-hidden>{index < active ? <Check size={15} /> : index + 1}</span>
        <span>{label}</span>
        {index < labels.length - 1 && <ArrowRight className="user-step-arrow" size={12} aria-hidden />}
      </li>)}
    </ol>
    {screen !== "home" && screen !== "analysis" && <p className="user-progress-caption"><strong>Bước {active + 1}/4</strong><span>{labels[active]}</span></p>}
  </nav>;
}
