"use client";

import React, { use } from "react";
import Link from "next/link";
import {
  Lock,
  CheckCircle2,
  Play,
  TrendingUp,
  Layers,
  Activity,
  Square,
  BarChart3,
  Compass,
  ArrowRight,
} from "lucide-react";
import { TOPICOS_MATEMATICA } from "@/lib/data/trilha-matematica";
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

  const fases = [
    {
      chave: "fundacao",
      nome: "fundação (base essencial)",
      descricao: "raciocínio algébrico e funções elementares. domínio mínimo de 70% para avançar.",
      topicos: topicos.filter((t) => t.faseTemporada === "fundacao"),
    },
    {
      chave: "consolidacao",
      nome: "consolidação (maior peso no enem)",
      descricao: "tópicos de alta incidência na prova com intercalação de conteúdos.",
      topicos: topicos.filter((t) => t.faseTemporada === "consolidacao"),
    },
    {
      chave: "intensivo",
      nome: "intensivo (diferencial de pontuação)",
      descricao: "conteúdos de maior complexidade para elevar seu índice acima de 750 pontos.",
      topicos: topicos.filter((t) => t.faseTemporada === "intensivo"),
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Cabeçalho da Trilha */}
      <div className="space-y-2 border-b border-[#E5E1D8] dark:border-[#38352F] pb-6">
        <span className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
          trilha de estudo · matemática e suas tecnologias
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#232019] dark:text-[#F1EEE7] font-normal">
          matemática
        </h1>
        <div className="flex items-center gap-4 text-xs text-[#6B665C] dark:text-[#B5B0A4] pt-1">
          <span>
            índice atual:{" "}
            <strong className="font-serif text-sm font-semibold text-[#232019] dark:text-[#F1EEE7]">
              {proficiencias.matematica.toFixed(1).replace(".", ",")}
            </strong>
          </span>
          <span>·</span>
          <span>2 de 6 tópicos dominados</span>
        </div>
      </div>

      {/* Fases e Nós da Trilha */}
      <div className="space-y-8">
        {fases.map((fase) => (
          <section key={fase.chave} className="space-y-3">
            <div>
              <h2 className="text-sm font-medium text-[#232019] dark:text-[#F1EEE7]">
                {fase.nome}
              </h2>
              <p className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
                {fase.descricao}
              </p>
            </div>

            <div className="bg-[#FFFFFF] dark:bg-[#242220] border border-[#E5E1D8] dark:border-[#38352F] rounded-xl divide-y divide-[#E5E1D8] dark:divide-[#38352F] overflow-hidden">
              {fase.topicos.map((topico) => {
                const isBloqueado = topico.status === "bloqueado";
                const isDominado = topico.status === "dominado";
                const isDisponivel = topico.status === "disponivel";

                return (
                  <div
                    key={topico.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F7F5F0]/40 dark:hover:bg-[#1C1A17]/30 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
                          etapa {topico.ordem}
                        </span>

                        {isDominado && (
                          <span className="text-[11px] text-[#3D6FB4] font-medium">
                            · dominado ({topico.porcentagemDominio}%)
                          </span>
                        )}

                        {isDisponivel && (
                          <span className="text-[11px] text-[#3D6FB4] font-medium">
                            · disponível para estudo
                          </span>
                        )}

                        {isBloqueado && (
                          <span className="text-[11px] text-[#6B665C] dark:text-[#B5B0A4]">
                            · bloqueado
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-medium text-[#232019] dark:text-[#F1EEE7]">
                        {topico.nome}
                      </h3>

                      <p className="text-xs text-[#6B665C] dark:text-[#B5B0A4] line-clamp-1">
                        {topico.descricao}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end pt-2 sm:pt-0">
                      <div className="text-right">
                        <span className="text-[11px] text-[#6B665C] dark:text-[#B5B0A4] block">
                          índice
                        </span>
                        <span className="font-serif text-sm text-[#232019] dark:text-[#F1EEE7]">
                          {topico.ipEstimado}
                        </span>
                      </div>

                      {isBloqueado ? (
                        <span className="inline-flex items-center gap-1 text-xs text-[#6B665C] dark:text-[#B5B0A4] px-3 py-1.5 rounded-lg border border-[#E5E1D8] dark:border-[#38352F] bg-[#F7F5F0] dark:bg-[#1C1A17] opacity-60">
                          <Lock className="w-3 h-3" />
                          bloqueado
                        </span>
                      ) : (
                        <Link
                          href={`/trilha/matematica/${topico.slug}`}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isDisponivel
                              ? "bg-[#3D6FB4] hover:bg-[#315891] text-[#FFFFFF]"
                              : "border border-[#E5E1D8] dark:border-[#38352F] text-[#232019] dark:text-[#F1EEE7] hover:bg-[#F7F5F0] dark:hover:bg-[#1C1A17]"
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                          {isDominado ? "revisar etapa" : "iniciar etapa"}
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
