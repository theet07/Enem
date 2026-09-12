"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { useStudy } from "@/lib/store/study-context";

const FLASHCARDS_TOPICOS: Record<
  string,
  {
    area: string;
    topico: string;
    conceitoFlash: string;
    respostaFlash: string;
  }
> = {
  "funcoes-1-grau": {
    area: "matemática",
    topico: "funções do 1º grau (afim)",
    conceitoFlash: "como encontrar a raiz de f(x) = ax + b graficamente?",
    respostaFlash: "basta igualar f(x) = 0: ax + b = 0 => x = -b/a. É exatamente onde a reta cruza o eixo horizontal X.",
  },
  "conjuntos-intervalos": {
    area: "matemática",
    topico: "conjuntos e intervalos numéricos",
    conceitoFlash: "qual a diferença entre intervalo fechado [a, b] e aberto (a, b)?",
    respostaFlash: "fechado [a, b] inclui as extremidades a e b (ponto preenchido). aberto (a, b) exclui as extremidades (ponto aberto).",
  },
};

export default function RevisaoPage() {
  const { topicoProgresso } = useStudy();
  const [mostrados, setMostrados] = useState<Record<string, boolean>>({});

  // Fila real de repetição espaçada alimentada apenas por etapas concluídas
  const itensConcluidos = Object.values(topicoProgresso).filter(
    (item) => item.faseAtual === "concluido" || (item.sm2Data && item.sm2Data.repeticoes > 0)
  );

  const cardsRevisao = itensConcluidos.map((item) => {
    const flash = FLASHCARDS_TOPICOS[item.topicoSlug] || {
      area: "matemática",
      topico: item.topicoSlug,
      conceitoFlash: "qual o conceito fundamental desta etapa?",
      respostaFlash: "revise as definições e fórmulas centrais aprendidas no ciclo ativo.",
    };

    const diasIntervalo = item.sm2Data?.intervaloDias || 1;
    const proxRevisao = item.sm2Data?.proximaRevisao
      ? new Date(item.sm2Data.proximaRevisao)
      : new Date();
    const hoje = new Date();
    const venceHoje = proxRevisao <= hoje;

    return {
      id: item.etapaId,
      slug: item.topicoSlug,
      ...flash,
      urgencia: venceHoje ? "vence hoje" : `revisão em ${Math.max(1, Math.round(diasIntervalo))} dia(s)`,
      intervaloAtual: `${diasIntervalo} dia(s)`,
      retencao: `${Math.min(98, Math.max(70, 100 - (item.sm2Data?.repeticoes || 0) * 3))}%`,
      mostrado: !!mostrados[item.etapaId],
    };
  });

  const alternarMostrar = (id: string) => {
    setMostrados((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Cabeçalho */}
      <div className="space-y-1 border-b border-[#E5E1D8] dark:border-[#38352F] pb-6">
        <span className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
          repetição espaçada · algoritmo sm-2
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#232019] dark:text-[#F1EEE7] font-normal">
          fila de revisão
        </h1>
        <p className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
          revisões programadas no momento exato antes da perda de retenção da memória.
        </p>
      </div>

      {/* Conteúdo: Lista de Flashcards ou Estado Vazio */}
      {cardsRevisao.length === 0 ? (
        <div className="bg-[#FFFFFF] dark:bg-[#242220] border border-[#E5E1D8] dark:border-[#38352F] rounded-xl p-8 text-center space-y-4">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#F7F5F0] dark:bg-[#1C1A17] border border-[#E5E1D8] dark:border-[#38352F] flex items-center justify-center text-[#6B665C] dark:text-[#B5B0A4]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h2 className="text-sm font-medium text-[#232019] dark:text-[#F1EEE7]">
              sua fila de revisão está vazia
            </h2>
            <p className="text-xs text-[#6B665C] dark:text-[#B5B0A4] leading-relaxed">
              quando você concluir o ciclo ativo de uma etapa na trilha, o algoritmo sm-2 agendará automaticamente os momentos ideais para revisão antes que você esqueça o conteúdo.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/trilha/matematica"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3D6FB4] hover:bg-[#315891] text-[#FFFFFF] text-xs font-medium transition-colors"
            >
              iniciar primeira etapa na trilha
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#6B665C] dark:text-[#B5B0A4]">
            <span>recuperação ativa ({cardsRevisao.length} {cardsRevisao.length === 1 ? "tópico" : "tópicos"})</span>
            <span>tempo estimado: {cardsRevisao.length * 2} minutos</span>
          </div>

          <div className="space-y-3">
            {cardsRevisao.map((card) => (
              <div
                key={card.id}
                className="bg-[#FFFFFF] dark:bg-[#242220] border border-[#E5E1D8] dark:border-[#38352F] rounded-xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-[#6B665C] dark:text-[#B5B0A4]">
                  <span>{card.area}</span>
                  <span>{card.urgencia}</span>
                </div>

                <h2 className="text-sm font-medium text-[#232019] dark:text-[#F1EEE7]">
                  {card.topico}
                </h2>

                <p className="text-xs text-[#232019] dark:text-[#F1EEE7] bg-[#F7F5F0] dark:bg-[#1C1A17] p-3 rounded-lg leading-relaxed">
                  {card.conceitoFlash}
                </p>

                {card.mostrado && (
                  <p className="text-xs text-[#6B665C] dark:text-[#B5B0A4] p-3 rounded-lg border border-[#E5E1D8] dark:border-[#38352F] leading-relaxed">
                    <strong>gabarito mental:</strong> {card.respostaFlash}
                  </p>
                )}

                <div className="pt-2 border-t border-[#E5E1D8] dark:border-[#38352F] flex items-center justify-between">
                  <button
                    onClick={() => alternarMostrar(card.id)}
                    className="px-3 py-1.5 rounded-lg border border-[#E5E1D8] dark:border-[#38352F] text-xs text-[#232019] dark:text-[#F1EEE7] hover:bg-[#F7F5F0] dark:hover:bg-[#1C1A17] transition-colors"
                  >
                    {card.mostrado ? "ocultar resposta" : "ver resposta"}
                  </button>

                  <Link
                    href={`/trilha/matematica/${card.slug}`}
                    className="inline-flex items-center gap-1 text-xs text-[#3D6FB4] hover:underline"
                  >
                    abrir etapa <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
