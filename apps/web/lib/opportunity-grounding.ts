import type { DemoOpportunity, DemoHousingOpportunity } from './competition-demo';

export function safeSourceUrl(url?: string | null) {
  if (!url) return null;
  try { const parsed=new URL(url); return parsed.protocol==='https:' && !parsed.username && !parsed.password ? url : null; } catch { return null; }
}
const dateKnown=(value?:string)=>!!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));

// Presentation classification only. An editing date or plausible title cannot verify an item.
export function isConcreteOpportunity(item: DemoOpportunity) {
  if(item.provenance!=='VERIFIED_PROJECT' || !item.sourceName?.trim() || !safeSourceUrl(item.sourceUrl) || !dateKnown(item.verifiedAt) || !item.area.trim()) return false;
  if(item.type==='JOB') return !!item.employer.trim() && !!item.status;
  if(!item.exactAddress?.trim()) return false;
  if(item.type==='HOUSING') return !!item.monthlyPriceText.trim() && !!item.availabilityStatus;
  return !!item.facilityName?.trim() && !!item.ageRangeText.trim() && !!item.enrollmentStatus;
}
export function housingFreshness(item: DemoHousingOpportunity, asOf=new Date().toISOString().slice(0,10)) {
  if(!isConcreteOpportunity(item)) return {state:'DIRECTION' as const,label:'Gợi ý loại hình'};
  const state=item.availabilityStatus==='EXPIRED' || (dateKnown(item.expiresAt) && item.expiresAt!<asOf) ? 'EXPIRED' : item.availabilityStatus;
  return {state,label:{RECENT:'Có thông tin cập nhật gần đây',NEEDS_CONFIRMATION:'Cần xác nhận còn chỗ',EXPIRED:'Thông tin đã hết hạn'}[state]};
}
export function knownHousingChildSuitability(item: DemoHousingOpportunity) {
  return isConcreteOpportunity(item) && item.childSuitabilityVerified===true ? item.familyWithChildSuitable : null;
}
export function directionTitle(item: DemoOpportunity) {
  if(item.type==='JOB') return item.jobTitle;
  if(item.type==='HOUSING') return {ROOM:'Hướng tìm phòng trọ cho hộ nhỏ',FAMILY_ROOM:'Hướng tìm phòng trọ cho gia đình',STUDIO:'Hướng tìm căn nhỏ có không gian riêng'}[item.housingType];
  return item.facilityType==='CHILDCARE_GROUP'?'Hướng tìm nhóm trẻ':'Hướng tìm cơ sở mầm non';
}
