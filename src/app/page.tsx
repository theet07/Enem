"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Atom,
  Globe,
  BookOpen,
  PenTool,
} from "lucide-react";
import { useStudy } from "@/lib/store/study-context";

export default function DashboardPage() {
  const { profile, proficiencias, notaEstimadaEnem, gapParaCorte, topicoProgresso } = useStudy();

  const materias = [
    {
      id: "matematica",
      nome: "Matemática e suas tecnologias",
      ip: proficiencias.matematica,
      icon: TrendingUp,
      link: "/trilha/matematica",
    },
    {
      id: "natureza",
      nome: "Ciências da natureza e suas tecnologias",
      ip: proficiencias.natureza,
      icon: Atom,
      link: "#",
    },
    {
      id: "humanas",
      nome: "Ciências humanas e suas tecnologias",
      ip: proficiencias.humanas,
      icon: Globe,
      link: "#",
    },
    {
      id: "linguagens",
      nome: "Linguagens, códigos e suas tecnologias",
      ip: proficiencias.linguagens,
      icon: BookOpen,
      link: "#",
    },
    {
      id: "redacao",
      nome: "Redação dissertativa-argumentativa",
      ip: proficiencias.redacao,
      icon: PenTool,
      link: "/redacao",
    },
  ];

  // Cálculo da porcentagem da barra em relação a 1000 pontos
  const progressoPercent = Math.min(100, Math.max(0, (notaEstimadaEnem / 1000) * 100));
  const cortePercent = Math.min(100, Math.max(0, (profile.notaCorteAlvo / 1000) * 100));

  const topicosEmRevisao = Object.values(topicoProgresso).filter(
    (t) => t.faseAtual === "concluido" || (t.sm2Data && t.sm2Data.repeticoes > 0)
  ).length;

  const revisaoTexto =
    topicosEmRevisao === 0
      ? "nenhum tópico na fila de revisão"
      : topicosEmRevisao === 1
      ? "1 tópico na fila de revisão"
      : `${topicosEmRevisao} tópicos na fila de revisão`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* 1. TOPO: NOTA ESTIMADA, FRASE CURTA E BARRA FINA COM MARCADORES */}
      <section className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs text-[#6B665C] dark:text-[#B5B0A4] font-medium">
            nota estimada no enem
          </span>
          <div className="font-serif text-6xl sm:text-7xl font-normal tracking-tight text-[#232019] dark:text-[#F1EEE7]">
            {notaEstimadaEnem.toFixed(1).replace(".", ",")}
          </div>
        </div>

        {notaEstimadaEnem === 0 ? (
          <p className="text-sm text-[#6B665C] dark:text-[#B5B0A4] leading-relaxed">
            complete sua primeira etapa de estudo para calibrar sua nota estimada · meta:{" "}
            <strong className="font-medium text-[#232019] dark:text-[#F1EEE7]">
              {profile.cursoAlvo}
            </strong>{" "}
            ({profile.notaCorteAlvo.toFixed(1).replace(".", ",")} na {profile.universidadeAlvo})
          </p>
        ) : (
          <p className="text-sm text-[#6B665C] dark:text-[#B5B0A4] leading-relaxed">
            faltam {gapParaCorte.toFixed(1).replace(".", ",")} pontos para a meta de{" "}
            <strong className="font-medium text-[#232019] dark:text-[#F1EEE7]">
              {profile.cursoAlvo}
            </strong>{" "}
            ({profile.notaCorteAlvo.toFixed(1).replace(".", ",")} na {profile.universidadeAlvo})
          </p>
        )}

        {/* Barra de progresso fina única em #3D6FB4 com marcadores discretos */}
        <div className="pt-2 space-y-2">
          <div className="relative w-full h-1.5 bg-[#E5E1D8] dark:bg-[#38352F] rounded-full overflow-visible">
            {/* Preenchimento sólido em #3D6FB4 sem gradiente */}
            <div
              className="h-full bg-[#3D6FB4] rounded-full transition-all duration-500"
              style={{ width: `${progressoPercent}%` }}
            />

            {/* Marcador da Média Nacional (500 pts = 50%) */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#6B665C] dark:bg-[#B5B0A4] opacity-50"
              style={{ left: "50%" }}
            />

            {/* Marcador da Meta */}
            <div
              className="absolute -top-1 -bottom-1 w-0.5 bg-[#232019] dark:bg-[#F1EEE7]"
              style={{ left: `${cortePercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-[#6B665C] dark:text-[#B5B0A4]">
            <span>0</span>
            <span style={{ marginLeft: "25%" }}>média nacional (500)</span>
            <span>meta ({profile.notaCorteAlvo.toFixed(0)})</span>
            <span>1000</span>
          </div>
        </div>
      </section>

      {/* 2. FAIXA EM DESTAQUE COM A RECOMENDAÇÃO DO DIA */}
      <section className="bg-[#FFFFFF] dark:bg-[#242220] border border-[#E5E1D8] dark:border-[#38352F] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] text-[#6B665C] dark:text-[#B5B0A4] block">
            o que estudar agora
          </span>
          <h2 className="text-base font-medium text-[#232019] dark:text-[#F1EEE7]">
            Matemática: Funções do 1º grau (afim)
          </h2>
          <p className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
            ciclo ativo completo · 35 minutos
          </p>
        </div>

        <Link
          href="/trilha/matematica/funcoes-1-grau"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#3D6FB4] hover:bg-[#315891] text-[#FFFFFF] text-xs font-medium transition-colors shrink-0"
        >
          começar agora
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      {/* 3. AS 5 COMPETÊNCIAS DO ENEM EM FORMATO DE LISTA (LINHAS FINAS SEPARADAS POR 1PX) */}
      <section className="space-y-3">
        <h3 className="text-xs font-medium text-[#6B665C] dark:text-[#B5B0A4]">
          competências do enem
        </h3>

        <div className="bg-[#FFFFFF] dark:bg-[#242220] border border-[#E5E1D8] dark:border-[#38352F] rounded-xl overflow-hidden divide-y divide-[#E5E1D8] dark:divide-[#38352F]">
          {materias.map((materia) => {
            const Icon = materia.icon;
            const pct = Math.min(100, Math.max(0, (materia.ip / 1000) * 100));

            return (
              <div
                key={materia.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-[#F7F5F0]/50 dark:hover:bg-[#1C1A17]/40 transition-colors"
              >
                {/* Ícone e Nome */}
                <div className="flex items-center gap-3 min-w-[220px]">
                  <Icon className="w-4 h-4 text-[#6B665C] dark:text-[#B5B0A4] shrink-0" />
                  <span className="text-sm font-medium text-[#232019] dark:text-[#F1EEE7]">
                    {materia.nome}
                  </span>
                </div>

                {/* Barrinha de progresso fina em #3D6FB4 */}
                <div className="hidden sm:block flex-1 max-w-xs mx-4">
                  <div className="w-full h-1 bg-[#E5E1D8] dark:bg-[#38352F] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#3D6FB4] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Número do índice em Fraunces e Link */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-serif text-base text-[#232019] dark:text-[#F1EEE7]">
                    {materia.ip.toFixed(1).replace(".", ",")}
                  </span>

                  {materia.link !== "#" ? (
                    <Link
                      href={materia.link}
                      className="text-xs text-[#3D6FB4] hover:underline"
                    >
                      abrir
                    </Link>
                  ) : (
                    <span className="text-xs text-[#6B665C] dark:text-[#B5B0A4] opacity-50">
                      em breve
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. RODAPÉ DISCRETO */}
      <footer className="pt-4 border-t border-[#E5E1D8] dark:border-[#38352F] text-center">
        <p className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
          {profile.streakDias} {profile.streakDias === 1 ? "dia" : "dias"} de estudo seguidos · {revisaoTexto}
        </p>
      </footer>
    </div>
  );
}
