import { officialDestination } from "@/lib/official-destinations";
import { competitionServices } from "@/lib/competition-demo";
import { ExternalLink, MapPin, Phone } from "lucide-react";

export function JobServiceHandoff({ procedure = false, primary = false }: { procedure?: boolean; primary?: boolean }) {
  const center = competitionServices.find((item) => item.id === "JOB_SV_006")!;
  const channel = competitionServices.find((item) => item.id === "JOB_SV_007")!;
  const benefit = competitionServices.find((item) => item.id === "JOB_SV_001")!;
  return <section className="job-service-handoff" id={procedure ? "job-benefit-contact" : "job-search-destination"} tabIndex={-1}>
    <h3>{procedure ? "Liên hệ nơi có thể đối chiếu" : "Nơi bạn có thể tìm tin đang tuyển"}</h3><strong>{center.title}</strong>
    <p><MapPin size={17} />{center.address}</p>{procedure && <p>{center.phone}</p>}<a className={primary ? "primary-button" : "text-action"} href={`tel:${center.phone!.replace(/\s/g, "")}`}><Phone size={17} />{procedure ? "Gọi Trung tâm" : center.phone}</a>
    <div className="job-purpose-tags"><span>Việc làm</span><span>Tư vấn nghề nghiệp</span><span>Bảo hiểm thất nghiệp</span></div>
    <p>{procedure ? "Ghi câu hỏi và thông tin đang có; gọi hỏi lịch, kênh tiếp nhận và giấy tờ cần mang trước khi đến. Trung tâm đối chiếu điều kiện, không có kết luận quyền hưởng tại đây." : "Hỏi tin đang tuyển tương ứng với nhóm việc, khu vực và lịch bạn chọn. Đối chiếu tên đơn vị, hợp đồng, lương và ca trước khi ứng tuyển một tin cụ thể."}</p>
    {procedure && <><p>Kênh hỏi Trung tâm: {center.submissionChannels.join(" · ")}</p><p>Kênh được ghi trong hướng dẫn thủ tục: {benefit.submissionChannels.join(" · ")}. Xác nhận kênh tiếp nhận hiện hành trước khi nộp.</p><a className="text-action" href={officialDestination(benefit.url!)} target="_blank" rel="noopener noreferrer">Tra cứu thủ tục chính thức<ExternalLink size={15} /></a><p>Tại cổng tra cứu, tìm “Hưởng trợ cấp thất nghiệp”. Nếu chưa tìm được thủ tục, gọi Trung tâm theo số ở trên.</p><small>Mã thủ tục {benefit.procedureCode} · Dữ liệu đối chiếu ngày {benefit.lastVerifiedAt}</small></>}
    <a className="text-action" href={channel.url!} target="_blank" rel="noopener noreferrer">Mở nguồn việc làm<ExternalLink size={15} /></a>
  </section>;
}
