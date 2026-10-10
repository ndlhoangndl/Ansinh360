import sourceDataset from "./demo-data.json";

// Presentation fixtures only. No eligibility evaluation, matching, or live availability.
export type DemoJourneyId = "JOB_LOSS" | "HOUSING_DIFFICULTY" | "HAS_CHILD";
export type DemoChildStage = "NEWBORN" | "UNDER_6" | "PRESCHOOL";
export type DemoOpportunityStatus = "ACTIVE" | "VERIFY_FIRST" | "UPCOMING" | "CLOSED";
export type DemoOpportunityType = "JOB" | "HOUSING" | "CHILDCARE";

export type DemoJourney = {
  id: DemoJourneyId;
  title: string;
  goal: string;
  recommendationIds: string[];
  actionIds: string[];
};

export type DemoPreparationItem = {
  id: string;
  title: string;
  description: string;
  whereToFindInfo: string;
  serviceIds: string[];
};

export type DemoAction = {
  id: string;
  journey: DemoJourneyId;
  title: string;
  description: string;
  why: string;
  whereToFindInfo: string;
  nextAction: string;
  serviceIds: string[];
  preparationIds: string[];
  childStages?: DemoChildStage[];
};

export type DemoRecommendation = {
  id: string;
  journey: DemoJourneyId;
  role: "PRIMARY" | "SECONDARY" | "FALLBACK";
  title: string;
  summary: string;
  whyRecommended: string;
  policyIds: string[];
  serviceIds: string[];
  opportunityIds: string[];
  actionIds: string[];
  preparationIds: string[];
  childStages?: DemoChildStage[];
};

export type DemoService = {
  id: string;
  title: string;
  provider: string;
  address: string | null;
  phone: string | null;
  url: string | null;
  procedureCode: string | null;
  submissionChannels: string[];
  sourceId: string;
  sourceUrl: string;
  sourceLabel: string;
  lastVerifiedAt: string;
};

export type DemoContact = {
  name: string | null;
  phone: string | null;
  note: string;
};

export type DemoOpportunityBase = {
  id: string;
  type: DemoOpportunityType;
  title: string;
  summary: string;
  status: DemoOpportunityStatus;
  // Fixture editing date, never an official verification or live refresh date.
  lastUpdated: string;
  sourceLabel: string;
  contact: DemoContact;
  whyRecommended: string;
  provenance: "ILLUSTRATIVE" | "VERIFIED_PROJECT";
  // Grounding metadata is never inferred from a fixture editing date.
  sourceUrl?: string | null;
  sourceName?: string;
  exactAddress?: string;
  verifiedAt?: string;
  expiresAt?: string;
  confirmationText: string;
};

export type DemoJobOpportunity = DemoOpportunityBase & {
  type: "JOB";
  jobTitle: string;
  employer: string;
  area: string;
  salaryText: string;
  shift: string;
  requirements: string[];
  applicationMethod: string;
  sourceUrl: string | null;
  closingText: string;
};

export type DemoHousingOpportunity = DemoOpportunityBase & {
  type: "HOUSING";
  housingType: "ROOM" | "STUDIO" | "FAMILY_ROOM";
  area: string;
  monthlyPriceText: string;
  capacityText: string;
  distanceText: string;
  familyWithChildSuitable: boolean;
  depositText: string;
  utilitiesText: string;
  contactPhone: string | null;
  contactName: string | null;
  availabilityStatus: "RECENT" | "NEEDS_CONFIRMATION" | "EXPIRED";
  sizeText?: string;
  childSuitabilityVerified?: boolean;
  // Descriptive fixture attributes for a future presentation filter, not a matcher.
  budgetRangeVnd: { min: number; max: number };
  areaKey: "HOA_KHANH" | "LIEN_CHIEU" | "HOA_HIEP";
  householdSizeRange: { min: number; max: number };
};

export type DemoChildcareOpportunity = DemoOpportunityBase & {
  type: "CHILDCARE";
  facilityType: "PRESCHOOL" | "CHILDCARE_GROUP";
  area: string;
  ageRangeText: string;
  tuitionText: string;
  mealFeeText: string;
  openingHoursText: string;
  latePickupAvailable: boolean;
  enrollmentStatus: "RECENT" | "NEEDS_CONFIRMATION" | "EXPIRED";
  facilityName?: string;
  contactPhone: string | null;
  addressText: string;
  distanceText: string;
};

export type DemoOpportunity = DemoJobOpportunity | DemoHousingOpportunity | DemoChildcareOpportunity;

export const competitionDemoDisclosure = "Một số dữ liệu cơ hội trong bản demo được sử dụng để minh họa cơ chế điều hướng. Khi triển khai thực tế, dữ liệu cần được xác minh và cập nhật từ nguồn/đối tác phù hợp.";

export const competitionDemoMetadata = {
  productName: "AN SINH 360",
  description: "Bộ điều hướng an sinh và cơ hội địa phương cho người lao động Liên Chiểu.",
  tagline: "Từ hoàn cảnh đến hành động.",
  fixtureUpdatedAt: "2026-10-09",
  officialSnapshotDate: sourceDataset.provenance.snapshotDate,
  officialDatasetVersion: sourceDataset.provenance.datasetVersion,
  opportunityLabel: "Cơ hội minh họa",
  confirmationText: "Cần xác nhận lại với cơ sở.",
  disclosure: competitionDemoDisclosure,
  liveData: false,
} as const;

function existingService(id: string): DemoService {
  const item = sourceDataset.services.find((row) => row.service_id === id);
  if (!item) throw new Error(`Missing existing demo service: ${id}`);
  const source = sourceDataset.sources.find((row) => row.source_id === item.source_id);
  if (!source) throw new Error(`Missing existing demo source: ${item.source_id}`);
  return {
    id: item.service_id, title: item.service_name, provider: item.provider,
    address: item.address || null, phone: item.phone || null, url: item.online_url || null,
    procedureCode: item.procedure_code || null,
    submissionChannels: item.submission_channels.split("|").filter(Boolean),
    sourceId: source.source_id, sourceUrl: source.canonical_url,
    sourceLabel: source.title, lastVerifiedAt: item.last_verified,
  };
}

export const competitionServices: DemoService[] = [
  "JOB_SV_001", "JOB_SV_006", "JOB_SV_007", "JOB_SV_010", "HOUSE_SV_001",
  "CHILD_SV_001", "CHILD_SV_002", "CHILD_SV_003", "CHILD_SV_004",
].map(existingService);

// Retain original IDs, dates, status and source references without reclassifying them.
// These official snapshot records are separate from the three accommodation fixtures.
export const officialHousingOpportunities = sourceDataset.opportunities.filter(
  (item) => item.policy_id.startsWith("POL_HOUSE_"),
);

const illustrativeDefaults = {
  status: "VERIFY_FIRST",
  lastUpdated: competitionDemoMetadata.fixtureUpdatedAt,
  sourceLabel: competitionDemoMetadata.opportunityLabel,
  provenance: "ILLUSTRATIVE",
  confirmationText: competitionDemoMetadata.confirmationText,
  contact: { name: null, phone: null, note: "Chưa có đầu mối liên hệ thực tế trong dữ liệu minh họa." },
} as const;

export const jobOpportunities: DemoJobOpportunity[] = [
  {
    ...illustrativeDefaults, id: "DEMO_JOB_001", type: "JOB",
    title: "Công nhân đóng gói tại Hòa Khánh", jobTitle: "Công nhân đóng gói",
    employer: "Doanh nghiệp sản xuất — tình huống minh họa", area: "Khu vực Hòa Khánh, Liên Chiểu",
    summary: "Minh họa công việc sản xuất theo ca, có hướng dẫn ban đầu.",
    salaryText: "Tham khảo 6–8 triệu đồng/tháng; cần xác nhận lương cơ bản và phụ cấp.",
    shift: "Minh họa ca ngày hoặc ca luân phiên; hỏi rõ lịch trước khi ứng tuyển.",
    requirements: ["Có thể làm việc theo ca đã thỏa thuận", "Tìm hiểu yêu cầu sức khỏe và an toàn tại nơi làm việc"],
    applicationMethod: "Hỏi Trung tâm Dịch vụ việc làm về tin tương tự; chỉ ứng tuyển khi có tin và đầu mối đã xác nhận.",
    sourceUrl: null, closingText: "Chưa có hạn tuyển dụng thực tế được xác nhận.",
    whyRecommended: "Minh họa hướng tìm lại thu nhập gần khu công nghiệp cho người muốn làm việc sản xuất.",
  },
  {
    ...illustrativeDefaults, id: "DEMO_JOB_002", type: "JOB",
    title: "Nhân viên kho tại Liên Chiểu", jobTitle: "Nhân viên kho / soạn hàng",
    employer: "Đơn vị kho vận — tình huống minh họa", area: "Khu vực Liên Chiểu",
    summary: "Minh họa công việc kiểm đếm, sắp xếp và soạn hàng.",
    salaryText: "Tham khảo 7–9 triệu đồng/tháng; chưa xác nhận thu nhập thực nhận.",
    shift: "Minh họa ca ngày; cần hỏi rõ tăng ca và ngày nghỉ.",
    requirements: ["Đọc và kiểm tra thông tin hàng hóa", "Hỏi rõ yêu cầu nâng, vận chuyển hàng và thiết bị hỗ trợ"],
    applicationMethod: "Chuẩn bị thông tin kinh nghiệm kho; tìm tin đã xác minh qua kênh việc làm chính thức.",
    sourceUrl: null, closingText: "Chưa có hạn tuyển dụng thực tế được xác nhận.",
    whyRecommended: "Minh họa lựa chọn cho người có kinh nghiệm kho hoặc muốn tìm công việc theo ca ngày.",
  },
  {
    ...illustrativeDefaults, id: "DEMO_JOB_003", type: "JOB",
    title: "Nhân viên bán hàng tại Hòa Khánh", jobTitle: "Nhân viên bán hàng",
    employer: "Cửa hàng bán lẻ — tình huống minh họa", area: "Khu vực Hòa Khánh",
    summary: "Minh họa công việc phục vụ khách hàng và sắp xếp hàng tại cửa hàng.",
    salaryText: "Tham khảo 5,5–7 triệu đồng/tháng; cần hỏi rõ cách tính theo ca.",
    shift: "Minh họa ca sáng hoặc ca chiều; lịch cố định cần được xác nhận.",
    requirements: ["Giao tiếp với khách hàng", "Thống nhất thời gian làm việc phù hợp với việc chăm sóc gia đình"],
    applicationMethod: "Hỏi lịch ca, hợp đồng và tiền lương trước khi liên hệ ứng tuyển một tin thực tế.",
    sourceUrl: null, closingText: "Chưa có hạn tuyển dụng thực tế được xác nhận.",
    whyRecommended: "Minh họa hướng tìm việc dịch vụ gần nơi ở cho người ưu tiên lịch làm việc phù hợp gia đình.",
  },
];

export const housingOpportunities: DemoHousingOpportunity[] = [
  {
    ...illustrativeDefaults, id: "DEMO_HOUSING_001", type: "HOUSING",
    title: "Phòng trọ gọn cho 1–2 người", summary: "Minh họa phương án thuê phòng với chi phí thấp hơn, cần kiểm tra điều kiện thực tế.",
    housingType: "ROOM", area: "Khu vực Hòa Khánh", areaKey: "HOA_KHANH",
    monthlyPriceText: "Tham khảo 1,5–2 triệu đồng/tháng", budgetRangeVnd: { min: 1500000, max: 2000000 },
    capacityText: "Minh họa 1–2 người", householdSizeRange: { min: 1, max: 2 },
    distanceText: "Khoảng cách minh họa 1–3 km tới khu công nghiệp Hòa Khánh; cần kiểm tra tuyến đường.",
    familyWithChildSuitable: false, depositText: "Minh họa cọc 1 tháng; xác nhận trước khi thanh toán.",
    utilitiesText: "Điện, nước chưa gồm trong giá; cần hỏi đơn giá và chi phí khác.",
    contactPhone: null, contactName: null, availabilityStatus: "NEEDS_CONFIRMATION",
    whyRecommended: "Minh họa lựa chọn cho hộ nhỏ, ưu tiên ngân sách thuê thấp và khu vực Hòa Khánh.",
  },
  {
    ...illustrativeDefaults, id: "DEMO_HOUSING_002", type: "HOUSING",
    title: "Phòng gia đình tại Liên Chiểu", summary: "Minh họa phòng rộng hơn cho gia đình; cần khảo sát an toàn và không gian cho trẻ.",
    housingType: "FAMILY_ROOM", area: "Khu vực Liên Chiểu", areaKey: "LIEN_CHIEU",
    monthlyPriceText: "Tham khảo 2,5–3,2 triệu đồng/tháng", budgetRangeVnd: { min: 2500000, max: 3200000 },
    capacityText: "Minh họa 2–4 người", householdSizeRange: { min: 2, max: 4 },
    distanceText: "Khoảng cách minh họa 2–5 km tới khu công nghiệp Hòa Khánh; cần kiểm tra tuyến đường.",
    familyWithChildSuitable: true, depositText: "Minh họa cọc 1 tháng; hỏi rõ điều kiện hoàn cọc.",
    utilitiesText: "Điện, nước và gửi xe tính riêng; cần hỏi tổng chi phí hàng tháng.",
    contactPhone: null, contactName: null, availabilityStatus: "NEEDS_CONFIRMATION",
    whyRecommended: "Minh họa phương án cho hộ có trẻ với ngân sách và số người ở lớn hơn; chưa xác nhận an toàn thực tế.",
  },
  {
    ...illustrativeDefaults, id: "DEMO_HOUSING_003", type: "HOUSING",
    title: "Căn nhỏ có khu sinh hoạt riêng", summary: "Minh họa căn nhỏ cho gia đình muốn tách khu sinh hoạt và nghỉ ngơi.",
    housingType: "STUDIO", area: "Khu vực Hòa Hiệp", areaKey: "HOA_HIEP",
    monthlyPriceText: "Tham khảo 3–4 triệu đồng/tháng", budgetRangeVnd: { min: 3000000, max: 4000000 },
    capacityText: "Minh họa 2–3 người", householdSizeRange: { min: 2, max: 3 },
    distanceText: "Khoảng cách minh họa 4–7 km tới khu công nghiệp Hòa Khánh; cần kiểm tra tuyến đường.",
    familyWithChildSuitable: true, depositText: "Minh họa cọc 1–2 tháng; cần thỏa thuận bằng văn bản.",
    utilitiesText: "Chưa gồm điện, nước và dịch vụ; xác nhận tổng tiền trước khi quyết định.",
    contactPhone: null, contactName: null, availabilityStatus: "NEEDS_CONFIRMATION",
    whyRecommended: "Minh họa lựa chọn cho gia đình ưu tiên không gian riêng và có thể cân đối ngân sách cao hơn.",
  },
];

export const childcareOpportunities: DemoChildcareOpportunity[] = [
  {
    ...illustrativeDefaults, id: "DEMO_CHILDCARE_001", type: "CHILDCARE",
    title: "Phương án mầm non gần Hòa Khánh", summary: "Minh họa phương án chăm sóc trẻ gần khu vực làm việc của cha mẹ.",
    facilityType: "PRESCHOOL", area: "Khu vực Hòa Khánh", ageRangeText: "Minh họa 24 tháng đến 5 tuổi; hỏi lại nhóm tuổi nhận.",
    tuitionText: "Học phí tham khảo 1,2–1,8 triệu đồng/tháng. Cần xác nhận lại với cơ sở.",
    mealFeeText: "Tiền ăn tham khảo 25.000–35.000 đồng/ngày; hỏi các khoản khác.",
    openingHoursText: "Giờ minh họa 06:30–17:30, thứ Hai–thứ Sáu; cần xác nhận lại.",
    latePickupAvailable: false, enrollmentStatus: "NEEDS_CONFIRMATION", contactPhone: null,
    addressText: "Khu vực Hòa Khánh; chưa có địa chỉ cơ sở thực tế được xác nhận.",
    distanceText: "Khoảng cách minh họa 1–3 km từ khu công nghiệp Hòa Khánh.",
    whyRecommended: "Minh họa lựa chọn cho cha mẹ ưu tiên đưa đón gần khu vực làm việc và giờ hành chính.",
  },
  {
    ...illustrativeDefaults, id: "DEMO_CHILDCARE_002", type: "CHILDCARE",
    title: "Phương án nhóm trẻ tại Liên Chiểu", summary: "Minh họa lựa chọn chăm sóc trẻ nhỏ; cần kiểm tra giấy phép, an toàn và người chăm sóc.",
    facilityType: "CHILDCARE_GROUP", area: "Khu vực Liên Chiểu", ageRangeText: "Minh họa 18–36 tháng; hỏi lại nhóm tuổi nhận.",
    tuitionText: "Học phí tham khảo 1,5–2,2 triệu đồng/tháng. Cần xác nhận lại với cơ sở.",
    mealFeeText: "Tiền ăn tham khảo 25.000–35.000 đồng/ngày; xác nhận cách tính ngày nghỉ.",
    openingHoursText: "Giờ minh họa 06:30–18:00, thứ Hai–thứ Bảy; cần xác nhận lại.",
    latePickupAvailable: true, enrollmentStatus: "NEEDS_CONFIRMATION", contactPhone: null,
    addressText: "Khu vực Liên Chiểu; chưa có địa chỉ cơ sở thực tế được xác nhận.",
    distanceText: "Khoảng cách minh họa 2–4 km từ khu công nghiệp Hòa Khánh.",
    whyRecommended: "Minh họa lựa chọn cho người cần hỏi về trẻ nhỏ hoặc đón muộn; lịch và phụ phí chưa được xác nhận.",
  },
  {
    ...illustrativeDefaults, id: "DEMO_CHILDCARE_003", type: "CHILDCARE",
    title: "Phương án mầm non tại Hòa Hiệp", summary: "Minh họa phương án mầm non gần khu vực ở của gia đình.",
    facilityType: "PRESCHOOL", area: "Khu vực Hòa Hiệp", ageRangeText: "Minh họa 3–5 tuổi; hỏi lại nhóm tuổi nhận.",
    tuitionText: "Học phí tham khảo 1–1,6 triệu đồng/tháng. Cần xác nhận lại với cơ sở.",
    mealFeeText: "Tiền ăn tham khảo 20.000–30.000 đồng/ngày; hỏi các khoản đầu năm.",
    openingHoursText: "Giờ minh họa 07:00–17:00, thứ Hai–thứ Sáu; cần xác nhận lại.",
    latePickupAvailable: false, enrollmentStatus: "NEEDS_CONFIRMATION", contactPhone: null,
    addressText: "Khu vực Hòa Hiệp; chưa có địa chỉ cơ sở thực tế được xác nhận.",
    distanceText: "Khoảng cách minh họa 4–7 km từ khu công nghiệp Hòa Khánh.",
    whyRecommended: "Minh họa lựa chọn cho gia đình ở Hòa Hiệp, cân đối học phí và quãng đường đưa đón.",
  },
];

export const competitionOpportunities: DemoOpportunity[] = [
  ...jobOpportunities, ...housingOpportunities, ...childcareOpportunities,
];

export const competitionPreparationItems: DemoPreparationItem[] = [
  { id: "PREP_JOB_END", title: "Thông tin nghỉ việc", description: "Ghi lại ngày và lý do nghỉ việc theo giấy tờ đang có.", whereToFindInfo: "Quyết định nghỉ việc, thông báo chấm dứt hợp đồng hoặc giấy tờ từ doanh nghiệp.", serviceIds: ["JOB_SV_001", "JOB_SV_006"] },
  { id: "PREP_JOB_INSURANCE", title: "Thông tin tham gia bảo hiểm thất nghiệp", description: "Ghi lại quá trình tham gia đã biết; hỏi lại khi chưa rõ.", whereToFindInfo: "Thông tin bảo hiểm đang có, đơn vị sử dụng lao động hoặc nơi hỗ trợ.", serviceIds: ["JOB_SV_001", "JOB_SV_006"] },
  { id: "PREP_JOB_SEARCH", title: "Nhu cầu công việc và kỹ năng", description: "Ghi công việc mong muốn, kinh nghiệm, lịch ca và khu vực có thể đi làm.", whereToFindInfo: "Kinh nghiệm làm việc và thời gian sinh hoạt thực tế của bạn.", serviceIds: ["JOB_SV_006", "JOB_SV_007", "JOB_SV_010"] },
  { id: "PREP_HOUSING", title: "Ngân sách và nhu cầu ở", description: "Ghi ngân sách thuê, khu vực, số người ở, có trẻ hay không và các chi phí ngoài tiền thuê.", whereToFindInfo: "Thu nhập, chi phí sinh hoạt và nhu cầu của các thành viên trong hộ.", serviceIds: [] },
  { id: "PREP_HOUSING_SUPPORT", title: "Thông tin để hỏi hỗ trợ nhà ở", description: "Ghi nhóm đối tượng và loại hình cần tìm; chưa dùng lựa chọn này để kết luận điều kiện.", whereToFindInfo: "Thông tin việc làm, nhà ở đang có và thông báo chính thức của đúng chương trình.", serviceIds: ["HOUSE_SV_001"] },
  { id: "PREP_CHILD_DOCUMENTS", title: "Giấy tờ và thông tin của gia đình", description: "Xem giấy khai sinh/chứng sinh và thông tin bảo hiểm đang có nếu liên quan; đối chiếu hồ sơ của đúng thủ tục.", whereToFindInfo: "Giấy tờ gia đình đang giữ và mục hồ sơ của thủ tục đã chọn.", serviceIds: ["CHILD_SV_001", "CHILD_SV_002", "CHILD_SV_003"] },
  { id: "PREP_CHILDCARE", title: "Nhu cầu chăm sóc và khoản chi", description: "Ghi tuổi trẻ, giờ đưa đón, ngân sách học phí/tiền ăn và khu vực thuận tiện.", whereToFindInfo: "Lịch làm việc của cha mẹ, sinh hoạt của trẻ và thông tin cần hỏi cơ sở.", serviceIds: ["CHILD_SV_004"] },
];

export const competitionActions: DemoAction[] = [
  { id: "ACTION_JOB_REASON", journey: "JOB_LOSS", title: "Xác nhận lý do nghỉ việc", description: "Ghi lại lý do theo giấy tờ; hỏi Trung tâm nếu chưa rõ.", why: "Đây là thông tin còn thiếu để tiếp tục kiểm tra hướng trợ cấp thất nghiệp.", whereToFindInfo: "Quyết định nghỉ việc, thông báo chấm dứt hợp đồng hoặc giấy tờ từ doanh nghiệp.", nextAction: "Mang câu hỏi và thông tin đã có đến Trung tâm Dịch vụ việc làm để được hướng dẫn.", serviceIds: ["JOB_SV_006", "JOB_SV_001"], preparationIds: ["PREP_JOB_END"] },
  { id: "ACTION_JOB_INSURANCE", journey: "JOB_LOSS", title: "Xem lại thông tin bảo hiểm thất nghiệp", description: "Ghi thời gian tham gia mà bạn biết; chưa tự kết luận quyền hưởng.", why: "Nơi tiếp nhận cần đối chiếu thông tin và các điều kiện liên quan.", whereToFindInfo: "Thông tin quá trình tham gia bảo hiểm và hướng dẫn thủ tục 1.014748.", nextAction: "Hỏi nơi tiếp nhận cần bổ sung gì trước khi chuẩn bị hồ sơ.", serviceIds: ["JOB_SV_001", "JOB_SV_006"], preparationIds: ["PREP_JOB_INSURANCE"] },
  { id: "ACTION_JOB_INCOME", journey: "JOB_LOSS", title: "Ghi nhu cầu tìm việc hoặc học nghề", description: "Chọn hướng muốn tìm hiểu và ghi kỹ năng, khu vực, lịch làm việc.", why: "Giúp cuộc trao đổi về tìm lại thu nhập sát nhu cầu thực tế hơn.", whereToFindInfo: "Kinh nghiệm của bạn, tin tuyển dụng đã xác minh và tư vấn nghề nghiệp.", nextAction: "Hỏi Trung tâm về việc phù hợp hoặc thủ tục đào tạo 1.014747.", serviceIds: ["JOB_SV_006", "JOB_SV_007", "JOB_SV_010"], preparationIds: ["PREP_JOB_SEARCH"] },
  { id: "ACTION_HOUSING_BUDGET", journey: "HOUSING_DIFFICULTY", title: "Tính khoản có thể chi cho chỗ ở", description: "Tính cả tiền thuê, điện nước, cọc và đi lại; ghi số người ở và nhu cầu cho trẻ.", why: "Giá thuê riêng chưa phản ánh tổng chi phí của hộ.", whereToFindInfo: "Thu nhập, chi phí sinh hoạt và trao đổi với các thành viên trong hộ.", nextAction: "So sánh các phương án minh họa theo ngân sách và khu vực; xác nhận với nơi cho thuê khi có dữ liệu thật.", serviceIds: [], preparationIds: ["PREP_HOUSING"] },
  { id: "ACTION_HOUSING_SUPPORT", journey: "HOUSING_DIFFICULTY", title: "Hỏi về hướng hỗ trợ nhà ở", description: "Làm rõ loại hình cần tìm và thông báo của đúng chương trình.", why: "Hỗ trợ nhà ở cần đối chiếu đúng đối tượng và đợt tiếp nhận.", whereToFindInfo: "Thông báo chính thức và đầu mối thông tin nhà ở Đà Nẵng.", nextAction: "Hỏi yêu cầu của đúng đợt trước khi chuẩn bị giấy tờ.", serviceIds: ["HOUSE_SV_001"], preparationIds: ["PREP_HOUSING_SUPPORT"] },
  { id: "ACTION_HOUSING_VISIT", journey: "HOUSING_DIFFICULTY", title: "Xác nhận chỗ ở trước khi đặt cọc", description: "Khi có phương án thực tế, hỏi tình trạng phòng, tổng phí, hợp đồng và khảo sát điều kiện ở.", why: "Phương án minh họa chưa xác nhận còn chỗ hoặc mức giá thực tế.", whereToFindInfo: "Chủ nhà/đơn vị cho thuê thực tế và khảo sát tại chỗ.", nextAction: "Chỉ quyết định sau khi xác nhận thông tin và điều kiện thanh toán.", serviceIds: [], preparationIds: ["PREP_HOUSING"] },
  { id: "ACTION_CHILD_ADMIN", journey: "HAS_CHILD", title: "Hỏi về giấy tờ cho trẻ", description: "Tìm hiểu hướng liên thông khai sinh, thường trú và bảo hiểm y tế trẻ dưới 6 tuổi.", why: "Giúp gia đình làm rõ việc nào cần thực hiện theo hồ sơ của trẻ.", whereToFindInfo: "Giấy tờ của trẻ đang có và hướng dẫn thủ tục 2.002621.", nextAction: "Xác nhận hồ sơ và nơi tiếp nhận theo đúng thủ tục.", serviceIds: ["CHILD_SV_003"], preparationIds: ["PREP_CHILD_DOCUMENTS"], childStages: ["NEWBORN", "UNDER_6"] },
  { id: "ACTION_CHILD_RIGHTS", journey: "HAS_CHILD", title: "Hỏi về hướng quyền lợi của gia đình", description: "Chọn hướng thai sản hoặc hỗ trợ mầm non để hỏi đúng nơi; không tự kết luận được hưởng.", why: "Mỗi hướng cần kiểm tra thông tin và trường hợp cụ thể.", whereToFindInfo: "Thông tin bảo hiểm, cơ sở trẻ đang học và hướng dẫn chính sách/dịch vụ hiện có.", nextAction: "Hỏi nơi tiếp nhận về điều kiện cần xác nhận và hồ sơ của đúng trường hợp.", serviceIds: ["CHILD_SV_001", "CHILD_SV_002", "CHILD_SV_004"], preparationIds: ["PREP_CHILD_DOCUMENTS", "PREP_CHILDCARE"], childStages: ["NEWBORN", "UNDER_6", "PRESCHOOL"] },
  { id: "ACTION_CHILDCARE_CONFIRM", journey: "HAS_CHILD", title: "Xác nhận nơi chăm sóc phù hợp", description: "Hỏi nhóm tuổi nhận, giấy phép, an toàn, học phí, tiền ăn và giờ đón trẻ.", why: "Giờ làm việc và tổng chi phí cần phù hợp với gia đình; dữ liệu minh họa chưa xác nhận tuyển sinh.", whereToFindInfo: "Cơ sở thực tế, thông tin cấp phép và khảo sát trực tiếp khi triển khai.", nextAction: "Cần xác nhận lại với cơ sở trước khi chọn nơi gửi trẻ.", serviceIds: [], preparationIds: ["PREP_CHILDCARE"], childStages: ["UNDER_6", "PRESCHOOL"] },
];

export const jobRecommendations: DemoRecommendation[] = [
  { id: "REC_JOB_BENEFIT", journey: "JOB_LOSS", role: "PRIMARY", title: "Kiểm tra trợ cấp thất nghiệp", summary: "Hỏi về thông tin còn thiếu và thủ tục; chưa xác nhận quyền hưởng.", whyRecommended: "Giữ hướng kiểm tra quyền lợi trước mắt khi vừa nghỉ việc.", policyIds: ["POL_JOB_001"], serviceIds: ["JOB_SV_006", "JOB_SV_001"], opportunityIds: [], actionIds: ["ACTION_JOB_REASON", "ACTION_JOB_INSURANCE"], preparationIds: ["PREP_JOB_END", "PREP_JOB_INSURANCE"] },
  { id: "REC_JOB_WORK", journey: "JOB_LOSS", role: "SECONDARY", title: "Tìm việc phù hợp", summary: "Xem hướng công việc minh họa và hỏi tin đã xác minh qua kênh việc làm.", whyRecommended: "Tìm lại thu nhập theo kỹ năng, khu vực và lịch làm việc mong muốn.", policyIds: [], serviceIds: ["JOB_SV_006", "JOB_SV_007"], opportunityIds: jobOpportunities.map((item) => item.id), actionIds: ["ACTION_JOB_INCOME"], preparationIds: ["PREP_JOB_SEARCH"] },
  { id: "REC_JOB_TRAINING", journey: "JOB_LOSS", role: "FALLBACK", title: "Học nghề / nâng kỹ năng", summary: "Tìm hiểu hướng đào tạo và hỏi điều kiện hỗ trợ riêng.", whyRecommended: "Có thể tìm hiểu khi cần đổi công việc hoặc bổ sung kỹ năng.", policyIds: ["POL_JOB_004"], serviceIds: ["JOB_SV_006", "JOB_SV_010"], opportunityIds: [], actionIds: ["ACTION_JOB_INCOME"], preparationIds: ["PREP_JOB_SEARCH"] },
];

export const housingRecommendations: DemoRecommendation[] = [
  { id: "REC_HOUSING_SUPPORT", journey: "HOUSING_DIFFICULTY", role: "PRIMARY", title: "Kiểm tra phương án hỗ trợ nhà ở", summary: "Tìm đúng loại hình và thông báo chính thức; chưa xác nhận đủ điều kiện.", whyRecommended: "Giữ hướng tìm hiểu hỗ trợ song song với nhu cầu chỗ ở trước mắt.", policyIds: ["POL_HOUSE_001", "POL_HOUSE_002", "POL_HOUSE_003"], serviceIds: ["HOUSE_SV_001"], opportunityIds: [], actionIds: ["ACTION_HOUSING_SUPPORT"], preparationIds: ["PREP_HOUSING_SUPPORT"] },
  { id: "REC_HOUSING_OPTIONS", journey: "HOUSING_DIFFICULTY", role: "SECONDARY", title: "Tìm chỗ ở phù hợp khả năng", summary: "Xem phương án minh họa theo ngân sách, khu vực, số người ở và nhu cầu của trẻ.", whyRecommended: "Giúp cân đối tổng chi phí và sinh hoạt của hộ trước khi tìm chỗ thực tế.", policyIds: [], serviceIds: [], opportunityIds: housingOpportunities.map((item) => item.id), actionIds: ["ACTION_HOUSING_BUDGET", "ACTION_HOUSING_VISIT"], preparationIds: ["PREP_HOUSING"] },
];

export const childRecommendations: DemoRecommendation[] = [
  { id: "REC_CHILD_MATERNITY", journey: "HAS_CHILD", role: "PRIMARY", title: "Kiểm tra hướng thai sản", summary: "Giữ riêng hướng lao động nữ sinh con và lao động nam có vợ sinh con; hỏi đúng trường hợp.", whyRecommended: "Gia đình có trẻ mới sinh có thể cần tìm hiểu hướng quyền lợi liên quan.", policyIds: ["POL_CHILD_001", "POL_CHILD_002"], serviceIds: ["CHILD_SV_001", "CHILD_SV_002"], opportunityIds: [], actionIds: ["ACTION_CHILD_RIGHTS"], preparationIds: ["PREP_CHILD_DOCUMENTS"], childStages: ["NEWBORN"] },
  { id: "REC_CHILD_ADMIN", journey: "HAS_CHILD", role: "SECONDARY", title: "Khai sinh · thường trú · bảo hiểm y tế cho trẻ", summary: "Tìm hiểu thủ tục liên thông trẻ dưới 6 tuổi theo giấy tờ và việc gia đình đã thực hiện.", whyRecommended: "Giúp làm rõ các việc hành chính của trẻ, tránh tự suy đoán hồ sơ cần nộp.", policyIds: [], serviceIds: ["CHILD_SV_003"], opportunityIds: [], actionIds: ["ACTION_CHILD_ADMIN"], preparationIds: ["PREP_CHILD_DOCUMENTS"], childStages: ["NEWBORN", "UNDER_6"] },
  { id: "REC_CHILDCARE", journey: "HAS_CHILD", role: "PRIMARY", title: "Tìm nơi chăm sóc phù hợp", summary: "Xem ba phương án minh họa; hỏi nhóm tuổi, tổng chi phí và giờ đón trẻ.", whyRecommended: "Giúp cân đối việc chăm sóc trẻ với lịch làm việc và ngân sách gia đình.", policyIds: [], serviceIds: [], opportunityIds: childcareOpportunities.map((item) => item.id), actionIds: ["ACTION_CHILDCARE_CONFIRM"], preparationIds: ["PREP_CHILDCARE"], childStages: ["UNDER_6", "PRESCHOOL"] },
  { id: "REC_CHILD_PRESCHOOL_SUPPORT", journey: "HAS_CHILD", role: "SECONDARY", title: "Kiểm tra hướng hỗ trợ mầm non", summary: "Hỏi cơ sở trẻ đang học về trường hợp gia đình theo chính sách hiện có.", whyRecommended: "Không bỏ sót hướng hỗ trợ cần kiểm tra; chưa xác nhận quyền hưởng.", policyIds: ["POL_CHILD_004"], serviceIds: ["CHILD_SV_004"], opportunityIds: [], actionIds: ["ACTION_CHILD_RIGHTS"], preparationIds: ["PREP_CHILDCARE"], childStages: ["PRESCHOOL"] },
];

// Stage is a presentation choice, not a legal eligibility classification.
export const childRecommendationsByStage: Record<DemoChildStage, DemoRecommendation[]> = {
  NEWBORN: childRecommendations.filter((item) => item.childStages?.includes("NEWBORN")),
  UNDER_6: childRecommendations.filter((item) => item.childStages?.includes("UNDER_6")),
  PRESCHOOL: childRecommendations.filter((item) => item.childStages?.includes("PRESCHOOL")),
};

export const competitionRecommendations: Record<DemoJourneyId, DemoRecommendation[]> = {
  JOB_LOSS: jobRecommendations,
  HOUSING_DIFFICULTY: housingRecommendations,
  HAS_CHILD: childRecommendations,
};

export const competitionJourneys: DemoJourney[] = [
  { id: "JOB_LOSS", title: "Mất việc", goal: "Giữ quyền lợi trước mắt + tìm lại thu nhập.", recommendationIds: jobRecommendations.map((item) => item.id), actionIds: competitionActions.filter((item) => item.journey === "JOB_LOSS").map((item) => item.id) },
  { id: "HOUSING_DIFFICULTY", title: "Khó khăn về nhà ở", goal: "Tìm chỗ phù hợp khả năng + không bỏ lỡ hỗ trợ.", recommendationIds: housingRecommendations.map((item) => item.id), actionIds: competitionActions.filter((item) => item.journey === "HOUSING_DIFFICULTY").map((item) => item.id) },
  { id: "HAS_CHILD", title: "Có con nhỏ", goal: "Làm đúng việc cho trẻ + tìm nơi chăm sóc phù hợp + không bỏ sót quyền lợi.", recommendationIds: childRecommendations.map((item) => item.id), actionIds: competitionActions.filter((item) => item.journey === "HAS_CHILD").map((item) => item.id) },
];
