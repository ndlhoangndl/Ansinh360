import { housingFreshness, knownHousingChildSuitability } from './opportunity-grounding';
import { housingOpportunities, type DemoHousingOpportunity } from './competition-demo';
import { Answers, Opportunity, opportunityStatus, snapshotDate } from './demo';

// Presentation preferences only: never infer legal eligibility from affordability.
export const housingPrimaryQuestions: { key: keyof Answers; title: string; hint: string; options: { value: string; label: string }[] }[] = [
  { key: 'housingIntent', title: 'Bạn đang cần loại chỗ ở nào?', hint: 'Hai hướng chỗ ở và hỗ trợ có thể xem song song.', options: [{value:'ROOM',label:'Phòng trọ'},{value:'RENT',label:'Thuê nhà ở xã hội'},{value:'BUY',label:'Mua nhà ở xã hội'},{value:'UNKNOWN',label:'Chưa rõ, tôi muốn xem các hướng phù hợp'}] },
  { key: 'housingBudget', title: 'Bạn có thể dành khoảng bao nhiêu cho tiền nhà mỗi tháng?', hint: 'Chọn mức tối đa có thể dành cho tiền nhà; đầu trên của khoảng là giới hạn, mức thấp hơn vẫn có thể phù hợp; đây không phải đánh giá khả năng vay hoặc mua nhà.', options: [{value:'UNDER_2M',label:'Dưới 2 triệu'},{value:'2_3M',label:'2–3 triệu'},{value:'3_5M',label:'3–5 triệu'},{value:'OVER_5M',label:'Trên 5 triệu'},{value:'UNKNOWN',label:'Chưa xác định'}] },
  { key: 'householdSize', title: 'Hiện có bao nhiêu người sẽ ở cùng?', hint: 'Tính cả bạn và các thành viên sẽ ở cùng.', options: [{value:'1',label:'1 người'},{value:'2',label:'2 người'},{value:'3',label:'3 người'},{value:'4_PLUS',label:'4 người trở lên'}] },
  { key: 'housingHasChild', title: 'Gia đình có trẻ nhỏ không?', hint: 'Giúp lưu ý không gian và điều kiện ở cho trẻ.', options: [{value:'YES',label:'Có'},{value:'NO',label:'Không'}] },
  { key: 'housingArea', title: 'Bạn muốn ưu tiên khu vực nào?', hint: 'Chọn khu vực thuận tiện cho gia đình; không cần vị trí chính xác.', options: [{value:'HOA_KHANH',label:'Hòa Khánh'},{value:'LIEN_CHIEU',label:'Liên Chiểu'},{value:'HOA_HIEP',label:'Hòa Hiệp'},{value:'ANY',label:'Chưa quá quan trọng'}] },
];

export function housingConfirmedFacts(answers: Answers) {
  const facts: string[] = [];
  const intent: Record<string,string> = {ROOM:'Muốn tìm phòng trọ',RENT:'Muốn thuê nhà ở xã hội',BUY:'Muốn mua nhà ở xã hội'};
  if (intent[answers.housingIntent ?? '']) facts.push(intent[answers.housingIntent!]);
  const budget = housingPrimaryQuestions[1].options.find(o=>o.value===answers.housingBudget);
  if (budget && budget.value !== 'UNKNOWN') facts.push(`Ngân sách tiền nhà: ${budget.label.toLowerCase()}/tháng`);
  if (['1','2','3','4_PLUS'].includes(answers.householdSize ?? '')) facts.push(`Số người ở: ${answers.householdSize === '4_PLUS' ? '4 người trở lên' : `${answers.householdSize} người`}`);
  if (answers.housingHasChild === 'YES') facts.push('Có trẻ nhỏ');
  if (answers.housingHasChild === 'NO') facts.push('Không có trẻ nhỏ');
  const area = housingPrimaryQuestions[4].options.find(o=>o.value===answers.housingArea);
  if (area && area.value !== 'ANY') facts.push(`Ưu tiên khu vực ${area.label}`);
  return facts;
}

// Monthly affordability ceilings, inclusive at the displayed boundary.
// OVER_5M gives no upper limit: do not infer unlimited affordability.
export const housingBudgetCeilings: Record<string,number> = {UNDER_2M:2000000,'2_3M':3000000,'3_5M':5000000};
export function rankHousingOptions(answers: Answers, items: DemoHousingOpportunity[] = housingOpportunities, asOf?: string) {
  const ceiling = housingBudgetCeilings[answers.housingBudget ?? ''];
  const size = answers.householdSize === '4_PLUS' ? 4 : Number(answers.householdSize);
  const sizeKnown=Number.isFinite(size)&&size>0;
  return items.filter(item=>housingFreshness(item,asOf).state!=='EXPIRED').map((opportunity,index)=>{
    const budgetFull = ceiling !== undefined && opportunity.budgetRangeVnd.max <= ceiling;
    const budgetPartial = ceiling !== undefined && opportunity.budgetRangeVnd.min <= ceiling;
    const capacity = sizeKnown && size >= opportunity.householdSizeRange.min && size <= opportunity.householdSizeRange.max;
    const area = answers.housingArea === opportunity.areaKey;
    const child = answers.housingHasChild === 'YES' && knownHousingChildSuitability(opportunity) === true;
    const overBudget = ceiling !== undefined && opportunity.budgetRangeVnd.max > ceiling;
    const budgetTier = ceiling === undefined || budgetFull ? 0 : budgetPartial ? 1 : 2;
    const budgetDistance = ceiling === undefined ? 0 : Math.max(0,opportunity.budgetRangeVnd.max-ceiling);
    const areaKnown = ['HOA_KHANH','LIEN_CHIEU','HOA_HIEP'].includes(answers.housingArea ?? '');
    const reasons = [
      budgetFull ? 'Không vượt ngân sách bạn chọn' : overBudget ? 'Vượt ngân sách bạn chọn' : '',
      areaKnown ? area ? 'Đúng khu vực ưu tiên' : 'Khác khu vực ưu tiên' : '',
      capacity ? answers.householdSize === '4_PLUS' ? `Loại hình tối đa ${opportunity.householdSizeRange.max} người; hỏi lại nếu đông hơn` : 'Phù hợp số người ở' : '',
      child ? 'Có thể phù hợp gia đình có trẻ nhỏ' : '',
    ].filter(Boolean).slice(0,2);
    return { opportunity, reasons: reasons.length ? reasons : ['Loại hình để so sánh thêm'], budgetFull, overBudget, belowBudget:false, budgetTier, budgetDistance, area, capacity, capacityMismatch:sizeKnown&&!capacity, child, index };
  // Capacity is a constraint. Within the feasible group: affordability, area, child suitability.
  }).sort((a,b)=>Number(b.capacity)-Number(a.capacity) || a.budgetTier-b.budgetTier || a.budgetDistance-b.budgetDistance || Number(b.area)-Number(a.area) || Number(b.child)-Number(a.child) || a.index-b.index)
    .map((item,index)=>({...item, matchLabel: !item.capacityMismatch && item.budgetFull && index === 0 ? 'Phù hợp nhất với thông tin của bạn' : item.capacityMismatch || item.overBudget ? 'Phương án gần nhất' : 'Có một số điểm phù hợp'}));
}

export function housingSupportDirections(answers: Answers) {
  // For immediate accommodation / unclear intent, lead with rental as a direction to check,
  // without inferring eligibility or claiming a worker-lodging programme is available.
  return answers.housingIntent === 'BUY' ? ['POL_HOUSE_001','POL_HOUSE_002','POL_HOUSE_003'] : ['POL_HOUSE_002','POL_HOUSE_001','POL_HOUSE_003'];
}

export function housingRoundPresentation(round: Opportunity, evaluationDate = snapshotDate) {
  const status = opportunityStatus(round,evaluationDate);
  if (status === 'CLOSED') return {status:'CLOSED',label:'Đã đóng',cta:'Xem thông tin đợt'};
  if (status === 'SCHEDULED') return {status:'UPCOMING',label:'Sắp mở',cta:'Xem khi nào bắt đầu'};
  if (status === 'OPEN') return {status:'ACTIVE',label:'Đang tiếp nhận',cta:'Xem thông báo tiếp nhận'};
  return {status:'VERIFY_FIRST',label:'Cần kiểm tra thêm',cta:'Xem thông tin đợt'};
}

export function housingPlanSteps(answers: Answers) {
  if (answers.housingIntent === 'RENT' || answers.housingIntent === 'BUY') return [
    {time:'LÀM NGAY',title:'Xác định loại hình bạn cần',text:`Bạn chọn ${answers.housingIntent === 'BUY' ? 'mua' : 'thuê'} nhà ở xã hội. Đọc thông báo đúng loại hình, không dùng đợt mua cho nhu cầu thuê.`,target:'housing-support'},
    {time:'TIẾP THEO',title:'Xem đợt đang hoặc sắp mở',text:'Kiểm tra ngày tiếp nhận và đúng loại hình. Đợt đã đóng chỉ dùng để tham khảo lịch sử.',target:'housing-rounds'},
    {time:'SAU ĐÓ',title:'Xem cơ quan / đầu mối được nêu trong thông báo',text:'Đọc tên cơ quan, địa chỉ, cách liên hệ và đối tượng trong thông báo đúng đợt. Nếu chưa tìm được đầu mối, gọi 1022 để hỏi nơi phụ trách tại địa phương.',target:'housing-rounds'},
    {time:'CHỈ KHI ĐÃ CHỌN ĐÚNG ĐỢT',title:'Chỉ chuẩn bị hồ sơ sau khi đã chọn đúng đợt',text:'Xem mục hồ sơ trong thông báo của đúng đợt và hỏi nơi tiếp nhận trước khi tải hoặc xin giấy tờ.',target:'housing-rounds'},
  ];
  return [
    {time:'LÀM NGAY',title:'Chọn hướng loại hình để tìm tin cụ thể',text:'Ghi loại chỗ ở, ngân sách, khu vực và số người để hỏi đầu mối hỗ trợ; sau đó chọn 2–3 tin có địa chỉ và nguồn gốc để đối chiếu. Các gợi ý loại hình không phải phòng đang cho thuê.',target:'housing-search-destination'},
    {time:'TIẾP THEO',title:'Xác nhận tổng chi phí',text:'Hỏi rõ các khoản trước khi so sánh.',checklist:['Giá thuê','Tiền cọc','Điện nước','Phí khác','Điều kiện hợp đồng'],target:'housing-options'},
    {time:'TRƯỚC KHI QUYẾT ĐỊNH',title:'Xem trực tiếp chỗ ở',text:'Không chuyển tiền cọc khi chưa xác nhận thông tin, điều kiện ở, hợp đồng và điều kiện thanh toán.',target:'housing-options'},
    {time:'SONG SONG',title:'Kiểm tra hướng hỗ trợ nhà ở',text:'Tìm hiểu thuê, mua nhà ở xã hội hoặc nhà lưu trú công nhân theo thông báo đúng chương trình.',target:'housing-support'},
  ];
}
