// Display destinations only. Preserve the canonical URLs in the source dataset.
// Checked project procedure routes: national /p/home pages return not-found;
// the thutuc host returns 503 (2026-10-10). Use the working official search portal.
export function officialDestination(url: string) {
  if (/^https:\/\/(?:thutuc\.)?dichvucong\.gov\.vn\/p\/home\//.test(url)) return 'https://dichvucong.gov.vn/';
  if (url.startsWith('https://congdoandanang.org.vn/chi-tiet/hieu-qua-buoc-dau-tu-mo-hinh-diem-dung-chan-cong-nhan-') || url.startsWith('https://site.congdoandanang.org.vn/')) return 'https://congdoandanang.org.vn/';
  return url;
}
export function isSearchFallback(url: string) { return officialDestination(url) !== url; }
