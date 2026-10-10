import Link from 'next/link';

export default function NotFound() {
  return <main className="not-found-screen">
    <span className="eyebrow">AN SINH 360</span>
    <h1>Trang này không có ở đây</h1>
    <p>Bạn có thể về trang chủ để chọn tình huống cần hỗ trợ.</p>
    <Link href="/" className="primary-button">Về trang chủ</Link>
  </main>;
}
