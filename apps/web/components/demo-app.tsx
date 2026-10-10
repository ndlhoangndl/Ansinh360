"use client";

import { officialDestination } from "@/lib/official-destinations";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Baby, BriefcaseBusiness, Check, ChevronRight, CircleHelp,
  Compass, ExternalLink, HandHeart, House, MapPin, Phone, Route, ShieldCheck, Users, X } from "lucide-react";
import { Answers, disclaimer, Journey, journeySlugs, Screen, service, snapshotDate } from "@/lib/demo";
import { SourceBadge } from "./source-badge";
import { AnalysisScreen } from "./analysis-screen";
import { JobResults } from "./job-results";
import { JobActionPlan } from "./job-action-plan";
import { UserJourneyProgress } from "./user-journey-progress";
import { MechanismExplainer } from "./mechanism-explainer";
import { SituationSummary } from "./result-guidance";
import { ChildJourneyResults, ChildSummary, ChildActionPlan, ChildSupportSummary } from "./child-journey";
import { childQuestions as getChildQuestions, childPlanHeading, childPrimaryNeed, updateChildAnswer } from "@/lib/child-journey";
import { competitionDemoMetadata, competitionJourneys } from "@/lib/competition-demo";
import { resolveDemoEntry } from "@/lib/demo-entry";
import { jobDemoAnswers, jobPrimaryQuestions, jobConfirmedFacts } from "@/lib/job-journey";
import { jobNextAction } from "@/lib/action-plan";
import { housingPrimaryQuestions } from "@/lib/housing-journey";
import { HousingResultsV2, HousingSummary, HousingActionPlan, HousingSupportSummary } from "./housing-journey";

const journeyInfo = {
  JOB_LOSS: { icon: BriefcaseBusiness, short: "Mất việc", title: "Tôi vừa mất việc", subtitle: "Kiểm tra quyền lợi trước mắt và tìm cơ hội quay lại việc làm.", tone: "blue" },
  HOUSING_DIFFICULTY: { icon: House, short: "Nhà ở", title: "Tôi đang khó khăn về nhà ở", subtitle: "Tìm phương án phù hợp khả năng và các hỗ trợ nhà ở đáng kiểm tra.", tone: "amber" },
  HAS_CHILD: { icon: Baby, short: "Có con nhỏ", title: "Tôi có con nhỏ", subtitle: "Xem những việc gia đình cần làm, nơi chăm sóc trẻ và hỗ trợ đáng kiểm tra.", tone: "mint" },
};
type Question = { key: keyof Answers; title: string; hint: string; explanation?: string; options?: { value: string; label: string; note?: string }[]; date?: boolean };
const jobQuestions: Question[] = jobPrimaryQuestions;
const visibleJobQuestions = jobQuestions;
const housingQuestions: Question[] = housingPrimaryQuestions;


function IconBox({ children, tone = "blue" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`icon-box ${tone}`}>{children}</span>;
}
function SupportPanel({ answers, housingAnswers, childAnswers }: { answers?: Answers; housingAnswers?: Answers; childAnswers?: Answers }) {
  return <section className="support-section" id="support"><div className="support-heading"><HandHeart size={23} /><div><h2 id="support-title">Cần người hỗ trợ?</h2><p>Bạn không phải tự tìm hiểu một mình.</p></div></div>
    {answers && <section className="job-support-summary"><h3>Tóm tắt để nhờ hỗ trợ</h3><dl><dt>Hoàn cảnh</dt><dd>{answers.employmentEnded === "true" ? "Vừa mất việc" : answers.employmentEnded === "false" ? "Chưa nghỉ hẳn" : "Cần làm rõ tình trạng việc làm"}</dd><dt>Đã biết</dt><dd>{jobConfirmedFacts(answers).length ? <ul>{jobConfirmedFacts(answers).map((fact) => <li key={fact}>{fact}</li>)}</ul> : "Chưa có thông tin đã xác nhận."}</dd><dt>Còn thiếu</dt><dd>{{ employment: "Tình trạng chấm dứt việc làm", insurance: "Thông tin tham gia bảo hiểm thất nghiệp", termination: "Lý do chấm dứt việc làm", duration: "Thông tin quá trình tham gia bảo hiểm thất nghiệp", support: "Hướng hỗ trợ cần trao đổi với Trung tâm", preparation: "Cơ quan tiếp nhận vẫn cần đối chiếu điều kiện và hồ sơ" }[jobNextAction(answers)]}</dd><dt>Đang cần</dt><dd>{answers.goal === "JOB" ? "Tìm việc mới" : answers.goal === "SUPPORT" ? "Kiểm tra trợ cấp thất nghiệp" : "Kiểm tra trợ cấp + tìm việc"}</dd></dl><p>Bạn có thể chụp màn hình hoặc đọc phần này khi liên hệ nơi hỗ trợ.</p></section>}
    {housingAnswers && <HousingSupportSummary answers={housingAnswers} />}{childAnswers && <ChildSupportSummary answers={childAnswers} />}
    <a className="support-link" href="tel:1022"><Phone size={18} /><span><strong>Gọi 1022</strong><small>Hướng dẫn và kết nối dịch vụ</small></span><ArrowRight size={17} /></a><SourceBadge id={service("GEN_SV_003").source_id} />
    {["GEN_SV_004", "GEN_SV_005"].map((id) => { const item = service(id); return <div className="support-resource" key={id}>
      <a className="support-link" href={officialDestination(item.online_url)} target="_blank" rel="noopener noreferrer"><Users size={18} /><span><strong>{id === "GEN_SV_004" ? "Tìm đầu mối hỗ trợ công nhân" : "Tìm đầu mối công đoàn địa phương"}</strong><small>Cổng Công đoàn Đà Nẵng; gọi 1022 nếu chưa tìm được đầu mối địa phương</small></span><ExternalLink size={14} /></a>
      <SourceBadge id={item.source_id} /></div>; })}
  </section>;
}

export function DemoApp() {
  const router = useRouter(); const params = useSearchParams();
  const [activeJourney, setActiveJourney] = useState<Journey | null>(() => {
    const entry = resolveDemoEntry(params, null);
    return entry.screen === "home" ? null : entry.journey;
  });
  const { screen, journey, demoMode, normalize } = resolveDemoEntry(params, activeJourney);
  const recording = params.get("recording") === "1";
  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [answers, setAnswers] = useState<Answers>(() => demoMode ? { ...jobDemoAnswers } : {}); const [questionIndex, setQuestionIndex] = useState(0);
  const [jobResultSection, setJobResultSection] = useState<"jobs" | "training" | undefined>();
  const [supportOpen, setSupportOpen] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<Journey | undefined>();
  const [resultFocus, setResultFocus] = useState<string | undefined>();
  const [checked, setChecked] = useState<string[]>([]);
  const initializedDemo = useRef(demoMode); const contentRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLElement>(null);
  useEffect(() => { if (normalize) router.replace("/", { scroll: true }); }, [normalize, router]);
  useEffect(() => {
    if (screen !== "questions" || activeJourney === journey) return;
    setActiveJourney(journey); setAnswers(demoMode ? { ...jobDemoAnswers } : {});
    setQuestionIndex(0); setChecked([]); setResultFocus(undefined);
  }, [screen, journey, activeJourney, demoMode]);
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
  useEffect(() => {
    if (screen !== "home") return;
    setActiveJourney(null); setAnswers({}); setQuestionIndex(0); setChecked([]); setSelectedJourney(undefined);
    setResultFocus(undefined); setSupportOpen(false);
    setJobResultSection(undefined);
    initializedDemo.current = false;
  }, [screen]);
  useEffect(() => { if (demoMode && !initializedDemo.current) { setAnswers({ ...jobDemoAnswers }); initializedDemo.current = true; } }, [demoMode]);
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
  const questions: Question[] = journey === "JOB_LOSS" ? visibleJobQuestions : journey === "HAS_CHILD" ? getChildQuestions(answers) :
    housingQuestions;
  const currentQuestion = questions[Math.min(questionIndex, questions.length - 1)];
  const setAnswer = (key: keyof Answers, value: string) => setAnswers((previous) => journey === "HAS_CHILD" ? updateChildAnswer(previous, key, value) : ({ ...previous, [key]: value }));
  function navigate(next: Screen, nextJourney = journey, demo = demoMode) {
    if (next === "home") {
      setActiveJourney(null); setAnswers({}); setQuestionIndex(0); setChecked([]);
      setSelectedJourney(undefined); setResultFocus(undefined);
      setSupportOpen(false); initializedDemo.current = false;
      setJobResultSection(undefined);
      router.push("/", { scroll: true }); return;
    }
    const query = new URLSearchParams();
    query.set("journey", journeySlugs[nextJourney]); query.set("screen", next);
    if (demo) query.set("demo", "jobloss");
    if (recording) query.set("recording", "1");
    router.push(query.size ? `/?${query}` : "/", { scroll: true });
  }
  function openPlan() { navigate("plan"); }
  function start(nextJourney: Journey, quick = false) {
    setActiveJourney(nextJourney);
    setAnswers(quick ? { ...jobDemoAnswers } : {}); setQuestionIndex(0); setChecked([]); setJobResultSection(undefined);
    initializedDemo.current = quick; navigate("questions", nextJourney, quick);
  }
  function nextQuestion() {
    if (questionIndex >= questions.length - 1) navigate("analysis");
    else { setQuestionIndex((i) => i + 1); window.scrollTo({ top: 0, behavior: reducedMotion() ? "instant" : "smooth" }); }
  }

  return <div className={`app-shell ${recording ? "recording-mode" : ""} ${journey === "JOB_LOSS" && screen !== "home" ? "job-shell" : journey === "HOUSING_DIFFICULTY" && screen !== "home" ? "housing-shell" : journey === "HAS_CHILD" && screen !== "home" ? "child-shell" : ""}`}>
    <header className="site-header"><button className="brand" aria-label="AN SINH 360 — về trang chủ" onClick={() => navigate("home")}>
      <span className="brand-symbol"><Compass size={25} strokeWidth={1.7} /></span><span><strong>AN SINH <b>360</b></strong><small>{competitionDemoMetadata.tagline}</small></span>
    </button><button className="help-button" onClick={() => setSupportOpen(true)}><CircleHelp size={18} /><span>Cần hỗ trợ?</span></button></header>
    <main ref={contentRef} tabIndex={-1} className={`main-layout screen-${screen}`}>
      <div className="main-column"><UserJourneyProgress screen={screen} stepsLabel={journey === "HAS_CHILD" && screen !== "home" ? "Các bước của gia đình" : undefined} />
        {screen === "home" ? <>
          <section className="home-intro"><span className="local-label"><MapPin size={13} /> ĐỒNG HÀNH CÙNG NGƯỜI LAO ĐỘNG LIÊN CHIỂU</span>
            <h1>AN SINH <span>360</span></h1><p className="hero-subtitle">{competitionDemoMetadata.description}</p><strong className="hero-tagline">{competitionDemoMetadata.tagline}</strong><p className="hero-support">Bạn không cần biết tên chính sách hay phải tìm đúng website.<br />Hãy bắt đầu từ việc bạn đang gặp.</p>
          </section>
          <section className="journey-selection" role="radiogroup" aria-label="Bạn đang cần giải quyết chuyện gì?"><div className="section-kicker"><h2>Bạn đang cần giải quyết chuyện gì?</h2></div>
            {competitionJourneys.map((event, index) => { const id = event.id; const item = journeyInfo[id]; const Icon = item.icon;
              return <button key={id} className={`journey-card journey-${item.tone} ${selectedJourney === id ? "journey-selected" : ""}`} role="radio" aria-checked={selectedJourney === id} tabIndex={selectedJourney ? selectedJourney === id ? 0 : -1 : index === 0 ? 0 : -1} onKeyDown={(event) => {
                if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"].includes(event.key)) return;
                event.preventDefault();
                const next = event.key === "Home" ? 0 : event.key === "End" ? competitionJourneys.length - 1 : (index + (event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1) + competitionJourneys.length) % competitionJourneys.length;
                setSelectedJourney(competitionJourneys[next].id);
                (event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button[role=radio]")[next])?.focus();
              }} onClick={() => setSelectedJourney(id)}>
                <IconBox tone={item.tone}><Icon size={24} strokeWidth={1.7} /></IconBox><span className="journey-copy"><strong>{item.title}</strong><small>{item.subtitle}</small></span>{selectedJourney === id ? <Check className="journey-chevron" size={20} /> : <ChevronRight className="journey-chevron" size={20} />}
              </button>; })}
          </section>
          <button className="primary-button home-start" disabled={!selectedJourney} onClick={() => selectedJourney && start(selectedJourney)}>Bắt đầu<ArrowRight size={18} /></button>
          <div className="trust-line"><ShieldCheck size={14} /><span>Nguồn chính thức</span><i /><span>Không cần đăng nhập</span></div>

        </> : <>
          <div className="screen-topline"><button className="back-link" onClick={() => { if (screen === "questions" && questionIndex > 0) setQuestionIndex((i) => i - 1); else navigate(screen === "plan" ? "results" : screen === "results" || screen === "analysis" ? "questions" : "home"); }}><ArrowLeft size={16} /> Quay lại</button><button className="reset-link" onClick={() => navigate("home")}>Bắt đầu lại</button><span className={`journey-mini ${journeyInfo[journey].tone}`}>{journeyInfo[journey].short}</span></div>
          {screen === "analysis" && <AnalysisScreen journey={journey} answers={answers} onComplete={completeAnalysis} />}
          {screen === "questions" && <section className={`question-screen question-${currentQuestion.key}`} aria-label="Thông tin hoàn cảnh">
            <div className="question-intro"><h1>Cho chúng tôi biết thêm một chút</h1><p>{journey === "HOUSING_DIFFICULTY" ? "Chỉ hỏi những thông tin cần thiết để tìm phương án phù hợp hơn." : journey === "HAS_CHILD" ? "Chỉ hỏi những thông tin cần thiết để tìm hướng phù hợp với gia đình." : "Chỉ hỏi những thông tin cần thiết để tìm hướng phù hợp."}</p></div><div className="question-meta"><span>CÂU HỎI</span><b>Câu {Math.min(questionIndex + 1, questions.length)}{journey === "HAS_CHILD" && !answers.childStage ? "" : `/${questions.length}`}</b></div>
            <div className="progress-track"><span style={{ width: `${journey === "HAS_CHILD" && !answers.childStage ? 25 : ((questionIndex + 1) / questions.length) * 100}%` }} /></div>
            <h2 className="current-question">{currentQuestion.title}</h2>{currentQuestion.explanation ? <details className="job-question-explanation"><summary>Vì sao cần hỏi?</summary><p>{currentQuestion.explanation}</p></details> : <p className="question-hint"><span>Vì sao cần hỏi?</span> {currentQuestion.hint}</p>}
            {currentQuestion.date ? <div className="date-question"><label htmlFor="termination-date">Ngày chấm dứt việc làm</label><input id="termination-date" type="date" max={snapshotDate} value={answers.terminationDate === "UNKNOWN" ? "" : answers.terminationDate ?? ""} onChange={(event) => setAnswer("terminationDate", event.target.value)} />
              <button className={`answer-option ${answers.terminationDate === "UNKNOWN" ? "selected" : ""}`} onClick={() => setAnswer("terminationDate", "UNKNOWN")}><span>Không nhớ chính xác</span><span className="radio-dot" /></button></div> :
              <div className="answer-options" role="radiogroup" aria-label={currentQuestion.title}>{currentQuestion.options!.map((option) =>
                <button key={option.value} role="radio" aria-checked={answers[currentQuestion.key] === option.value} className={`answer-option ${answers[currentQuestion.key] === option.value ? "selected" : ""}`} onKeyDown={(event) => { const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"]; if (!keys.includes(event.key)) return; event.preventDefault(); const options = currentQuestion.options!; const index = options.findIndex((item) => item.value === option.value); const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (index + (event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1) + options.length) % options.length; setAnswer(currentQuestion.key, options[next].value); (event.currentTarget.parentElement?.children[next] as HTMLElement)?.focus(); }} onClick={() => setAnswer(currentQuestion.key, option.value)}><span><strong>{option.label}</strong>{option.note && <small>{option.note}</small>}</span><span className="radio-dot">{answers[currentQuestion.key] === option.value && <Check size={12} />}</span></button>)}</div>}
            <div className="privacy-note"><ShieldCheck size={15} /><span>Thông tin này chỉ được dùng để đưa ra gợi ý phù hợp.</span></div>
            <div className="question-footer"><button className="primary-button" disabled={!answers[currentQuestion.key]} onClick={nextQuestion}>Tiếp tục<ArrowRight size={18} /></button></div>
          </section>}

          {screen === "results" && <section className={`results-screen ${journey === "JOB_LOSS" ? "job-results-screen" : journey === "HOUSING_DIFFICULTY" ? "housing-results-screen" : "child-results-screen"}`}><div className="page-heading result-heading"><h1>Dành cho bạn</h1><p>{journey === "JOB_LOSS" ? "Giữ quyền lợi trước mắt + tìm lại thu nhập." : journey === "HOUSING_DIFFICULTY" ? "Tìm chỗ phù hợp khả năng + không bỏ lỡ hỗ trợ." : "Làm đúng việc cho trẻ + tìm nơi chăm sóc phù hợp + không bỏ sót quyền lợi."}</p></div>{journey === "HOUSING_DIFFICULTY" ? <HousingSummary answers={answers}/> : journey === "HAS_CHILD" ? <ChildSummary answers={answers}/> : <SituationSummary journey={journey} answers={answers} />}
            {journey === "JOB_LOSS" && <JobResults answers={answers} requestedSection={jobResultSection} onSupport={() => setSupportOpen(true)} onPlan={() => openPlan()} />}
            {journey === "HOUSING_DIFFICULTY" && <HousingResultsV2 answers={answers} onPlan={() => openPlan()} onSupport={() => setSupportOpen(true)} onChild={() => navigate("questions", "HAS_CHILD", false)} />}
            {journey === "HAS_CHILD" && <ChildJourneyResults answers={answers} onPlan={() => openPlan()} onSupport={() => setSupportOpen(true)} onCare={() => { setAnswers(previous => previous.childStage==='UNDER_6'?updateChildAnswer(previous,'childNeed','CARE'):updateChildAnswer(previous,'childStage','PRESCHOOL')); setQuestionIndex(2); navigate('questions'); }} onChooseNeed={need=>{setAnswers(previous=>updateChildAnswer(previous,'childNeed',need));setQuestionIndex(need==='CARE'?2:1);navigate('questions');}} />}
            <MechanismExplainer /><p className="disclaimer"><ShieldCheck size={17} /><span>{disclaimer}</span></p>
          </section>}

          {screen === "plan" && <section className={`plan-screen ${journey === "JOB_LOSS" ? "job-plan-screen" : journey === "HOUSING_DIFFICULTY" ? "housing-plan-screen" : "child-plan-screen"}`}><div className="page-heading"><h1>{journey === "JOB_LOSS" ? "Kế hoạch của bạn sau khi mất việc" : journey === "HOUSING_DIFFICULTY" ? "Kế hoạch nhà ở của bạn" : childPlanHeading(answers)}</h1><p>{journey==='HAS_CHILD'&&childPrimaryNeed(answers)==='DONE'?'Chỉ xem thêm khi gia đình có nhu cầu.':'Làm việc đầu tiên, rồi tiếp tục từng bước.'}</p></div>
            {journey === "JOB_LOSS" ? <JobActionPlan answers={answers} onAnswer={setAnswer} onSupport={() => setSupportOpen(true)} onIncomePath={(section) => { setJobResultSection(section); setResultFocus(section === "jobs" ? "job-opportunities" : "job-training"); navigate("results"); }} checked={checked} onToggle={(id) => setChecked((previous) => previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id])} /> : journey === "HOUSING_DIFFICULTY" ? <HousingActionPlan answers={answers} onSupport={() => setSupportOpen(true)} onResultSection={(id) => { setResultFocus(id); navigate("results"); }} onChild={() => navigate("questions", "HAS_CHILD", false)} /> : <ChildActionPlan answers={answers} onSupport={() => setSupportOpen(true)} onResultSection={(id) => { setResultFocus(id); navigate("results"); }} />}
            <p className="disclaimer"><ShieldCheck size={17} /><span>{disclaimer}</span></p><button className="restart-button" onClick={() => navigate("home")}><Route size={16} />Khám phá tình huống khác</button>
          </section>}
        </>}
        {screen !== "analysis" && <footer className="page-footer"><span>AN SINH 360</span><span>Nguồn chính thức · Không cần đăng nhập</span></footer>}
      </div>
    </main>
    {supportOpen && <div className="modal-backdrop" onClick={() => setSupportOpen(false)}><section ref={modalRef} className="support-modal" role="dialog" aria-modal="true" aria-labelledby="support-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Đóng hỗ trợ" onClick={() => setSupportOpen(false)}><X size={20} /></button><SupportPanel answers={journey === "JOB_LOSS" && screen !== "home" ? answers : undefined} housingAnswers={journey === "HOUSING_DIFFICULTY" && screen !== "home" ? answers : undefined} childAnswers={journey === "HAS_CHILD" && screen !== "home" ? answers : undefined} /></section></div>}
  </div>;
}
