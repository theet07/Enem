"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  Shield,
  Target,
  Sparkles,
  BookOpen,
  RotateCcw,
  PenTool,
  Brain,
  Timer,
  ChevronRight,
} from "lucide-react";
import { useStudy } from "@/lib/store/study-context";

export function Navbar() {
  const pathname = usePathname();
  const { profile, notaEstimadaEnem, gapParaCorte } = useStudy();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Target },
    { href: "/trilha/matematica", label: "Trilha Matemática", icon: BookOpen },
    { href: "/revisao", label: "Fila de Revisão", icon: RotateCcw },
    { href: "/redacao", label: "Redação 1000", icon: PenTool },
    { href: "/foco", label: "Modo Fortaleza", icon: Timer },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Marca */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  TRILHA
                </span>
                <span className="px-1.5 py-0.5 rounded text-xs font-black bg-gradient-to-r from-violet-500 to-cyan-400 text-slate-950">
                  1000
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">ENEM Alta Performance</p>
            </div>
          </Link>

          {/* Links Principais */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-violet-600/15 text-violet-300 border border-violet-500/30 shadow-sm shadow-violet-500/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-violet-400" : "text-slate-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Indicadores de Nível, Streak e Meta */}
        <div className="flex items-center gap-3">
          {/* Nota Estimada ENEM */}
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-inner">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1 justify-end">
                Nota Estimada
              </div>
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                  {notaEstimadaEnem.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-400">/ 1000</span>
              </div>
            </div>
            <div className="w-2 h-7 rounded-full bg-slate-800 overflow-hidden flex flex-col justify-end">
              <div
                className="w-full bg-gradient-to-t from-violet-500 to-cyan-400 transition-all duration-700"
                style={{ height: `${(notaEstimadaEnem / 1000) * 100}%` }}
              />
            </div>
          </div>

          {/* Meta do Curso */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300 font-medium">{profile.cursoAlvo}</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-400 text-[11px]">Corte: {profile.notaCorteAlvo}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Gap: -{gapParaCorte.toFixed(1)}
            </span>
          </div>

          {/* Streak com Seguro Coringa */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/25">
            <div className="flex items-center gap-1 text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span className="text-xs font-bold">{profile.streakDias} dias</span>
            </div>
            {profile.seguroCoringaDisponivel && (
              <div
                title="Seguro de Sequência Ativo (1 dia coringa disponível esta semana)"
                className="flex items-center text-emerald-400 border-l border-amber-500/30 pl-2"
              >
                <Shield className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
