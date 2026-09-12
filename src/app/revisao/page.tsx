"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useStudy } from "@/lib/store/study-context";

export default function RevisaoPage() {
  const { topicoProgresso } = useStudy();

  const [cardsRevisao, setCardsRevisao] = useState([
    {
      id: "rev-01",
      area: "matemática",
      topico: "conjuntos e intervalos numéricos",
      slug: "conjuntos-intervalos",
      urgencia: "vence hoje",
      retencao: "84%",
      intervaloAtual: "6 dias",
      conceitoFlash: "qual a diferença entre intervalo fechado [a, b] e aberto (a, b)?",
      respostaFlash: "fechado [a, b] inclui as extremidades a e b (ponto preenchido). aberto (a, b) exclui as extremidades (ponto aberto).",
      mostrado: false,
    },
    {
      id: "rev-02",
      area: "matemática",
      topico: "funções do 1º grau (afim)",
      slug: "funcoes-1-grau",
      urgencia: "revisão agendada",
      retencao: "92%",
      intervaloAtual: "2 dias",
      conceitoFlash: "como encontrar a raiz de f(x) = ax + b graficamente?",
      respostaFlash: "basta igualar f(x) = 0: ax + b = 0 => x = -b/a. É exatamente onde a reta cruza o eixo horizontal X.",
      mostrado: false,
    },
  ]);

  const alternarMostrar = (id: string) => {
    setCardsRevisao((prev) =>
      prev.map((c) => (c.id === id ? { ...c, mostrado: !c.mostrado } : c))
    );
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

      {/* Lista de Flashcards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#6B665C] dark:text-[#B5B0A4]">
          <span>recuperação ativa ({cardsRevisao.length} tópicos)</span>
          <span>tempo estimado: 4 minutos</span>
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
    </div>
  );
}
