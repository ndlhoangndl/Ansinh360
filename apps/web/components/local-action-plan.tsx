import { ArrowRight, ExternalLink } from "lucide-react";
import { Answers, service, source } from "@/lib/demo";
import { childPreparation } from "./family-housing-results";
import { PracticalChecklist } from "./result-guidance";
import { InformationOrigins, ServiceExecution } from "./action-details";
import { SourceDisclosure } from "./source-badge";

export function LocalActionPlan({ housing, answers, onSupport, serviceId, onResultSection }: { housing: boolean; answers: Answers; onSupport: () => void; serviceId?: string; onResultSection: (id: string) => void }) {
  const target = service(serviceId ?? (housing ? "HOUSE_SV_001" : answers.childContext === "PRESCHOOL" ? "CHILD_SV_004" : answers.childContext === "MALE" ? "CHILD_SV_002" : "CHILD_SV_001"));
  const groupProvided = !!answers.applicantGroup && answers.applicantGroup !== "UNKNOWN";
  if (housing) return <>
    <div className="action-cards">
      <article className="action-card action-blue"><span className="action-label">LÀM NGAY</span><h2>1. Xác định nhóm đối tượng</h2><p>{groupProvided ? "Bạn đã tự chọn nhóm. Câu trả lời được giữ lại; chưa phải xác nhận điều kiện hưởng." : "Khoảng 1 phút. Trả lời một câu để làm rõ hướng cần hỏi; chưa phải xác nhận điều kiện hưởng."}</p><button className={groupProvided ? "outline-button" : "primary-button"} onClick={() => onResultSection("housing-group")}>{groupProvided ? "Xem câu trả lời của tôi" : "Kiểm tra ngay"}<ArrowRight size={17} /></button></article>
      <article className="action-card action-amber"><span className="action-label">SAU ĐÓ</span><h2>2. Tìm đợt đang hoặc sắp nhận hồ sơ</h2><p>{answers.housingIntent === "BUY" ? "Xem thông báo đợt mua và kiểm tra thời gian tiếp nhận." : "Tìm thông báo đúng loại hình bạn đã chọn."} Trạng thái chưa xác nhận bạn phù hợp với đợt đó.</p><button className={groupProvided ? "primary-button" : "outline-button"} onClick={() => onResultSection("housing-rounds")}>Xem đợt tiếp nhận</button></article>
      <article className="action-card action-mint"><span className="action-label">KHI ĐÃ CHỌN ĐƯỢC ĐỢT</span><h2>3. Xem checklist hồ sơ riêng của đợt đó</h2><p>Chưa có đợt được xác nhận phù hợp nên chưa lập danh sách giấy tờ để nộp. Đến bước chuẩn bị, xem các nhóm thông tin dưới đây trong thông báo của đúng đợt:</p><ul><li>Mẫu đăng ký của đúng đợt.</li><li>Giấy tờ chứng minh nhóm đối tượng.</li><li>Thông tin / giấy tờ về tình trạng nhà ở.</li><li>Thông tin / giấy tờ thu nhập nếu trường hợp yêu cầu.</li></ul><p>Không dùng mẫu của dự án / đợt khác.</p><InformationOrigins housing /><button className="outline-button" onClick={() => onResultSection("housing-preparation")}>Xem bước trước khi chuẩn bị hồ sơ</button></article>
      <article className="action-card action-blue"><span className="action-label">NẾU VẪN CHƯA RÕ</span><h2>4. Liên hệ nơi hỗ trợ</h2><p>Hỏi về nhóm của bạn và nơi tiếp nhận đúng chương trình. Kênh hỗ trợ chung giúp kết nối; không thay cơ quan xác nhận điều kiện.</p><ServiceExecution serviceId={target.service_id} /><a className="text-action" href={target.online_url || source(target.source_id).canonical_url} target="_blank" rel="noopener noreferrer">Xem đầu mối nhà ở<ExternalLink size={16} /></a><button className="outline-button" onClick={onSupport}>Tôi cần người hỗ trợ</button></article>
    </div><SourceDisclosure entries={[{ id: target.source_id }]} />
  </>;
  const steps = [
    { time: "LÀM NGAY", title: "1. Hỏi về trường hợp của gia đình", text: "Ghi lại thông tin tham gia bảo hiểm hoặc cơ sở mầm non con đang học. Hỏi nơi tiếp nhận xem cần xác nhận điều kiện nào trước; sau đó bạn biết nên chuẩn bị gì." },
    { time: "SAU ĐÓ", title: "2. Chuẩn bị giấy tờ đúng thủ tục", text: "Dùng hướng dẫn của thủ tục đã chọn, hỏi rõ giấy tờ bổ sung cho trường hợp của gia đình trước khi tải hoặc xin giấy tờ." },
    { time: "KHI ĐÃ CHUẨN BỊ", title: "3. Xác nhận nơi và cách nộp", text: "Đọc hướng dẫn tiếp nhận, xác nhận nơi nộp và hồ sơ cần mang theo trước khi thực hiện." },
    { time: "NẾU VẪN CHƯA RÕ", title: "4. Hỏi người hỗ trợ", text: "Ghi lại câu hỏi để được kết nối với nơi hướng dẫn, thay vì tự đoán điều kiện." },
  ];
  return <><div className="action-cards">{steps.map((step, index) => <article className="action-card action-blue" key={step.time}>
    <span className="action-label">{step.time}</span><h2>{step.title}</h2><p>{step.text}</p>
    {index === 0 && <a className="primary-button" href={target.online_url || source(target.source_id).canonical_url} target="_blank" rel="noopener noreferrer">Xem hướng dẫn để hỏi nơi tiếp nhận<ExternalLink size={16} /></a>}
    {index === 1 && <><PracticalChecklist items={childPreparation(target.service_id)} /><InformationOrigins family /></>}
    {index === 2 && <><ServiceExecution serviceId={target.service_id} /><a className="outline-button" href={target.online_url || source(target.source_id).canonical_url} target="_blank" rel="noopener noreferrer">Xem cách nộp hồ sơ<ExternalLink size={16} /></a></>}
    {index === 3 && <button className="outline-button" onClick={onSupport}>Tôi cần người hỗ trợ<ArrowRight size={16} /></button>}
  </article>)}</div><SourceDisclosure entries={[{ id: target.source_id, detail: target.procedure_code ? `Mã thủ tục ${target.procedure_code}` : undefined }]} /></>;
}
