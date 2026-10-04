"use client";

import { ArrowRight, Check, ChevronDown, ClipboardCheck, ExternalLink, FileCheck2, MapPin, Route } from "lucide-react";
import { dataset, policy, service, source } from "@/lib/demo";
import { SourceDisclosure } from "./source-badge";
import { PracticalChecklist } from "./result-guidance";
import { jobPreparation } from "@/lib/presentation";

export function JobActionPlan({ checked, onToggle, onNextPaths }: { checked: string[]; onToggle: (id: string) => void; onNextPaths: () => void }) {

  const cards = [
    { label: "HÔM NAY", title: "1. Hỏi về trường hợp nghỉ việc của bạn", text: "Ghi lại lý do nghỉ việc và quá trình đóng BHTN. Hỏi Trung tâm DVVL để biết điều kiện nào cần xác nhận trước khi chuẩn bị hồ sơ.", icon: FileCheck2, tone: "blue" },
    { label: "TIẾP THEO", title: "2. Chuẩn bị hồ sơ đúng thủ tục", text: "Bắt đầu với mẫu đề nghị và giấy tờ chấm dứt việc làm.", icon: ClipboardCheck, tone: "amber" },
    { label: "SAU ĐÓ", title: "3. Xác nhận cách nộp hồ sơ", text: service("JOB_SV_006").address, icon: MapPin, tone: "mint" },
    { label: "SONG SONG", title: "4. Tìm việc / học nghề tiếp theo", text: "Kết nối kênh việc làm chính thức và kiểm tra hỗ trợ đào tạo.", icon: Route, tone: "blue" },
  ];
  return <><div className="action-cards">{cards.map((card, index) => <article className={`action-card action-${card.tone}`} key={card.label}>
    <div className="action-card-top"><span className={`icon-box ${card.tone}`}><card.icon size={23} /></span><span className="action-index">0{index + 1}</span></div>
    <span className="action-label">{card.label}</span><h2>{card.title}</h2><p>{card.text}</p>
    {index === 0 && <a className="primary-button" href={`tel:${service("JOB_SV_006").phone.replace(/\s/g, "")}`}>Gọi Trung tâm DVVL · {service("JOB_SV_006").phone}<ArrowRight size={16} /></a>}
    {index === 1 && <><PracticalChecklist items={jobPreparation} checked={checked} onToggle={onToggle} /><a className="outline-button" href={service("JOB_SV_001").online_url} target="_blank" rel="noopener noreferrer">Kiểm tra thủ tục 1.014748<ExternalLink size={16} /></a></>}
    {index === 2 && <><a className="outline-button" href={service("JOB_SV_001").online_url} target="_blank" rel="noopener noreferrer">Xem thủ tục trên DVCQG<ExternalLink size={16} /></a></>}
    {index === 3 && <><button className="outline-button" onClick={onNextPaths}>Xem lựa chọn tiếp theo<ArrowRight size={16} /></button></>}
  </article>)}</div><SourceDisclosure entries={[{ id: policy("POL_JOB_001").legal_source_id, detail: "Điều 38" }, { id: service("JOB_SV_001").source_id, detail: "Mã thủ tục 1.014748" }, { id: service("JOB_SV_006").source_id }, { id: service("JOB_SV_007").source_id }]} /></>;
}
