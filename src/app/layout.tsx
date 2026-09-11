import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { StudyProvider } from "@/lib/store/study-context";
import { Navbar } from "@/components/layout/Navbar";
import { FloatingTutorChat } from "@/components/tutor/FloatingTutorChat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trilha 1000 — O Caminho Científico para a Nota 1000 no ENEM",
  description:
    "Plataforma de estudos para o ENEM baseada em ciência da aprendizagem (Retrieval Practice, SM-2, Ciclo ATIVO), Modo Fortaleza anti-procrastinação e tutoria por IA com Google Gemini.",
  keywords: [
    "ENEM",
    "Estudos ENEM",
    "Nota 1000",
    "Redação Nota 1000",
    "Ciclo ATIVO",
    "Repetição Espaçada",
    "Matemática ENEM",
    "Medicina SISU",
  ],
  authors: [{ name: "Trilha 1000 Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable} dark h-full`}>
      <body className="min-h-full flex flex-col bg-[#080c14] text-slate-100 selection:bg-violet-500/30 selection:text-violet-200">
        <StudyProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <FloatingTutorChat />
        </StudyProvider>
      </body>
    </html>
  );
}
