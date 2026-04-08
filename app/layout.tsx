import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import AcknowledgmentModal from "@/components/layout/AcknowledgmentModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuickChart — EMS PCR Narrative Generator",
  description: "Generate Medicare-compliant EMS PCR narratives with AI",
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
};

export const viewport: Viewport = {
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased bg-slate-50`}>
        <AcknowledgmentModal />
        <Header />
        {children}
      </body>
    </html>
  );
}
