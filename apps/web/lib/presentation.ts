import { Answers, Journey } from "./demo";
import { jobConfirmedFacts } from "./job-journey";

// Presentation only: do not infer residency, eligibility, goals or missing answers.
export function situationFacts(journey: Journey, answers: Answers): string[] {
  const facts: string[] = [];
  const add = (value: string | undefined, labels: Record<string, string>) => {
    if (value && labels[value]) facts.push(labels[value]);
  };
  if (journey === "JOB_LOSS") {
    return jobConfirmedFacts(answers);
  } else if (journey === "HOUSING_DIFFICULTY") {
    add(answers.housingIntent, { BUY: "Đang tìm mua nhà ở xã hội", RENT: "Đang tìm thuê nhà ở xã hội", WORKER_LODGING: "Đang tìm nhà lưu trú công nhân", UNKNOWN: "Chưa rõ loại hình nhà ở cần tìm" });
    add(answers.ownsHouse, { YES: "Bạn / vợ hoặc chồng đã có nhà tại Đà Nẵng", NO: "Bạn / vợ hoặc chồng chưa có nhà tại Đà Nẵng", UNKNOWN: "Chưa rõ tình trạng nhà ở" });
    add(answers.incomeRange, { "<=25M": "Thu nhập không quá 25 triệu / tháng", "25-35M": "Thu nhập trên 25 đến 35 triệu / tháng", ">35M": "Thu nhập trên 35 triệu / tháng", UNKNOWN: "Cần kiểm tra lại khoảng thu nhập" });
    add(answers.applicantGroup, { ARTICLE76_6_WORKER: "Bạn tự chọn nhóm công nhân / người lao động tại doanh nghiệp", OTHER: "Bạn tự chọn nhóm khác", UNKNOWN: "Bạn chưa rõ nhóm đối tượng" });
  } else {
    add(answers.childContext, { FEMALE: "Muốn tìm hiểu hỗ trợ cho lao động nữ vừa sinh con", MALE: "Muốn tìm hiểu hỗ trợ cho lao động nam có vợ vừa sinh con", PRESCHOOL: "Muốn tìm hiểu hỗ trợ cho trẻ mầm non", UNKNOWN: "Muốn xem các hỗ trợ cho gia đình" });
    add(answers.childAge, { NEWBORN: "Con mới sinh", UNDER6: "Con dưới 6 tuổi", OLDER: "Con từ 6 tuổi trở lên", UNKNOWN: "Chưa rõ nhóm tuổi / đang tìm hiểu" });
  }
  return facts;
}

export const jobPreparation = [
  "Giấy tờ chứng minh chấm dứt việc làm",
  "Thông tin quá trình đóng BHTN",
  "Thời điểm chấm dứt việc làm",
  "Thông tin liên hệ cá nhân",
];
