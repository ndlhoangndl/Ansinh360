"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Baby, Bell, BookmarkCheck, BriefcaseBusiness, CalendarDays,
  Check, CheckCheck, CheckCircle2, ChevronDown, ChevronRight, CircleHelp, ClipboardCheck, Compass,
  ExternalLink, FileText, GraduationCap, HandHeart, House, MapPin, Phone,
  Play, Route, Search, ShieldCheck, Sparkles, Users, X } from "lucide-react";
import { Answers, dataset, disclaimer, formatDate, housingOpportunity, jobDemoResult, Journey, journeyFromSlug,
  journeySlugs, opportunityStatus, policy, profile, sampleAnswers, Screen, service, snapshotDate } from "@/lib/demo";
import { SourceBadge } from "./source-badge";
import { AnalysisScreen } from "./analysis-screen";
import { JobResults } from "./job-results";
import { JobActionPlan } from "./job-action-plan";
import { UserJourneyProgress } from "./user-journey-progress";
import { SituationSummary } from "./result-guidance";
import { HousingResults, ChildResults } from "./family-housing-results";
import { LocalActionPlan } from "./local-action-plan";

const journeyInfo = {
  JOB_LOSS: { icon: BriefcaseBusiness, short: "Mất việc", subtitle: "Kiểm tra hỗ trợ thất nghiệp, tìm việc và học nghề.", tone: "blue" },
  HOUSING_DIFFICULTY: { icon: House, short: "Nhà ở", subtitle: "Tìm hướng kiểm tra nhà ở xã hội và chương trình phù hợp.", tone: "amber" },
  HAS_CHILD: { icon: Baby, short: "Có con nhỏ", subtitle: "Kiểm tra thai sản, thủ tục cho trẻ và hỗ trợ mầm non.", tone: "mint" },
};
type Question = { key: keyof Answers; title: string; hint: string; options?: { value: string; label: string; note?: string }[]; date?: boolean };
const jobQuestions: Question[] = [
  { key: "employmentEnded", title: "Bạn đã chấm dứt việc làm chưa?", hint: "Chọn câu trả lời gần nhất với tình huống hiện tại.", options: [
    { value: "true", label: "Tôi đã nghỉ việc", note: "Hợp đồng hoặc công việc đã kết thúc" },
    { value: "false", label: "Tôi vẫn đang làm việc" }, { value: "UNKNOWN", label: "Tôi chưa rõ" }] },
  { key: "terminationDate", title: profile("termination_date").question_vi, hint: "Ngày nghỉ việc giúp bạn kiểm tra thời hạn chuẩn bị hồ sơ.", date: true },
  { key: "insurance", title: "Tại thời điểm nghỉ việc, bạn có tham gia BHTN không?", hint: "Thông tin này giúp xác định nhóm chính sách cần kiểm tra.", options: [
    { value: "YES", label: "Có" }, { value: "NO", label: "Không" }, { value: "UNKNOWN", label: "Không rõ", note: "Tôi cần kiểm tra lại thông tin" }] },
  { key: "goal", title: "Bạn muốn làm gì tiếp theo?", hint: "Chúng tôi sẽ đưa các dịch vụ bạn quan tâm vào hành trình.", options: [
    { value: "JOB", label: "Tìm việc mới" }, { value: "TRAINING", label: "Học nghề / nâng kỹ năng" },
    { value: "BOTH", label: "Cả tìm việc và học nghề" }, { value: "UNKNOWN", label: "Tôi cần được tư vấn" }] },
];
const visibleJobQuestions = jobQuestions;
const housingQuestions: Question[] = [
  { key: "housingIntent", title: "Bạn đang cần tìm loại hình nhà ở nào?", hint: "Chọn đúng nhu cầu để xem dịch vụ và đợt tiếp nhận phù hợp.", options: [
    { value: "BUY", label: "Mua nhà ở xã hội" }, { value: "RENT", label: "Thuê nhà ở xã hội" },
    { value: "WORKER_LODGING", label: "Nhà lưu trú công nhân" }, { value: "UNKNOWN", label: "Tôi chưa rõ" }] },
  { key: "ownsHouse", title: "Bạn / vợ hoặc chồng đã có nhà tại Đà Nẵng chưa?", hint: "Một thông tin để xem trước hành trình kiểm tra điều kiện mua.", options: [
    { value: "NO", label: "Chưa có nhà" }, { value: "YES", label: "Đã có nhà" }, { value: "UNKNOWN", label: "Không rõ" }] },
  { key: "incomeRange", title: "Thu nhập bình quân của bạn thuộc khoảng nào?", hint: "Xem trước trường hợp người độc thân. Chỉ chọn khoảng, không cần nhập thu nhập chính xác.", options: [
    { value: "<=25M", label: "Không quá 25 triệu / tháng" }, { value: "25-35M", label: "Trên 25 đến 35 triệu / tháng" },
    { value: ">35M", label: "Trên 35 triệu / tháng" }, { value: "UNKNOWN", label: "Tôi cần kiểm tra lại" }] },
];
const childQuestions: Question[] = [
  { key: "childContext", title: "Bạn đang muốn tìm hỗ trợ nào cho gia đình?", hint: "Chọn một tình huống để xem trước các chính sách và dịch vụ liên quan.", options: [
    { value: "FEMALE", label: "Lao động nữ vừa sinh con" }, { value: "MALE", label: "Lao động nam có vợ vừa sinh con" },
    { value: "PRESCHOOL", label: "Tôi có con ở độ tuổi mầm non" }, { value: "UNKNOWN", label: "Tôi muốn xem các hỗ trợ" }] },
  { key: "childAge", title: "Con của bạn đang ở độ tuổi nào?", hint: "Tuổi của trẻ giúp hiển thị đúng nhóm dịch vụ trong bản xem trước.", options: [
    { value: "NEWBORN", label: "Trẻ mới sinh" }, { value: "UNDER6", label: "Dưới 6 tuổi" },
    { value: "OLDER", label: "Từ 6 tuổi trở lên" }, { value: "UNKNOWN", label: "Tôi chưa rõ / đang tìm hiểu" }] },
];

function Badge({ status, label }: { status: "good" | "review" | "scheduled" | "neutral"; label: string }) {
  return <span className={`badge badge-${status}`}>{status === "good" ? <CheckCircle2 size={13} /> : status === "scheduled" ? <CalendarDays size={13} /> : <span className="badge-dot" />}{label}</span>;
}
function IconBox({ children, tone = "blue" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`icon-box ${tone}`}>{children}</span>;
}
function SupportPanel() {
  return <section className="support-section" id="support"><div className="support-heading"><HandHeart size={23} /><div><h2>Cần người hỗ trợ?</h2><p>Bạn không phải tự tìm hiểu một mình.</p></div></div>
    <a className="support-link" href="tel:1022"><Phone size={18} /><span><strong>Gọi 1022</strong><small>Hướng dẫn và kết nối dịch vụ</small></span><ArrowRight size={17} /></a><SourceBadge id={service("GEN_SV_003").source_id} />
    {["GEN_SV_004", "GEN_SV_005"].map((id) => { const item = service(id); return <div className="support-resource" key={id}>
      <a className="support-link" href={item.online_url} target="_blank" rel="noopener noreferrer"><Users size={18} /><span><strong>{id === "GEN_SV_004" ? "Điểm dừng chân công nhân" : "Tổ công nhân tự quản"}</strong><small>Công đoàn phường Liên Chiểu</small></span><ExternalLink size={14} /></a>
      <SourceBadge id={item.source_id} /></div>; })}
  </section>;
}

export function DemoApp() {
  const router = useRouter(); const params = useSearchParams();
  const screenParam = params.get("screen");
  const screen: Screen = ["questions", "analysis", "results", "plan"].includes(screenParam ?? "") ? screenParam as Screen : params.get("demo") === "jobloss" ? "questions" : "home";
  const journey = journeyFromSlug(params.get("journey") ?? params.get("demo"));
  const demoMode = params.get("demo") === "jobloss";
  const recording = params.get("recording") === "1";
  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [answers, setAnswers] = useState<Answers>(() => demoMode ? { ...sampleAnswers } : {}); const [questionIndex, setQuestionIndex] = useState(0);
  const [supportOpen, setSupportOpen] = useState(false); const [reminder, setReminder] = useState(false);
  const [planServiceId, setPlanServiceId] = useState<string | undefined>();
  const [resultFocus, setResultFocus] = useState<string | undefined>();
  const [checked, setChecked] = useState<string[]>([]); const [descriptionOpen, setDescriptionOpen] = useState(false);
  const initializedDemo = useRef(demoMode); const contentRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!supportOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    modalRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSupportOpen(false);
      if (event.key !== "Tab") return;
      const controls = modalRef.current?.querySelectorAll<HTMLElement>("button, a[href]");
      if (!controls?.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("keydown", handleKey); previous?.focus(); };
  }, [supportOpen]);
  useEffect(() => { if (demoMode && !initializedDemo.current) { setAnswers(sampleAnswers); initializedDemo.current = true; } }, [demoMode]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: recording && !reducedMotion() ? "smooth" : "instant" }); contentRef.current?.focus({ preventScroll: true }); }, [screen, journey, recording]);
  useEffect(() => {
    if (screen !== "results" || !resultFocus) return;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(resultFocus);
      target?.focus(); target?.scrollIntoView({ behavior: "instant", block: "start" });
      setResultFocus(undefined);
    });
    return () => cancelAnimationFrame(frame);
  }, [screen, resultFocus]);
  const completeAnalysis = useCallback(() => {
    const query = new URLSearchParams({ journey: journeySlugs[journey], screen: "results" });
    if (demoMode) query.set("demo", "jobloss");
    if (recording) query.set("recording", "1");
    router.replace(`/?${query}`, { scroll: true });
  }, [router, journey, demoMode, recording]);
  const questions = journey === "JOB_LOSS" ? visibleJobQuestions : journey === "HAS_CHILD" ? childQuestions :
    answers.housingIntent && answers.housingIntent !== "BUY" ? housingQuestions.slice(0, 1) : housingQuestions;
  const currentQuestion = questions[Math.min(questionIndex, questions.length - 1)];
  const journeyName = dataset.lifeEvents.find((e) => e.life_event_id === journey)!.name;
  const setAnswer = (key: keyof Answers, value: string) => setAnswers((previous) => ({ ...previous, [key]: value }));
  function navigate(next: Screen, nextJourney = journey, demo = demoMode) {
    const query = new URLSearchParams();
    if (next !== "home") { query.set("journey", journeySlugs[nextJourney]); query.set("screen", next); }
    if (demo && next !== "home") query.set("demo", "jobloss");
    if (recording) query.set("recording", "1");
    router.push(query.size ? `/?${query}` : "/", { scroll: true });
  }
  function openPlan(serviceId?: string) { setPlanServiceId(serviceId); navigate("plan"); }
  function start(nextJourney: Journey, quick = false) {
    setAnswers(quick ? { ...sampleAnswers } : {}); setQuestionIndex(0); setChecked([]); setPlanServiceId(undefined); setReminder(false);
    initializedDemo.current = quick; navigate("questions", nextJourney, quick);
  }
  function nextQuestion() {
    if (questionIndex >= questions.length - 1) navigate("analysis");
    else { setQuestionIndex((i) => i + 1); window.scrollTo({ top: 0, behavior: reducedMotion() ? "instant" : "smooth" }); }
  }
  const result = jobDemoResult(answers);
  const mainHousingPolicy = answers.housingIntent === "RENT" ? "POL_HOUSE_002" : answers.housingIntent === "WORKER_LODGING" ? "POL_HOUSE_003" : "POL_HOUSE_001";
  const opportunity = housingOpportunity(answers.housingIntent);
  const childPolicy = answers.childContext === "MALE" ? "POL_CHILD_002" : "POL_CHILD_001";
  const childService = answers.childContext === "MALE" ? "CHILD_SV_002" : "CHILD_SV_001";

  return <div className={`app-shell ${recording ? "recording-mode" : ""}`}>
    <header className="site-header"><button className="brand" aria-label="AN SINH 360 — về trang chủ" onClick={() => navigate("home")}>
      <span className="brand-symbol"><Compass size={25} strokeWidth={1.7} /></span><span><strong>AN SINH <b>360</b></strong><small>Từ hoàn cảnh đến hành động.</small></span>
    </button>{demoMode && <span className="demo-mode-label"><Play size={12} />Bản demo ý tưởng</span>}<button className="help-button" onClick={() => setSupportOpen(true)}><CircleHelp size={18} /><span>Cần hỗ trợ?</span></button></header>
    <main ref={contentRef} tabIndex={-1} className={`main-layout screen-${screen}`}>
      <div className="main-column"><UserJourneyProgress screen={screen} />
        {screen === "home" ? <>
          <section className="home-intro"><span className="local-label"><MapPin size={13} /> ĐỒNG HÀNH CÙNG NGƯỜI LAO ĐỘNG LIÊN CHIỂU</span>
            <h1>AN SINH <span>360</span></h1><p className="hero-subtitle">Bộ điều hướng chính sách, dịch vụ và cơ hội cho người lao động Liên Chiểu</p><strong className="hero-tagline">Từ hoàn cảnh đến hành động.</strong><p className="hero-support">Bạn không cần biết tên chính sách. Hãy bắt đầu từ tình huống mình đang gặp.</p>
          </section>
          <section className="journey-selection"><div className="section-kicker"><h2>Bạn đang gặp tình huống nào?</h2><span>Chọn để bắt đầu</span></div>
            {dataset.lifeEvents.map((event) => { const id = event.life_event_id as Journey; const item = journeyInfo[id]; const Icon = item.icon;
              return <button key={id} className={`journey-card journey-${item.tone}`} onClick={() => start(id)}>
                <IconBox tone={item.tone}><Icon size={24} strokeWidth={1.7} /></IconBox><span className="journey-copy"><strong>{event.name}</strong><small>{item.subtitle}</small>{id !== "JOB_LOSS" && <span className="experimental-badge">Demo thử nghiệm</span>}</span><ChevronRight className="journey-chevron" size={20} />
              </button>; })}
          </section>
          <div className="demo-entry"><button className="quick-demo" onClick={() => start("JOB_LOSS", true)}><Play size={15} />Chạy thử demo: Tôi vừa mất việc<ArrowRight size={15} /></button><p>Xem cách AN SINH 360 biến một hoàn cảnh thực tế thành các bước hành động.</p></div>
          <section className="optional-description"><button onClick={() => setDescriptionOpen((value) => !value)} aria-expanded={descriptionOpen}><FileText size={15} /> Hoặc mô tả tình huống của bạn…<ChevronDown size={15} /></button>
            {descriptionOpen && <div className="description-body"><textarea aria-label="Mô tả tình huống của bạn" rows={3} placeholder="Ví dụ: Tôi vừa nghỉ việc và muốn tìm công việc mới…" /><p>Chọn một tình huống ở trên để tiếp tục. Bạn không cần nhập thông tin định danh.</p></div>}</section>
          <div className="trust-line"><ShieldCheck size={14} /><span>Nguồn chính thức</span><i /><span>Không cần đăng nhập</span></div>

        </> : <>
          <div className="screen-topline"><button className="back-link" onClick={() => { if (screen === "questions" && questionIndex > 0) setQuestionIndex((i) => i - 1); else navigate(screen === "plan" ? "results" : screen === "results" || screen === "analysis" ? "questions" : "home"); }}><ArrowLeft size={16} /> Quay lại</button><span className={`journey-mini ${journeyInfo[journey].tone}`}>{journeyInfo[journey].short}</span></div>
          {screen === "analysis" && <AnalysisScreen journey={journey} answers={answers} onComplete={completeAnalysis} />}
          {screen === "questions" && <section className={`question-screen question-${currentQuestion.key}`} aria-label="Thông tin hoàn cảnh">
            <div className="question-intro"><h1>Cho chúng tôi biết thêm một chút</h1><p>Chỉ hỏi những thông tin cần thiết để tìm hướng phù hợp.</p></div><div className="question-meta"><span>CÂU HỎI</span><b>Câu {Math.min(questionIndex + 1, questions.length)}/{questions.length}</b></div>
            <div className="progress-track"><span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div>
            {demoMode && <div className="demo-note"><Play size={12} /> Đã chọn sẵn một tình huống để bạn trải nghiệm. Bạn có thể thay đổi.</div>}
            <h2 className="current-question">{currentQuestion.title}</h2><p className="question-hint"><span>Vì sao cần hỏi?</span> {currentQuestion.hint}</p>
            {currentQuestion.date ? <div className="date-question"><label htmlFor="termination-date">Ngày chấm dứt việc làm</label><input id="termination-date" type="date" max={snapshotDate} value={answers.terminationDate === "UNKNOWN" ? "" : answers.terminationDate ?? ""} onChange={(event) => setAnswer("terminationDate", event.target.value)} />
              <button className={`answer-option ${answers.terminationDate === "UNKNOWN" ? "selected" : ""}`} onClick={() => setAnswer("terminationDate", "UNKNOWN")}><span>Không nhớ chính xác</span><span className="radio-dot" /></button></div> :
              <div className="answer-options" role="radiogroup" aria-label={currentQuestion.title}>{currentQuestion.options!.map((option) =>
                <button key={option.value} role="radio" aria-checked={answers[currentQuestion.key] === option.value} className={`answer-option ${answers[currentQuestion.key] === option.value ? "selected" : ""}`} onKeyDown={(event) => { const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"]; if (!keys.includes(event.key)) return; event.preventDefault(); const options = currentQuestion.options!; const index = options.findIndex((item) => item.value === option.value); const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (index + (event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1) + options.length) % options.length; setAnswer(currentQuestion.key, options[next].value); (event.currentTarget.parentElement?.children[next] as HTMLElement)?.focus(); }} onClick={() => setAnswer(currentQuestion.key, option.value)}><span><strong>{option.label}</strong>{option.note && <small>{option.note}</small>}</span><span className="radio-dot">{answers[currentQuestion.key] === option.value && <Check size={12} />}</span></button>)}</div>}
            <div className="privacy-note"><ShieldCheck size={15} /><span>Thông tin chỉ dùng để gợi ý trong lượt trải nghiệm này.</span></div>
            <div className="question-footer"><button className="primary-button" disabled={!answers[currentQuestion.key]} onClick={nextQuestion}>{questionIndex >= questions.length - 1 ? "Phân tích hoàn cảnh của tôi" : "Tiếp tục"}<ArrowRight size={18} /></button></div>
          </section>}

          {screen === "results" && <section className="results-screen"><div className="page-heading result-heading"><h1>{journey === "HOUSING_DIFFICULTY" && answers.housingIntent === "BUY" ? "Bạn có thể kiểm tra nhà ở xã hội" : journey === "JOB_LOSS" ? "Bắt đầu với việc hỏi về BHTN" : journey === "HAS_CHILD" ? "Bắt đầu với hỗ trợ cho gia đình bạn" : "Bắt đầu với nhu cầu nhà ở của bạn"}</h1><p>{journey === "HOUSING_DIFFICULTY" ? "Trước mắt, hãy làm 2 việc dưới đây." : "Làm việc đầu tiên dưới đây, rồi xem bước tiếp theo."}</p></div>{journey !== "HOUSING_DIFFICULTY" && <SituationSummary journey={journey} answers={answers} />}
            {journey === "JOB_LOSS" && <JobResults answers={answers} checked={checked} onToggle={(id) => setChecked((previous) => previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id])} onSupport={() => setSupportOpen(true)} onPlan={() => openPlan()} />}
            {journey === "HOUSING_DIFFICULTY" && <HousingResults answers={answers} onPlan={() => openPlan()} onAnswer={(value) => setAnswer("applicantGroup", value)} onSupport={() => setSupportOpen(true)} />}
            {journey === "HAS_CHILD" && <ChildResults answers={answers} onPlan={openPlan} />}
            <p className="disclaimer"><ShieldCheck size={17} /><span>{disclaimer}</span></p><button className="outline-button all-actions" onClick={() => openPlan()}>Xem hành trình của bạn<Route size={18} /></button>
          </section>}

          {screen === "plan" && <section className="plan-screen"><div className="page-heading"><h1>Việc của bạn lúc này</h1><p>Làm việc đầu tiên, rồi tiếp tục từng bước.</p></div>
            {journey === "JOB_LOSS" ? <JobActionPlan onNextPaths={() => { navigate("results"); window.setTimeout(() => document.getElementById("next-paths")?.scrollIntoView({ behavior: reducedMotion() ? "instant" : "smooth", block: "start" }), 250); }} checked={checked} onToggle={(id) => setChecked((previous) => previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id])} /> : <LocalActionPlan serviceId={planServiceId} housing={journey === "HOUSING_DIFFICULTY"} answers={answers} onSupport={() => setSupportOpen(true)} onResultSection={(id) => { setResultFocus(id); navigate("results"); }} />}
            <p className="disclaimer"><ShieldCheck size={17} /><span>{disclaimer}</span></p><button className="restart-button" onClick={() => navigate("home")}><Route size={16} />Khám phá tình huống khác</button>
          </section>}
        </>}
        {screen !== "analysis" && <footer className="page-footer"><span>AN SINH 360</span><span>Bản demo ý tưởng · {formatDate(snapshotDate)}</span></footer>}
      </div>
    </main>
    {supportOpen && <div className="modal-backdrop" onClick={() => setSupportOpen(false)}><section ref={modalRef} className="support-modal" role="dialog" aria-modal="true" aria-labelledby="support-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Đóng hỗ trợ" onClick={() => setSupportOpen(false)}><X size={20} /></button><h2 id="support-title" className="sr-only">Cần người hỗ trợ?</h2><SupportPanel /></section></div>}
  </div>;
}

function TimelineStep({ number, title, icon, children }: { number: number; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <article className="timeline-step"><div className="step-number">{number}</div><div className="step-content"><span className="step-caption">BƯỚC {number}</span><div className="step-title">{icon}<h2>{title}</h2></div>{children}</div></article>;
}
