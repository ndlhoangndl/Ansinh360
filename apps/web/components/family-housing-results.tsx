"use client";

import { useState } from "react";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Answers, dataset, formatDate, housingOpportunity, opportunityStatus, policy, service } from "@/lib/demo";
import { NextActions, PracticalChecklist, RecommendationGuidance, SituationSummary } from "./result-guidance";
import { SourceDisclosure } from "./source-badge";

type CardProps = { title: string; reasons: string[]; missing: string[]; explanation: string; sourceId: string; detail?: string; preparation?: string[]; actions?: string[]; positive?: boolean; primary?: boolean; onPlan: () => void };
function GuidedCard({ title, reasons, missing, explanation, preparation, actions, positive, primary, onPlan }: CardProps) {
  return <article className="recommendation guided-card"><span className={`badge ${positive ? "badge-good" : "badge-review"}`}>{positive ? "Có dấu hiệu phù hợp" : "Chưa xác nhận quyền hưởng"}</span><h2>{title}</h2>
    <p>Hãy hỏi nơi tiếp nhận về trường hợp của gia đình bạn. Sau đó, xem giấy tờ của đúng thủ tục.</p>
    <button className={primary ? "primary-button" : "outline-button"} onClick={onPlan}>Xem việc cần làm<ArrowRight size={17} /></button>
    <RecommendationGuidance reasons={reasons} missing={missing} explanation={explanation} />
    {preparation && <PracticalChecklist items={preparation} />}{actions && <NextActions items={actions} />}
  </article>;
}

export const housingPreparation = (_answers: Answers) => ["Xác định đúng nhóm đối tượng", "Chọn đúng dự án / đợt đang mở", "Đọc yêu cầu hồ sơ của đợt đó"];
export const housingActions = housingPreparation({});
export function EarlyHousingChecklist({ answers }: { answers: Answers }) {
  return <section className="early-housing recommendation" id="housing-preparation" tabIndex={-1}>
    <h2>Chưa cần chuẩn bị hồ sơ ngay</h2><p>Trước khi tải hoặc xin giấy tờ, hãy hoàn thành các bước sau:</p>
    <PracticalChecklist heading="Các bước trước khi làm hồ sơ" items={housingPreparation(answers)} />
    <p>Sau khi xác định được đợt phù hợp, bạn mới nên lập checklist hồ sơ theo thông báo của đợt đó.</p>
  </section>;
}
export function HousingResults({ answers, onPlan, onAnswer, onSupport }: { answers: Answers; onPlan: () => void; onAnswer: (value: string) => void; onSupport: () => void }) {
  const [answering, setAnswering] = useState(false);
  const buy = answers.housingIntent === "BUY";
  const round = housingOpportunity(answers.housingIntent);
  const groupKnown = !!answers.applicantGroup && answers.applicantGroup !== "UNKNOWN";
  const groupField = dataset.profileFields.find((field) => field.field_name === "applicant_group")!;
  const labels: Record<string, string> = { ARTICLE76_6_WORKER: "Công nhân / người lao động tại doanh nghiệp", OTHER: "Nhóm khác", UNKNOWN: "Tôi chưa rõ nhóm của mình" };
  const focus = (id: string) => { const element = document.getElementById(id); element?.focus(); element?.scrollIntoView({ block: "start", behavior: "instant" }); };
  return <>
    <div className="action-first-grid">
      <article className="recommendation featured">
        <span className="action-label">LÀM NGAY · KHOẢNG 1 PHÚT</span><h2>1. Xác định bạn thuộc nhóm nào</h2>
        <p>{buy ? "Bạn muốn mua nhà ở xã hội." : "Bạn đã cho biết nhu cầu nhà ở của mình."} {answers.ownsHouse === "NO" && "Bạn / vợ hoặc chồng chưa có nhà tại Đà Nẵng."} {answers.incomeRange && answers.incomeRange !== "UNKNOWN" && "Khoảng thu nhập bạn chọn đã được ghi nhận."}</p>
        <p>{groupKnown ? "Bạn đã tự chọn nhóm của mình. Đây chưa phải xác nhận thuộc nhóm được hưởng; hãy đọc yêu cầu của đúng đợt tiếp nhận." : "Chúng tôi chưa biết bạn thuộc nhóm nào. Trả lời một câu để làm rõ hướng cần hỏi tiếp theo."}</p>
        <button className="primary-button" onClick={() => groupKnown ? focus("housing-rounds") : (setAnswering(true), focus("housing-group"))}>{groupKnown ? "Xem đợt tiếp nhận" : "Kiểm tra nhóm của tôi"}<ArrowRight size={17} /></button>
      </article>
      <article className="recommendation"><span className="action-label">SAU ĐÓ</span><h2>2. Xem đợt nào đang nhận hồ sơ</h2>
        <p>Mỗi đợt có thời gian tiếp nhận riêng. Xem trạng thái và ngày nhận hồ sơ trước khi chuẩn bị giấy tờ.</p>
        <div className="round-legend"><span className="legend-open">Đang nhận hồ sơ</span><span className="legend-scheduled">Sắp mở</span><span className="legend-closed">Đã đóng</span></div>
        <button className="outline-button" onClick={() => focus("housing-rounds")}>Xem các đợt phù hợp<ArrowRight size={17} /></button>
      </article>
    </div>
    <SituationSummary journey="HOUSING_DIFFICULTY" answers={answers} />
    <section className="verification-box group-question" id="housing-group" tabIndex={-1}>
      <h2>{groupKnown ? "Đã ghi nhận câu trả lời của bạn" : "Câu hỏi cần trả lời trước"}</h2><h3>Bạn thuộc nhóm đối tượng nào?</h3>
      <p>Ví dụ: công nhân / người lao động tại doanh nghiệp, hoặc nhóm khác theo quy định. Nếu chưa rõ, hãy chọn “Tôi chưa rõ” để được hướng dẫn.</p>
      {!answering ? <><p>{answers.applicantGroup ? labels[answers.applicantGroup] : "Thông tin nhóm đối tượng chưa được cung cấp."}</p><button className="outline-button" onClick={() => setAnswering(true)}>{groupKnown ? "Đổi câu trả lời" : "Trả lời câu này"}</button></> : <fieldset><legend>Chọn nhóm bạn muốn tìm hiểu</legend>{groupField.allowed_values.split("|").map((value) => <label className="group-option" key={value}><input type="radio" name="applicant-group" value={value} checked={answers.applicantGroup === value} onChange={() => onAnswer(value)} />{labels[value]}</label>)}<p>Chỉ ghi nhận lựa chọn của bạn; bản demo chưa kết luận điều kiện hưởng.</p><button className="outline-button" onClick={() => { setAnswering(false); focus("housing-rounds"); }}>Xem bước sau</button></fieldset>}
      {answers.applicantGroup === "UNKNOWN" && <button className="outline-button" onClick={onSupport}>Tôi cần người hỗ trợ</button>}
    </section>
    <section className="recommendation"><h2>Vì sao chúng tôi chưa thể nói bạn đủ điều kiện?</h2>
      <p>{answers.ownsHouse === "NO" && answers.incomeRange && answers.incomeRange !== "UNKNOWN" ? "Việc chưa có nhà và khoảng thu nhập bạn cung cấp là thông tin để bắt đầu, nhưng chưa đủ để kết luận." : "Nhu cầu nhà ở giúp chọn hướng tìm hiểu, nhưng chưa đủ để kết luận điều kiện hưởng."}</p>
      <p>Cần làm rõ bạn thuộc nhóm nào và yêu cầu của dự án / đợt tiếp nhận.</p><p>Sau đó, hãy đọc thông báo của đợt đó để biết giấy tờ cần chuẩn bị và nơi tiếp nhận.</p>
    </section>
    <section className="opportunity-card" id="housing-rounds" tabIndex={-1}><h2>Đợt tiếp nhận để bạn xem tiếp</h2>
      {round ? <><h3>B4-1 / B4-2 Hòa Hiệp 4</h3><p className="round-status"><CalendarDays size={16} />{opportunityStatus(round) === "SCHEDULED" ? "Sắp mở" : opportunityStatus(round) === "OPEN" ? "Đang nhận hồ sơ" : "Đã đóng"} · {formatDate(round.open_from)} – {formatDate(round.open_until)}</p><p>Đợt mua có trong bản demo, chưa xác nhận phù hợp với bạn. Trạng thái theo dữ liệu ngày {formatDate(dataset.provenance.snapshotDate)}. Kiểm tra thông báo mới nhất trước khi nộp.</p></> : <p>Chưa có đợt đúng loại hình bạn chọn được xác nhận trong bản demo. Hỏi nơi hỗ trợ để tìm thông báo đúng chương trình; không dùng đợt mua cho nhu cầu thuê hoặc lưu trú.</p>}
      <button className="outline-button" onClick={onPlan}>Xem việc của tôi lúc này<ArrowRight size={17} /></button>
    </section>
    <EarlyHousingChecklist answers={answers} />
    <SourceDisclosure entries={[{ id: "SRC_HOUSE_LAW_001", detail: "Điều 78; nhóm người lao động: Điều 76 khoản 6" }, ...(buy ? [{ id: policy("POL_HOUSE_001").legal_source_id, detail: "Điều 29, Điều 30" }] : [{ id: policy(answers.housingIntent === "RENT" ? "POL_HOUSE_002" : "POL_HOUSE_003").legal_source_id }]), ...(round ? [{ id: round.source_id }] : [{ id: service("HOUSE_SV_001").source_id }])]} />
  </>;
}

export function childPreparation(serviceId: string) {
  const rows = dataset.checklists.filter((item) => item.service_id === serviceId);
  const items: string[] = [];
  if (rows.some((item) => item.requirement_type === "FORM")) items.push("Mẫu đề nghị / tờ khai đúng thủ tục");
  if (rows.some((item) => /khai sinh|chứng sinh/i.test(item.document_or_step))) items.push("Giấy tờ về khai sinh / chứng sinh của trẻ");
  items.push("Kiểm tra giấy tờ bổ sung theo trường hợp cụ thể");
  return items;
}
export const childActions = ["Xác định đúng chính sách và trường hợp gia đình", "Chuẩn bị giấy tờ theo đúng thủ tục", "Xác nhận hồ sơ với nơi tiếp nhận"];

export function ChildResults({ answers, onPlan }: { answers: Answers; onPlan: (serviceId?: string) => void }) {
  const preschool = answers.childContext === "PRESCHOOL";
  const male = answers.childContext === "MALE";
  const mainPolicy = preschool ? "POL_CHILD_004" : male ? "POL_CHILD_002" : "POL_CHILD_001";
  const mainService = preschool ? "CHILD_SV_004" : male ? "CHILD_SV_002" : "CHILD_SV_001";
  const reason = preschool ? "Bạn muốn tìm hiểu hỗ trợ cho trẻ mầm non" : male ? "Bạn muốn tìm hiểu hỗ trợ khi vợ vừa sinh con" : answers.childContext === "FEMALE" ? "Bạn muốn tìm hiểu hỗ trợ cho lao động nữ vừa sinh con" : "Bạn muốn xem các hướng hỗ trợ cho gia đình";
  return <>
    <GuidedCard primary title={answers.childContext === "UNKNOWN" || !answers.childContext ? "Kiểm tra hỗ trợ phù hợp với gia đình" : policy(mainPolicy).policy_name}
      reasons={[reason]} missing={preschool ? ["Hỏi cơ sở mầm non con đang học: trường hợp gia đình có thuộc nhóm được hỗ trợ không?"] : ["Hỏi nơi tiếp nhận: với thông tin tham gia bảo hiểm của bạn, cần xác nhận điều kiện nào trước?"]}
      explanation={preschool ? "Không phải mọi trường hợp có con nhỏ đều thuộc nhóm hỗ trợ mầm non. Cần đối chiếu cơ sở trẻ đang học và trường hợp gia đình trước khi làm hồ sơ." : "Thông tin vừa sinh con giúp chọn hướng tìm hiểu ban đầu. Điều kiện hưởng và giấy tờ vẫn cần đối chiếu theo đúng trường hợp, không thể kết luận chỉ từ câu trả lời này."}
      preparation={childPreparation(mainService)} actions={childActions} sourceId={policy(mainPolicy).legal_source_id} onPlan={() => onPlan(mainService)} />
    {answers.childAge !== "OLDER" && <GuidedCard title="Liên thông khai sinh · cư trú · BHYT" reasons={[answers.childAge === "NEWBORN" || answers.childAge === "UNDER6" ? "Bạn cho biết con mới sinh / dưới 6 tuổi" : "Bạn có thể kiểm tra nhóm tuổi trước khi tìm hiểu thủ tục liên thông"]} missing={["Hỏi nơi tiếp nhận: con ở nhóm tuổi này cần giấy tờ gì để làm thủ tục liên thông?"]} explanation="Bạn có thể tìm hiểu một thủ tục liên thông cho các việc liên quan đến khai sinh, cư trú và BHYT của trẻ. Xác nhận hồ sơ của gia đình với nơi tiếp nhận trước khi thực hiện." sourceId={service("CHILD_SV_003").source_id} detail={`Mã thủ tục ${service("CHILD_SV_003").procedure_code}`} onPlan={() => onPlan("CHILD_SV_003")} />}
    {!preschool && <GuidedCard title="Hỗ trợ mầm non cho con công nhân" reasons={["Đây là hướng hỗ trợ có thể tìm hiểu thêm nếu trẻ thuộc nhóm mầm non"]} missing={["Hỏi cơ sở mầm non con đang học xem trường hợp gia đình có thuộc nhóm hỗ trợ không."]} explanation="Cần kiểm tra đúng nhóm trẻ và cơ sở mầm non được đề cập trong chính sách. Đây là hướng tìm hiểu thêm, chưa xác nhận gia đình được hưởng." sourceId={policy("POL_CHILD_004").legal_source_id} onPlan={() => onPlan("CHILD_SV_004")} />}
    <SourceDisclosure entries={[{ id: policy(mainPolicy).legal_source_id }, ...(answers.childAge !== "OLDER" ? [{ id: service("CHILD_SV_003").source_id, detail: `Mã thủ tục ${service("CHILD_SV_003").procedure_code}` }] : []), ...(!preschool ? [{ id: policy("POL_CHILD_004").legal_source_id }] : [])]} />
  </>;
}
