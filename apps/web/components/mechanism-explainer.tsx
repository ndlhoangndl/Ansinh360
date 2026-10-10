import { BriefcaseBusiness, ClipboardCheck, FileCheck2, MapPin, Users } from "lucide-react";

const steps = [
  { title: "Hoàn cảnh", text: "Thông tin người dùng cung cấp", icon: Users },
  { title: "Quyền lợi", text: "Đối chiếu hướng cần kiểm tra", icon: FileCheck2 },
  { title: "Dịch vụ", text: "Xác định nơi có thể thực hiện", icon: MapPin },
  { title: "Cơ hội", text: "Kết nối việc làm / đào tạo / chương trình", icon: BriefcaseBusiness },
  { title: "Hành động", text: "Đưa ra việc cần làm tiếp theo", icon: ClipboardCheck },
];

export function MechanismExplainer() {
  return <details className="mechanism-explainer judge-explainer">
    <summary>AN SINH 360 xử lý như thế nào?</summary>
    <ol>{steps.map((step) => <li key={step.title}><span className="mechanism-icon" aria-hidden><step.icon size={18} /></span><div><strong>{step.title}</strong><p>{step.text}</p></div></li>)}</ol>
  </details>;
}
