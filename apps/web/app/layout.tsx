import type { Metadata, Viewport } from "next";
import "./globals.css";
import { competitionDemoMetadata } from "@/lib/competition-demo";

export const metadata: Metadata = {
  title: "AN SINH 360 | Từ hoàn cảnh đến hành động",
  description: competitionDemoMetadata.description,
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f7f9fc" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
