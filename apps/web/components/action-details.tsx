import { MapPin, Phone } from "lucide-react";
import { service } from "@/lib/demo";

export function InformationOrigins({ housing = false, family = false }: { housing?: boolean; family?: boolean }) {
  const items = family ? [
    ["Trường hợp của gia đình", "Từ thông tin gia đình đang có về việc sinh con, nhóm tuổi hoặc cơ sở mầm non con đang học."],
    ["Bảo hiểm và giấy tờ của trẻ", "Xem thông tin tham gia bảo hiểm và giấy tờ khai sinh / chứng sinh đang có, nếu liên quan đến thủ tục đã chọn."],
    ["Mẫu và giấy tờ bổ sung", "Xem mục hồ sơ của đúng thủ tục; hỏi nơi tiếp nhận trước khi xin giấy tờ bổ sung."],
  ] : housing ? [
    ["Nhóm đối tượng", "Từ tình trạng việc làm / nghề nghiệp hiện tại của bạn. Nếu chưa rõ nhóm, hỏi nơi hỗ trợ."],
    ["Tình trạng nhà ở", "Từ thông tin về nhà ở của bạn / vợ hoặc chồng nếu có."],
    ["Thu nhập", "Từ thông tin thu nhập thực tế của cá nhân hoặc hai vợ chồng tùy trường hợp. Chưa tự xác định điều kiện từ khoảng thu nhập."],
    ["Mẫu đăng ký", "Lấy trong thông báo của đúng dự án / đợt tiếp nhận. Không dùng mẫu của đợt khác."],
  ] : [
    ["Ngày / hình thức nghỉ việc", "Xem quyết định nghỉ việc, thông báo chấm dứt hợp đồng hoặc giấy tờ từ doanh nghiệp."],
    ["Quá trình đóng BHTN", "Kiểm tra thông tin bạn đang có về quá trình tham gia BHXH/BHTN; hỏi đơn vị hỗ trợ nếu chưa rõ."],
    ["Mẫu hồ sơ", "Xem mục hồ sơ trong hướng dẫn thủ tục trợ cấp thất nghiệp ở bước chuẩn bị bên dưới."],
  ];
  return <section className="information-origins"><h3>Bạn có thể tìm các thông tin này ở đâu?</h3><dl>{items.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl></section>;
}

export function ServiceExecution({ serviceId, providerId }: { serviceId: string; providerId?: string }) {
  const target = service(serviceId), provider = service(providerId ?? serviceId);
  const informationOnly = target.service_type === "INFORMATION";
  return <section className="service-execution"><h3>{informationOnly ? "Đầu mối thông tin" : "Nơi thực hiện"}</h3><strong>{providerId ? provider.service_name : provider.provider || provider.service_name}</strong>
    {provider.address && <p><MapPin size={16} />{provider.address}</p>}{provider.phone && <a className="text-action" href={`tel:${provider.phone.replace(/\s/g, "")}`}><Phone size={16} />{provider.phone}</a>}
    {!provider.address && <p>{informationOnly ? "Xem thông báo của đúng chương trình để biết đơn vị tiếp nhận hồ sơ; đầu mối tra cứu không mặc nhiên là nơi nộp." : "Xác nhận nơi tiếp nhận cụ thể theo hướng dẫn của thủ tục / chương trình đã chọn trước khi đi."}</p>}
    <h3>{informationOnly ? "Cách tìm thông tin" : "Cách thực hiện"}</h3><ul className="channel-list">{target.submission_channels.split("|").filter(Boolean).map((channel) => <li key={channel}>{channel}</li>)}</ul>
    {target.procedure_code && <p className="procedure-note">Mã thủ tục: {target.procedure_code}</p>}
    <p>Chọn kênh theo hướng dẫn tiếp nhận hiện hành. Kênh trong dữ liệu không thay xác nhận của nơi thực hiện.</p>
    <h3>Làm như thế nào?</h3>{informationOnly ? <ol><li>Tìm thông báo đúng loại hình nhà ở.</li><li>Xem ngày nhận hồ sơ, yêu cầu và nơi tiếp nhận trong thông báo.</li><li>Hỏi đầu mối hỗ trợ nếu chưa rõ trước khi chuẩn bị giấy tờ.</li></ol> : <ol><li>Xác nhận thông tin còn thiếu.</li><li>Chuẩn bị giấy tờ chính theo đúng hướng dẫn.</li><li>Chọn cách thực hiện phù hợp và nộp theo hướng dẫn.</li><li>Theo dõi kết quả / bổ sung nếu được yêu cầu.</li></ol>}
  </section>;
}
