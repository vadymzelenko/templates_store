import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import "@/components/ui/stepper.css";
import SmoothScroll from "@/components/ui/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata = {
  title: { default: "Template Store — готовые сайты для бизнеса", template: "%s" },
  description: "Готовые лендинги и сайты с онлайн-записью для малого бизнеса: барбершоп, стоматология, автосервис, кофейня, ремонт и другие ниши.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><SmoothScroll />{children}</body>
    </html>
  );
}
