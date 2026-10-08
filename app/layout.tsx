import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "3분명상",
  description: "일하다 지쳤을 때, 탭을 닫지 않아도 되는 3분 AI 명상",
  appleWebApp: { capable: true, title: "3분명상", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#ff9eb5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream-100">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
