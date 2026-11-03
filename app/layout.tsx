import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Krishi-Line — Digital Agri-Procurement Infrastructure",
  description: "National procurement platform for agricultural produce. Features guaranteed delivery slot booking, QR-verified mandi intake, electronic grading, and automated PFMS Direct Benefit Transfer (DBT) disbursement.",
  keywords: ["AgriStack", "NAFED", "NCCF", "Krishi-Line", "Digital Mandi", "PFMS DBT", "Agricultural Procurement", "Nashik Model"],
  openGraph: {
    title: "Krishi-Line — Fair Prices, Transparent Procurement",
    description: "Eliminating middlemen and wait queues with digital slot booking, instant grading, and direct DBT farmer payouts.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}>
      <body className="flex min-h-full flex-col bg-white text-slate-900">
        <StoreProvider>
          <AuthProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
