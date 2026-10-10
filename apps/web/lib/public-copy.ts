import type { DemoOpportunityType } from './competition-demo';

// Display copy only; fixture records, ranking and availability remain unchanged.
export const opportunityDisclosure = 'Thông tin cơ hội có thể thay đổi theo thời điểm. Vui lòng xác nhận lại với nguồn hoặc đơn vị liên quan trước khi quyết định.';
export const opportunityConfirmation = 'Vui lòng xác nhận lại trước khi liên hệ hoặc quyết định.';

export function opportunityLabel(type: DemoOpportunityType) {
  return { JOB: 'Cần xác nhận tin tuyển dụng', HOUSING: 'Cần xác nhận còn chỗ', CHILDCARE: 'Cần xác nhận tuyển sinh' }[type];
}

export function opportunityReferenceText(text: string) {
  return text.replace(/Minh họa /g, 'Tham khảo: ').replace(/minh họa/g, 'tham khảo');
}

export function referenceAmount(text: string) {
  return `Khoảng tham khảo: ${text.replace(/^(?:Tham khảo[: ]*|Khoảng[: ]*)/i, '').replace(/;?\s*cần xác nhận.*$/i, '')}`;
}

export function plainLanguage(text: string) {
  const terms: Record<string,string> = {NOXH:'nhà ở xã hội',GDMN:'giáo dục mầm non',KCN:'khu công nghiệp',BHYT:'bảo hiểm y tế',BHXH:'Bảo hiểm xã hội',BHTN:'bảo hiểm thất nghiệp',UBND:'Ủy ban nhân dân'};
  return text.replace(/\b(NOXH|GDMN|KCN|BHYT|BHXH|BHTN|UBND)\b/g, value=>terms[value]);
}
