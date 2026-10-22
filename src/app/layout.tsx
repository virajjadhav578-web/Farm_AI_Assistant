import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/context";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Farm AI Assistant — Complete AI-Powered Agriculture Platform",
  description:
    "Smart digital farming companion for Indian agriculture: crop disease identification, Open-Meteo agri-weather, NPK fertilizer calculator, irrigation scheduling, APMC mandi prices, and Marathi/Hindi AI chat.",
  keywords: [
    "Farm AI",
    "Smart Farming India",
    "Crop Disease Detection",
    "Fertilizer Calculator NPK",
    "Mandi Prices Maharashtra",
    "Irrigation Planner",
    "Agricultural Advisory",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[#f8faf7] text-farm-900 antialiased selection:bg-farm-200">
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
