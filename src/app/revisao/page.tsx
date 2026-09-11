"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RotateCcw,
  CheckCircle2,
  Calendar,
  Zap,
  ArrowRight,
  Sparkles,
  Layers,
  TrendingUp,
  Brain,
} from "lucide-react";
import { useStudy } from "@/lib/store/study-context";

export default function RevisaoPage() {
  const { topicoProgresso } = useStudy();

  const [cardsRevisao, setCardsRevisao] = useState([
    {
      id: "rev-01",
      area: "Matemática",
      topico: "Conjuntos e Intervalos Numéricos",
      slug: "conjuntos-intervalos",
      urgencia: "Vence hoje",
      retencao: "84%",
      intervaloAtual: "6 dias",
      conceitoFlash: "Qual a diferença entre intervalo fechado [a, b] e aberto (a, b)?",
      respostaFlash: "Fechado [a, b] inclui as extremidades a e b (bolinha cheia). Aberto (a, b) exclui as extremidades (bolinha aberta).",
      mostrado: false,
    },
    {
      id: "rev-02",
      area: "Matemática",
      topico: "Funções do 1º Grau (Afim)",
      slug: "funcoes-1-grau",
      urgencia: "Revisão sugerida",
      retencao: "92%",
      intervaloAtual: "2 dias",
      conceitoFlash: "Como encontrar a raiz de f(x) = ax + b no plano cartesiano?",
      respostaFlash: "Basta igualar f(x) = 0: ax + b = 0 => x = -b/a. É o ponto exato onde a reta intersecta o eixo X!",
      mostrado: false,
    },
  ]);

  const alternarMostrar = (id: string) => {
    setCardsRevisao((prev) =>
      prev.map((c) => (c.id === id ? { ...c, mostrado: !c.mostrado } : c))
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel-glow border border-violet-500/30 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold">
          <RotateCcw className="w-3.5 h-3.5" />
          Algoritmo SM-2 • Curva de Esquecimento de Ebbinghaus
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Fila Diária de Revisão Espaçada
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Estudar uma única vez gera a ilusão de domínio. O algoritmo da Trilha 1000 programa revisões
          rápidas no momento exato antes de você esquecer, transferindo o conteúdo para a memória
          de longo prazo.
        </p>
      </div>

      {/* Cards de Recuperação Ativa */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Flashcards de Recuperação Rápida ({cardsRevisao.length})
          </h2>
          <span className="text-xs text-slate-400">Tempo estimado: 4 minutos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cardsRevisao.map((card) => (
            <div
              key={card.id}
              className="p-6 rounded-2xl glass-card-interactive border border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-400">{card.area}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                    {card.urgencia}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{card.topico}</h3>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200 leading-relaxed font-medium">
                  {card.conceitoFlash}
                </div>

                {card.mostrado && (
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs sm:text-sm text-emerald-200 leading-relaxed animate-fade-in">
                    <strong className="text-emerald-400 block mb-1">Gabarito Mental:</strong>
                    {card.respostaFlash}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => alternarMostrar(card.id)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  {card.mostrado ? "Ocultar Resposta" : "Ver Resposta"}
                </button>

                <Link
                  href={`/trilha/matematica/${card.slug}`}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  Reabrir Etapa <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
