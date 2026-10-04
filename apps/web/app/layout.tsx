import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AN SINH 360 · Từ hoàn cảnh đến hành động",
  description: "Bộ điều hướng chính sách, dịch vụ và cơ hội cho người lao động Liên Chiểu. Bản demo cuộc thi.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f7f9fc" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
