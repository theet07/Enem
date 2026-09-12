"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Play,
  Pause,
  Loader2,
} from "lucide-react";
import { useStudy } from "@/lib/store/study-context";

export default function RedacaoPage() {
  const { proficiencias } = useStudy();

  const [tema, setTema] = useState(
    "desafios para a valorização de comunidades e povos tradicionais no brasil"
  );
  const [textoRedacao, setTextoRedacao] = useState("");
  const [tempoSegundos, setTempoSegundos] = useState(75 * 60);
  const [timerAtivo, setTimerAtivo] = useState(false);

  const [corrigindo, setCorrigindo] = useState(false);
  const [resultadoCorrecao, setResultadoCorrecao] = useState<any>(null);

  const repertorios = [
    {
      area: "sociologia",
      autor: "Zygmunt Bauman",
      conceito: "modernidade líquida",
      aplicacao: "fragilidade dos laços comunitários e invisibilização de grupos tradicionais.",
    },
    {
      area: "legislação",
      autor: "CF/88 (art. 215 e 231)",
      conceito: "direito à identidade cultural",
      aplicacao: "dever estatal de proteger manifestações e garantir posse territorial.",
    },
    {
      area: "filosofia",
      autor: "Jürgen Habermas",
      conceito: "agir comunicativo",
      aplicacao: "ausência de canais de diálogo democrático entre o estado e as comunidades.",
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerAtivo && tempoSegundos > 0) {
      interval = setInterval(() => setTempoSegundos((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerAtivo, tempoSegundos]);

  const minutos = Math.floor(tempoSegundos / 60);
  const segundos = tempoSegundos % 60;
  const tempoFormatado = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
  const linhasEstimadas = Math.ceil(textoRedacao.split("\n").length + textoRedacao.length / 80);

  const handleCorrigirRedacao = async () => {
    if (!textoRedacao.trim() || corrigindo) return;
    setCorrigindo(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "corrigir_redacao",
          tema,
          textoRedacao,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResultadoCorrecao(data);
      }
    } catch (e) {
      console.error("Erro ao corrigir redação:", e);
    } finally {
      setCorrigindo(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Cabeçalho */}
      <div className="space-y-1 border-b border-[#E5E1D8] dark:border-[#38352F] pb-6">
        <span className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
          critérios oficiais inep · 5 competências
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#232019] dark:text-[#F1EEE7] font-normal">
          redação
        </h1>
        <p className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
          espaço de escrita com cronômetro de prova e diagnóstico por competência.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel de Escrita (Coluna Esquerda) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Tema e Cronômetro */}
          <div className="bg-[#FFFFFF] dark:bg-[#242220] border border-[#E5E1D8] dark:border-[#38352F] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[11px] text-[#6B665C] dark:text-[#B5B0A4]">
                tema da proposta
              </span>
              <h2 className="text-xs font-medium text-[#232019] dark:text-[#F1EEE7]">
                {tema}
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#6B665C] dark:text-[#B5B0A4] shrink-0">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-serif text-sm text-[#232019] dark:text-[#F1EEE7]">
                {tempoFormatado}
              </span>
              <button
                onClick={() => setTimerAtivo(!timerAtivo)}
                className="p-1 hover:text-[#232019] dark:hover:text-[#F1EEE7]"
              >
                {timerAtivo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>
            </div>
          </div>

          {/* Área do Texto */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-[#6B665C] dark:text-[#B5B0A4]">
              <span>texto dissertativo-argumentativo</span>
              <span>{linhasEstimadas}/30 linhas estimadas · {textoRedacao.length} caracteres</span>
            </div>

            <textarea
              rows={16}
              value={textoRedacao}
              onChange={(e) => setTextoRedacao(e.target.value)}
              placeholder="escreva sua redação aqui..."
              className="w-full bg-[#FFFFFF] dark:bg-[#242220] border border-[#E5E1D8] dark:border-[#38352F] rounded-xl p-4 text-xs text-[#232019] dark:text-[#F1EEE7] placeholder-[#6B665C] dark:placeholder-[#B5B0A4] focus:outline-none focus:border-[#3D6FB4] leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCorrigirRedacao}
              disabled={textoRedacao.length < 50 || corrigindo}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3D6FB4] hover:bg-[#315891] text-[#FFFFFF] text-xs font-medium disabled:opacity-40 transition-colors"
            >
              {corrigindo ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> corrigindo...
                </>
              ) : (
                "corrigir redação com tutor"
              )}
            </button>
          </div>
        </div>

        {/* Coluna Direita: Repertórios & Diagnóstico */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#FFFFFF] dark:bg-[#242220] border border-[#E5E1D8] dark:border-[#38352F] rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-medium text-[#232019] dark:text-[#F1EEE7]">
              repertórios sugeridos
            </h3>

            <div className="space-y-2.5 divide-y divide-[#E5E1D8] dark:divide-[#38352F]">
              {repertorios.map((rep, i) => (
                <div key={i} className={i > 0 ? "pt-2.5 space-y-0.5" : "space-y-0.5"}>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#232019] dark:text-[#F1EEE7]">
                      {rep.autor}
                    </span>
                    <span className="text-[10px] text-[#6B665C] dark:text-[#B5B0A4]">
                      {rep.area}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B665C] dark:text-[#B5B0A4]">
                    {rep.aplicacao}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {resultadoCorrecao && (
            <div className="bg-[#FFFFFF] dark:bg-[#242220] border border-[#E5E1D8] dark:border-[#38352F] rounded-xl p-4 space-y-3 text-xs">
              <div className="flex items-baseline justify-between border-b border-[#E5E1D8] dark:border-[#38352F] pb-2">
                <span className="text-[#6B665C] dark:text-[#B5B0A4]">nota atribuída</span>
                <span className="font-serif text-2xl text-[#3D6FB4]">
                  {resultadoCorrecao.notaTotal}
                  <span className="text-xs text-[#6B665C] dark:text-[#B5B0A4]"> / 1000</span>
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] text-[#6B665C] dark:text-[#B5B0A4]">
                <div className="flex justify-between">
                  <span>c1 (norma culta):</span>
                  <span className="text-[#232019] dark:text-[#F1EEE7]">{resultadoCorrecao.notaC1}</span>
                </div>
                <div className="flex justify-between">
                  <span>c2 (tema e repertório):</span>
                  <span className="text-[#232019] dark:text-[#F1EEE7]">{resultadoCorrecao.notaC2}</span>
                </div>
                <div className="flex justify-between">
                  <span>c3 (argumentação):</span>
                  <span className="text-[#232019] dark:text-[#F1EEE7]">{resultadoCorrecao.notaC3}</span>
                </div>
                <div className="flex justify-between">
                  <span>c4 (coesão):</span>
                  <span className="text-[#232019] dark:text-[#F1EEE7]">{resultadoCorrecao.notaC4}</span>
                </div>
                <div className="flex justify-between">
                  <span>c5 (intervenção):</span>
                  <span className="text-[#232019] dark:text-[#F1EEE7]">{resultadoCorrecao.notaC5}</span>
                </div>
              </div>

              <p className="pt-2 border-t border-[#E5E1D8] dark:border-[#38352F] text-[11px] text-[#6B665C] dark:text-[#B5B0A4]">
                {resultadoCorrecao.feedback.c5}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
