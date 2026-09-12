import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { StudyProvider } from "@/lib/store/study-context";
import { Navbar } from "@/components/layout/Navbar";
import { FloatingTutorChat } from "@/components/tutor/FloatingTutorChat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trilha 1000 — O caminho científico para a nota 1000 no Enem",
  description:
    "Plataforma de estudos para o Enem baseada em ciência cognitiva, repetição espaçada SM-2 e tutoria com IA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${fraunces.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased text-[#232019] dark:text-[#F1EEE7] bg-[#F7F5F0] dark:bg-[#1C1A17] transition-colors duration-150">
        <StudyProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <FloatingTutorChat />
        </StudyProvider>
      </body>
    </html>
  );
}
