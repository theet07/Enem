"use client";

import React, { use } from "react";
import Link from "next/link";
import {
  Lock,
  CheckCircle2,
  Play,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Layers,
  Activity,
  Square,
  BarChart3,
  Compass,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { TOPICOS_MATEMATICA, TopicoTrilha } from "@/lib/data/trilha-matematica";
import { useStudy } from "@/lib/store/study-context";

const iconMap: Record<string, React.ElementType> = {
  Layers,
  TrendingUp,
  Activity,
  Square,
  BarChart3,
  Compass,
};

export default function TrilhaMateriaPage({
  params,
}: {
  params: Promise<{ materia: string }>;
}) {
  const resolvedParams = use(params);
  const { materia } = resolvedParams;
  const { proficiencias } = useStudy();

  const topicos = TOPICOS_MATEMATICA;

  // Separação pelas macro-fases da temporada
  const fases = [
    {
      chave: "fundacao",
      nome: "1. Fundação (Base Essencial)",
      descricao: "A base de raciocínio lógico e funções elementares. Domínio obrigatório de 70% para avançar.",
      cor: "from-blue-500 to-cyan-500",
      topicos: topicos.filter((t) => t.faseTemporada === "fundacao"),
    },
    {
      chave: "consolidacao",
      nome: "2. Consolidação (Maior Peso no ENEM)",
      descricao: "Tópicos de altíssima incidência histórica. Intercalação pesada de geometria e estatística.",
      cor: "from-violet-500 to-purple-500",
      topicos: topicos.filter((t) => t.faseTemporada === "consolidacao"),
    },
    {
      chave: "intensivo",
      nome: "3. Intensivo (Diferencial Competitivo)",
      descricao: "Questões que elevam seu IP acima de 750 pontos na escala TRI.",
      cor: "from-amber-500 to-orange-500",
      topicos: topicos.filter((t) => t.faseTemporada === "intensivo"),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header da Trilha */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            Skill Tree Visual • Matemática e suas Tecnologias
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Trilha de Domínio: Matemática ENEM
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Cada nó abaixo é uma etapa com o <strong>Ciclo ATIVO</strong>. Você precisa de pelo
            menos 70% de domínio em um pré-requisito para desbloquear a fase seguinte.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shrink-0">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Proficiência Atual</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-blue-400">
                {proficiencias.matematica.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">/ 1000</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Progresso na Trilha</span>
            <span className="text-2xl font-black text-white">2 / 6</span>
          </div>
        </div>
      </div>

      {/* Árvore de Fases Conectadas */}
      <div className="space-y-12 relative">
        {fases.map((fase, idx) => (
          <div key={fase.chave} className="space-y-4">
            {/* Título da Macro-Fase */}
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-8 rounded-full bg-gradient-to-b ${fase.cor} shadow-sm`}
              />
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">{fase.nome}</h2>
                <p className="text-xs text-slate-400">{fase.descricao}</p>
              </div>
            </div>

            {/* Grid dos Nós da Fase */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative">
              {fase.topicos.map((topico) => {
                const Icon = iconMap[topico.icone] || BookOpen;
                const isBloqueado = topico.status === "bloqueado";
                const isDominado = topico.status === "dominado";
                const isDisponivel = topico.status === "disponivel";

                return (
                  <div
                    key={topico.id}
                    className={`relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                      isBloqueado
                        ? "bg-slate-950/40 border-slate-900 opacity-60 cursor-not-allowed"
                        : isDominado
                        ? "glass-panel border-emerald-500/30 hover:border-emerald-500/50 shadow-sm"
                        : "glass-panel-glow border-violet-500/40 hover:border-violet-500/80 shadow-lg shadow-violet-950/30"
                    }`}
                  >
                    {/* Topo do Card */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                            isBloqueado
                              ? "bg-slate-900 border-slate-800 text-slate-400"
                              : isDominado
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : "bg-violet-600/20 border-violet-500/40 text-violet-300"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        {isDominado && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Dominado ({topico.porcentagemDominio}%)
                          </span>
                        )}

                        {isDisponivel && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 rounded-full animate-pulse">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            Disponível Agora
                          </span>
                        )}

                        {isBloqueado && (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                            <Lock className="w-3 h-3" />
                            Bloqueado
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Etapa {topico.ordem} • Peso ENEM: {topico.pesoEnem}x
                        </span>
                        <h3 className="text-base font-bold text-white mt-0.5">{topico.nome}</h3>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {topico.descricao}
                      </p>
                    </div>

                    {/* Rodapé e CTA */}
                    <div className="space-y-3 pt-3 border-t border-slate-800/80">
                      {topico.preRequisitoNome && isBloqueado && (
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Requisito: {topico.preRequisitoNome}</span>
                        </div>
                      )}

                      {/* Domínio & IP */}
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">IP da Etapa:</span>
                        <span className="font-bold text-slate-200">
                          {topico.ipEstimado} pts
                        </span>
                      </div>

                      {/* Botão de Ação */}
                      {isBloqueado ? (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          Bloqueado
                        </button>
                      ) : (
                        <Link
                          href={`/trilha/matematica/${topico.slug}`}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                            isDisponivel
                              ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:opacity-90 shadow-violet-600/20 hover:scale-[1.01]"
                              : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          {isDominado ? "Revisar Ciclo ATIVO" : "Iniciar Ciclo ATIVO"}
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
