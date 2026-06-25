import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FOCO FISCAL — Diagnóstico",
  description: "Aplicação de diagnóstico fiscal-trabalhista com IA, Supabase e Hotmart",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#F8F6F1] text-[#1C0A00]">{children}</body>
    </html>
  );
}
