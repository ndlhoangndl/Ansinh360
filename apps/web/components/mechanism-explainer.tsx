import { BriefcaseBusiness, ClipboardCheck, FileCheck2, MapPin, Users } from "lucide-react";

const steps = [
  { title: "Hoàn cảnh", text: "Thông tin người dùng cung cấp", icon: Users },
  { title: "Chính sách", text: "Đối chiếu điều kiện cần kiểm tra", icon: FileCheck2 },
  { title: "Dịch vụ", text: "Xác định nơi có thể thực hiện", icon: MapPin },
  { title: "Cơ hội", text: "Kết nối chương trình / việc làm / hỗ trợ", icon: BriefcaseBusiness },
  { title: "Hành động", text: "Đưa ra bước tiếp theo cụ thể", icon: ClipboardCheck },
];

export function MechanismExplainer() {
  return <section className="mechanism-explainer" aria-labelledby="mechanism-title">
    <h2 id="mechanism-title">AN SINH 360 xử lý như thế nào?</h2>
    <ol>{steps.map((step) => <li key={step.title}><span className="mechanism-icon"><step.icon size={18} /></span><div><strong>{step.title}</strong><p>{step.text}</p></div></li>)}</ol>
  </section>;
}
