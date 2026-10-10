import { isConcreteOpportunity } from './opportunity-grounding';
import type { Answers } from './demo';
import { childcareOpportunities, type DemoChildcareOpportunity } from './competition-demo';

type ChildQuestion = {key:keyof Answers;title:string;hint:string;options:{value:string;label:string;note?:string}[]};
export const childStageQuestion: ChildQuestion = {
  key:'childStage',title:'Con bạn đang ở giai đoạn nào?',hint:'Chọn giai đoạn gần nhất với hoàn cảnh của gia đình.',options:[
    {value:'NEWBORN',label:'Sắp sinh / vừa sinh',note:'Xem việc gia đình cần làm và quyền lợi nên kiểm tra.'},
    {value:'UNDER_6',label:'Trẻ dưới 6 tuổi',note:'Kiểm tra các việc liên quan giấy tờ, bảo hiểm và hỗ trợ.'},
    {value:'PRESCHOOL',label:'Đang hoặc sắp đi nhà trẻ / mầm non',note:'Tìm nơi chăm sóc phù hợp và kiểm tra hỗ trợ liên quan.'},
  ],
};
const newbornQuestions: ChildQuestion[] = [
  {key:'childParent',title:'Bạn đang hỏi cho ai?',hint:'Thông tin này giúp chọn hướng quyền lợi phù hợp hơn với gia đình.',options:[{value:'MOTHER',label:'Mẹ của trẻ'},{value:'FATHER',label:'Bố của trẻ'},{value:'HELPER',label:'Người thân / người hỗ trợ'}]},
  {key:'childBorn',title:'Bé đã sinh chưa?',hint:'Gia đình có thể tìm hiểu trước, rồi làm các việc phù hợp sau khi bé sinh.',options:[{value:'BORN',label:'Đã sinh'},{value:'EXPECTED',label:'Sắp sinh'},{value:'UNKNOWN',label:'Không rõ nên bắt đầu từ đâu'}]},
  {key:'childInsuranceKnown',title:'Bạn đã nắm rõ thông tin bảo hiểm của cha/mẹ chưa?',hint:'Không cần nhập số bảo hiểm hoặc gửi giấy tờ.',options:[{value:'KNOWN',label:'Đã rõ'},{value:'UNKNOWN',label:'Chưa rõ'},{value:'UNSURE',label:'Không chắc'}]},
];
const needQuestion:ChildQuestion={key:'childNeed',title:'Bạn đang cần giúp việc gì nhất?',hint:'Chọn một nhu cầu để xem trước; không tự thêm việc cho gia đình.',options:[{value:'DOCUMENTS',label:'Kiểm tra giấy tờ / bảo hiểm của trẻ'},{value:'CARE',label:'Tìm nơi gửi trẻ'},{value:'SUPPORT',label:'Kiểm tra hỗ trợ liên quan'},{value:'UNKNOWN',label:'Tôi chưa rõ'}]};
const adminQuestion:ChildQuestion={key:'childAdminStatus',title:'Việc nào còn chưa hoàn thành?',hint:'Chọn theo tình trạng thực tế. Các việc đã xong sẽ không được đề nghị làm lại.',options:[{value:'BIRTH_MISSING',label:'Khai sinh'},{value:'RESIDENCE_MISSING',label:'Thông tin cư trú'},{value:'HEALTH_MISSING',label:'Bảo hiểm y tế'},{value:'MULTIPLE',label:'Có hơn một việc chưa xong'},{value:'ALL_DONE',label:'Cả ba việc đã xong'},{value:'UNKNOWN',label:'Tôi chưa rõ việc nào đã xong'}]};
const multipleQuestion:ChildQuestion={key:'childAdminMissing',title:'Những việc nào chưa xong?',hint:'Chỉ đánh dấu nhóm việc còn thiếu; nếu chưa biết, chọn chưa rõ.',options:[{value:'BIRTH|RESIDENCE',label:'Khai sinh và cư trú'},{value:'BIRTH|HEALTH',label:'Khai sinh và bảo hiểm y tế'},{value:'RESIDENCE|HEALTH',label:'Cư trú và bảo hiểm y tế'},{value:'BIRTH|RESIDENCE|HEALTH',label:'Cả ba việc chưa xong'},{value:'UNKNOWN',label:'Chưa rõ từng việc'}]};
const nextNeedQuestion:ChildQuestion={key:'childNextNeed',title:'Các việc cơ bản đã xong. Bạn muốn xem gì tiếp?',hint:'Chỉ xem thêm hướng bạn đang cần.',options:[{value:'CARE',label:'Tìm nơi gửi trẻ'},{value:'SUPPORT',label:'Kiểm tra hỗ trợ liên quan'},{value:'NONE',label:'Hiện chưa cần việc khác'}]};
export const preschoolQuestions: ChildQuestion[] = [
  {key:'childcareAge',title:'Con hiện khoảng bao nhiêu tuổi?',hint:'Nhóm tuổi nhận cần được xác nhận lại với cơ sở.',options:[{value:'UNDER_24',label:'Dưới 24 tháng'},{value:'AGE_2_3',label:'2–3 tuổi'},{value:'AGE_3_5',label:'3–5 tuổi'},{value:'UNKNOWN',label:'Chưa rõ nhóm phù hợp'}]},
  {key:'childcareArea',title:'Bạn muốn ưu tiên khu vực nào?',hint:'Chọn khu vực thuận tiện cho gia đình.',options:[{value:'HOA_KHANH',label:'Hòa Khánh'},{value:'LIEN_CHIEU',label:'Liên Chiểu'},{value:'HOA_HIEP',label:'Hòa Hiệp'},{value:'ANY',label:'Chưa quá quan trọng'}]},
  {key:'childcareBudget',title:'Ngân sách học và chăm sóc mỗi tháng khoảng bao nhiêu?',hint:'Khi hỏi cơ sở, tính thêm tiền ăn và phụ phí ngoài học phí.',options:[{value:'UNDER_1_5M',label:'Dưới 1,5 triệu'},{value:'1_5_2M',label:'1,5–2 triệu'},{value:'2_3M',label:'2–3 triệu'},{value:'OVER_3M',label:'Trên 3 triệu'},{value:'UNKNOWN',label:'Chưa xác định'}]},
  {key:'childcarePickup',title:'Bạn thường cần đón trẻ vào thời gian nào?',hint:'Hỏi rõ giờ trả trẻ và các khoản ngoài giờ.',options:[{value:'OFFICE',label:'Giờ hành chính'},{value:'17_18',label:'Khoảng 17:00–18:00'},{value:'LATER',label:'Muộn hơn'},{value:'VARIABLE',label:'Chưa cố định'}]},
];
export function childQuestions(answers: Answers):ChildQuestion[] {
  if(answers.childStage==='PRESCHOOL') return [childStageQuestion,...preschoolQuestions];
  if(answers.childStage==='NEWBORN') return [childStageQuestion,...newbornQuestions,...(answers.childBorn==='BORN'?[adminQuestion,...(answers.childAdminStatus==='MULTIPLE'?[multipleQuestion]:[])]:[])];
  if(answers.childStage!=='UNDER_6') return [childStageQuestion];
  if(answers.childNeed==='CARE') return [childStageQuestion,needQuestion,...preschoolQuestions];
  if(answers.childNeed==='SUPPORT') return [childStageQuestion,needQuestion];
  return [childStageQuestion,needQuestion,adminQuestion,...(answers.childAdminStatus==='MULTIPLE'?[multipleQuestion]:[]),...(answers.childAdminStatus==='ALL_DONE'?[nextNeedQuestion,...(answers.childNextNeed==='CARE'?preschoolQuestions:[])]:[])];
}
export function updateChildAnswer(previous:Answers,key:keyof Answers,value:string):Answers {
  const next={...previous};
  if(key==='childNeed'&&previous.childNeed!==value) {delete next.childNextNeed; delete next.childcareNeed;}
  if(key==='childStage'&&previous.childStage!==value) for(const field of ['childParent','childBorn','childInsuranceKnown','childNeed','childAdminStatus','childAdminMissing','childNextNeed','childcareNeed','childcareAge','childcareArea','childcareBudget','childcarePickup'] as (keyof Answers)[]) delete next[field];
  if(key==='childAdminStatus'&&previous.childAdminStatus!==value) {delete next.childAdminMissing; delete next.childNextNeed;}
  return {...next,[key]:value};
}
export const childAdminLabels={BIRTH:'Khai sinh',RESIDENCE:'Thông tin cư trú',HEALTH:'Bảo hiểm y tế'} as const;
export type ChildAdminTask=keyof typeof childAdminLabels;
export function childAdminState(a:Answers) {
  if(a.childAdminStatus==='ALL_DONE') return {complete:true,missing:[] as ChildAdminTask[],unresolved:false};
  const single:Record<string,ChildAdminTask>={BIRTH_MISSING:'BIRTH',RESIDENCE_MISSING:'RESIDENCE',HEALTH_MISSING:'HEALTH'};
  const missing:ChildAdminTask[]=single[a.childAdminStatus??'']?[single[a.childAdminStatus!]]:a.childAdminStatus==='MULTIPLE'?Object.keys(childAdminLabels).filter(k=>a.childAdminMissing?.split('|').includes(k)) as ChildAdminTask[]:[];
  return {complete:false,missing,unresolved:missing.length===0};
}
export function childPrimaryNeed(a:Answers):'ADMIN'|'CARE'|'SUPPORT'|'DONE' {
  if(a.childStage==='PRESCHOOL') return 'CARE';
  if(a.childStage==='NEWBORN') return childAdminState(a).complete?'SUPPORT':'ADMIN';
  if(a.childNeed==='CARE') return 'CARE';
  if(a.childNeed==='SUPPORT') return 'SUPPORT';
  if(childAdminState(a).complete) {
    if(a.childNextNeed==='CARE'||['YES','PREVIEW'].includes(a.childcareNeed??'')) return 'CARE';
    if(a.childNextNeed==='SUPPORT') return 'SUPPORT';
  }
  return childAdminState(a).complete?'DONE':'ADMIN';
}
export function childConfirmedFacts(answers: Answers) {
  const facts:string[]=[];
  for(const question of childQuestions(answers)) {
    if(question.key==='childNeed'||question.key==='childNextNeed') continue;
    const option=question.options.find(o=>o.value===answers[question.key]);
    if(!option || ['UNKNOWN','UNSURE'].includes(option.value)) continue;
    const prefixes: Partial<Record<keyof Answers,string>>={childStage:'Giai đoạn: ',childParent:'Người đang hỏi: ',childBorn:'Bé: ',childInsuranceKnown:'Thông tin bảo hiểm: ',childNeed:'Ưu tiên: ',childAdminStatus:'Tình trạng các việc cơ bản: ',childAdminMissing:'Việc còn thiếu: ',childNextNeed:'Nhu cầu tiếp theo: ',childcareNeed:'Nhu cầu gửi trẻ: ',childcareAge:'Nhóm tuổi: ',childcareArea:'Khu vực: ',childcareBudget:'Ngân sách chăm sóc: ',childcarePickup:'Giờ đón trẻ: '};
    facts.push(`${prefixes[question.key]??''}${option.label}`);
  }
  if(answers.childStage==='UNDER_6') facts.splice(1,0,`Ưu tiên: ${{CARE:'Tìm nơi chăm sóc trẻ',SUPPORT:'Kiểm tra hỗ trợ liên quan',ADMIN:'Hoàn thành việc còn thiếu cho trẻ',DONE:'Hiện chưa cần việc khác'}[childPrimaryNeed(answers)]}`);
  if(answers.childAdminStatus==='ALL_DONE'&&!facts.some(f=>f.includes('Cả ba'))) facts.push('Các việc cơ bản: cả ba việc đã xong');
  return facts;
}
export function childMaternityDirection(answers: Answers) {
  if(answers.childStage!=='NEWBORN') return null;
  return answers.childParent==='MOTHER' ? {title:'Lao động nữ sinh con',policyId:'POL_CHILD_001',serviceId:'CHILD_SV_001'} : answers.childParent==='FATHER' ? {title:'Lao động nam có vợ sinh con',policyId:'POL_CHILD_002',serviceId:'CHILD_SV_002'} : null;
}

// These bounds are a conservative reading of the existing descriptive records, not legal rules.
// Whole year answers span that age year: 2–3 years covers 24–47 months.
const ageAnswers:Record<string,[number,number]>={UNDER_24:[0,23],AGE_2_3:[24,47],AGE_3_5:[36,71]};
const budgetAnswers:Record<string,[number,number]>={UNDER_1_5M:[0,1499999],'1_5_2M':[1500000,2000000],'2_3M':[2000000,3000000],OVER_3M:[3000001,Infinity]};
function descriptiveTraits(o: DemoChildcareOpportunity) {
  // Parse only the bounded descriptive formats present in the frozen frontend records.
  const months=o.ageRangeText.match(/(\d+)–(\d+) tháng/);
  const monthYears=o.ageRangeText.match(/(\d+) tháng đến (\d+) tuổi/);
  const years=o.ageRangeText.match(/(\d+)–(\d+) tuổi/);
  const age: [number,number]|null=months?[Number(months[1]),Number(months[2])]:monthYears?[Number(monthYears[1]),(Number(monthYears[2])+1)*12-1]:years?[Number(years[1])*12,(Number(years[2])+1)*12-1]:null;
  const price=o.tuitionText.match(/(\d+(?:,\d+)?)–(\d+(?:,\d+)?) triệu/);
  const tuition: [number,number]|null=price?[Number(price[1].replace(',','.'))*1000000,Number(price[2].replace(',','.'))*1000000]:null;
  const end=o.openingHoursText.match(/–(\d{2}):(\d{2})/);
  const closes=end?Number(end[1])*60+Number(end[2]):null;
  return {age,tuition,closes};
}
export function rankChildcare(answers: Answers, items:DemoChildcareOpportunity[]=childcareOpportunities) {
  const age=ageAnswers[answers.childcareAge??''];
  const budget=budgetAnswers[answers.childcareBudget??''];
  const wantedArea=preschoolQuestions[1].options.find(o=>o.value===answers.childcareArea);
  const areaKnown=!!wantedArea && wantedArea.value!=='ANY';
  return items.map((opportunity,index)=>{
    const traits=descriptiveTraits(opportunity);
    const ageFull=!!age && !!traits.age && age[0]>=traits.age[0] && age[1]<=traits.age[1];
    const agePartial=!!age && !!traits.age && age[0]<=traits.age[1] && age[1]>=traits.age[0];
    const ageTier=!age?1:ageFull?0:agePartial?1:2;
    const areaMatch=!!areaKnown && opportunity.area.includes(wantedArea!.label);
    const budgetFull=!!budget && !!traits.tuition && traits.tuition[0]>=budget[0] && traits.tuition[1]<=budget[1];
    const budgetPartial=!!budget && !!traits.tuition && traits.tuition[0]<=budget[1] && traits.tuition[1]>=budget[0];
    const overBudget=!!budget && !!traits.tuition && traits.tuition[1]>budget[1];
    const budgetTier=!budget?1:budgetFull?0:budgetPartial?1:2;
    // A late-pickup flag supplies a direction to ask, never a guaranteed closing time.
    const pickup=answers.childcarePickup;
    const pickupMatch=pickup==='OFFICE' ? traits.closes!==null && traits.closes>=17*60 : pickup==='17_18' ? traits.closes!==null && traits.closes>=18*60 : false;
    const reasons=[ageFull?'Phù hợp nhóm tuổi':agePartial?'Chỉ một phần nhóm tuổi phù hợp; cần hỏi tuổi nhận':age?'Nhóm tuổi chưa khớp; cần xác nhận với cơ sở':'Cần xác nhận nhóm tuổi nhận',areaKnown?(areaMatch?'Đúng khu vực bạn chọn':'Khác khu vực ưu tiên'):'',budgetFull?'Học phí trong khoảng bạn chọn; chưa gồm tiền ăn và phụ phí':overBudget?'Học phí cao hơn khoảng bạn chọn':budget?'Học phí chưa khớp hoàn toàn khoảng bạn chọn':'',pickupMatch?'Giờ hoạt động gần nhu cầu đón trẻ; cần xác nhận lại':pickup==='LATER'&&opportunity.latePickupAvailable?'Có hướng hỏi về đón muộn; chưa xác nhận giờ và phụ phí':pickup&&pickup!=='VARIABLE'?'Giờ đón trẻ chưa khớp nhu cầu; cần hỏi lại':''].filter(Boolean);
    return {opportunity,index,ageFull,ageTier,areaMatch,budgetFull,budgetTier,overBudget,pickupMatch,reasons,
      fullMatch:ageFull && (!areaKnown || areaMatch) && budgetFull && pickupMatch};
  }).sort((a,b)=>a.ageTier-b.ageTier || Number(b.areaMatch)-Number(a.areaMatch) || a.budgetTier-b.budgetTier || Number(b.pickupMatch)-Number(a.pickupMatch) || a.index-b.index);
}
export function childPlanHeading(a:Answers) {
  return a.childStage==='NEWBORN'?'Kế hoạch của gia đình sau khi có em bé':childPrimaryNeed(a)==='CARE'?'Kế hoạch chăm sóc trẻ của gia đình':childPrimaryNeed(a)==='SUPPORT'?'Hướng hỗ trợ gia đình cần hỏi':childPrimaryNeed(a)==='DONE'?'Các việc bạn chọn đã hoàn thành':'Kế hoạch cho việc còn thiếu của trẻ';
}
type ChildPlanStep={time:string;title:string;why:string;where:string;next:string;target:string;checklist?:string[]};
export function childPlanSteps(a:Answers, items:DemoChildcareOpportunity[]=childcareOpportunities):ChildPlanStep[] {
  const need=childPrimaryNeed(a), admin=childAdminState(a);
  if(need==='DONE') return [];
  if(need==='CARE') return [
    ...(!items.some(isConcreteOpportunity)?[
      {time:'LÀM NGAY',title:'Xác định loại cơ sở phù hợp',why:'Hiện chưa có cơ sở cụ thể đã được xác minh; trước hết chọn loại hình theo tuổi, khu vực, ngân sách và giờ đón.',where:'Các gợi ý loại hình ở phần kết quả.',next:'Ghi nhu cầu gia đình để hỏi đầu mối tìm cơ sở thực tế.',target:'childcare-options'},
      {time:'TIẾP THEO',title:'Tìm cơ sở thực tế trong khu vực',why:'Một loại hình chưa phải là trường có tên, địa chỉ để liên hệ.',where:'Gọi 1022 để hỏi đầu mối/cơ sở phù hợp tại khu vực.',next:'Ghi tên, địa chỉ và nguồn của cơ sở thực tế được giới thiệu; sau đó liên hệ cơ sở để kiểm tra.',target:'childcare-search-destination'},
    ]:[
    {time:'LÀM NGAY',title:'Chọn 1–2 nơi đáng liên hệ',why:'Chọn hướng loại hình theo tuổi, khu vực, ngân sách và giờ đón; chưa có cơ sở thực tế được xác nhận.',where:'Gợi ý loại hình và nguồn hướng dẫn chăm sóc trẻ ở phần kết quả. Hỏi đầu mối địa phương để tìm cơ sở thực tế có tên, địa chỉ và giấy phép.',next:'Ghi 1–2 cơ sở thực tế từ nguồn tìm được; chưa gọi một gợi ý loại hình là trường đang nhận trẻ.',target:'childcare-options'}]),
    {time:'SAU KHI TÌM ĐƯỢC CƠ SỞ',title:'Xác nhận tổng chi phí và giờ đưa đón',why:'Học phí riêng chưa phải toàn bộ chi phí; giờ trả trẻ cần phù hợp lịch gia đình.',where:'Nguồn gốc và cơ sở thực tế bạn vừa tìm được.',next:'Hỏi học phí, tiền ăn, phụ phí và giờ nhận/trả; đối chiếu tổng chi phí.',checklist:['Học phí','Tiền ăn','Phụ phí','Giờ đón/trả','Khoản ngoài giờ'],target:'childcare-options'},
    {time:'TRƯỚC KHI QUYẾT ĐỊNH',title:'Xác nhận tuyển sinh và xem trực tiếp cơ sở',why:'Thông tin nhóm tuổi, tuyển sinh, giấy phép và an toàn cần được kiểm tra.',where:'Cơ sở thực tế và nguồn thông tin của cơ sở.',next:'Hỏi nhóm tuổi nhận, tuyển sinh; hẹn xem trực tiếp trước khi quyết định.',target:'childcare-options'},
    {time:'SONG SONG',title:'Kiểm tra hỗ trợ nếu cần',why:'Nếu trẻ đang học mầm non, gia đình có thể hỏi hướng hỗ trợ liên quan; không tự kết luận thuộc nhóm áp dụng.',where:'Hướng dẫn chính thức; cơ sở trẻ đang học hoặc đầu mối địa phương.',next:'Hỏi trường hợp thực tế của gia đình có hướng hỗ trợ nào áp dụng.',target:'child-support'},
  ];
  const steps:ChildPlanStep[]=[];
  if(!admin.complete&&need==='ADMIN') {
    const expected=a.childStage==='NEWBORN'&&a.childBorn==='EXPECTED';
    steps.push({time:'LÀM NGAY',title:expected?'Tìm hiểu việc cần làm sau khi bé sinh':admin.unresolved?'Xác định việc nào đã hoàn thành':admin.missing.length===1?`Hoàn thành ${childAdminLabels[admin.missing[0]].toLowerCase()} cho trẻ`:'Hoàn thành những việc còn thiếu cho trẻ',why:expected?'Các việc sau sinh cần thông tin của trẻ.':admin.unresolved?'Chưa rõ từng việc; không coi cả ba đều thiếu.':`Bạn cho biết còn thiếu: ${admin.missing.map(k=>childAdminLabels[k]).join(', ')}.`,where:'Giấy tờ gia đình đang có; hướng dẫn thủ tục liên thông và cơ quan phụ trách việc còn thiếu.',next:expected?'Sau khi bé sinh, xác định tình trạng từng việc rồi hỏi nơi tiếp nhận.':admin.unresolved?'Xác định việc nào đã xong trước; chỉ hỏi cách làm phần còn thiếu.':'Mở hướng dẫn, hỏi hồ sơ cho đúng việc còn thiếu; không làm lại phần đã xong.',target:'child-admin'});
    if(!expected&&!admin.unresolved) steps.push({time:'TIẾP THEO',title:'Hỏi nơi thực hiện cho việc còn thiếu',why:'Nơi tiếp nhận đối chiếu tình trạng thực tế, không tự đoán hồ sơ.',where:'Cơ quan hộ tịch / Công an / Bảo hiểm xã hội theo đúng phần việc; xem nguồn thủ tục chính thức.',next:'Ghi yêu cầu hồ sơ và kênh tiếp nhận; chỉ chuẩn bị theo hướng dẫn của cơ quan.',target:'child-admin'});
  }
  if(a.childStage==='NEWBORN') steps.push({time:'SONG SONG',title:'Kiểm tra hướng thai sản của cha/mẹ',why:'Hướng hỏi theo vai trò cha/mẹ, chưa xác nhận quyền hưởng.',where:'Thông tin bảo hiểm đang có, đơn vị sử dụng lao động hoặc Bảo hiểm xã hội.',next:'Mở hướng dẫn đúng cha/mẹ; hỏi nơi tiếp nhận về quá trình tham gia và trường hợp sinh con.',target:'child-support'});
  else if(need==='SUPPORT') steps.push({time:'LÀM NGAY',title:'Kiểm tra hướng hỗ trợ liên quan',why:'Đây là nhu cầu bạn chọn; không tự thêm giấy tờ đã hoàn thành hoặc kết luận có quyền hưởng.',where:'Nguồn hỗ trợ mầm non hiện có và đầu mối địa phương; nếu trẻ chưa học mầm non, hỏi hướng khác phù hợp trường hợp thực tế.',next:'Xác định trẻ đang học ở đâu và hỏi điều kiện áp dụng; dùng 1022 nếu chưa rõ nơi hỏi.',target:'child-support'});
  return steps;
}
