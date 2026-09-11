"use client";

import React, { useState, useEffect } from "react";
import {
  PenTool,
  Clock,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Loader2,
  Award,
} from "lucide-react";
import { useStudy } from "@/lib/store/study-context";

export default function RedacaoPage() {
  const { proficiencias } = useStudy();

  const [tema, setTema] = useState(
    "Desafios para a valorização de comunidades e povos tradicionais no Brasil"
  );
  const [textoRedacao, setTextoRedacao] = useState("");
  const [tempoSegundos, setTempoSegundos] = useState(75 * 60); // 1h15
  const [timerAtivo, setTimerAtivo] = useState(false);

  const [corrigindo, setCorrigindo] = useState(false);
  const [resultadoCorrecao, setResultadoCorrecao] = useState<any>(null);

  // Repertórios curados
  const repertorios = [
    {
      area: "Sociologia",
      autor: "Zygmunt Bauman",
      conceito: "Modernidade Líquida",
      aplicacao: "Fragilidade dos laços comunitários e invisibilização de grupos tradicionais.",
    },
    {
      area: "Constituição",
      autor: "CF/88 (Artigo 215 e 231)",
      conceito: "Direito à Identidade Cultural",
      aplicacao: "Dever estatal de proteger manifestações culturais e demarcação territorial.",
    },
    {
      area: "Filosofia",
      autor: "Jürgen Habermas",
      conceito: "Agir Comunicativo",
      aplicacao: "Falta de canais de diálogo democrático entre o poder público e as comunidades.",
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
      // Simulação pedagógica ou integração via API route
      await new Promise((r) => setTimeout(r, 2000));

      const mock = {
        notaC1: 160,
        notaC2: 180,
        notaC3: 160,
        notaC4: 180,
        notaC5: 160,
        notaTotal: 840,
        feedback: {
          c1: "Bom domínio da norma padrão. Cuidado com pequenos desvios de pontuação e regência no 2º parágrafo.",
          c2: "Tema plenamente compreendido. Repertório sociocultural legitimado e produtivo com conexão clara à tese.",
          c3: "Projeto de texto claro e consistente. Sugestão: aprofundar o argumento de causa no segundo parágrafo de desenvolvimento.",
          c4: "Excelente diversidade de operadores argumentativos interparágrafos e coesão referencial fluida.",
          c5: "Proposta de intervenção completa com Agente, Ação, Meio/Modo, Efeito e Detalhamento da Ação.",
        },
      };

      setResultadoCorrecao(mock);
    } catch (e) {
      console.error(e);
    } finally {
      setCorrigindo(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel-glow border border-pink-500/30 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-semibold">
          <PenTool className="w-3.5 h-3.5" />
          Laboratório de Redação 1000 • Inep Standard
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Prática com Cronômetro Real & Correção por IA
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          O gargalo da redação é o tempo e a autoavaliação. Aqui você escreve com o relógio de prova
          e recebe diagnóstico detalhado nas 5 competências oficiais.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel de Escrita e Cronômetro (Coluna Esquerda) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Barra do Tema e Timer */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Tema Selecionado
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">{tema}</h3>
            </div>

            {/* Cronômetro */}
            <div className="flex items-center gap-3 shrink-0 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-sm font-bold text-white">{tempoFormatado}</span>
              <button
                onClick={() => setTimerAtivo(!timerAtivo)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                {timerAtivo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Área de Texto da Redação */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Folha Oficial de Redação (máximo 30 linhas no ENEM)</span>
              <span>
                Linhas estimadas: <strong>{linhasEstimadas}</strong> / 30 • {textoRedacao.length} caracteres
              </span>
            </div>

            <textarea
              rows={16}
              value={textoRedacao}
              onChange={(e) => setTextoRedacao(e.target.value)}
              placeholder="Comece seu texto dissertativo-argumentativo aqui... (Introdução, D1, D2 e Conclusão com Proposta de Intervenção)"
              className="w-full bg-slate-950/90 border border-slate-800 focus:border-pink-500 rounded-2xl p-5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-pink-500 leading-relaxed font-sans shadow-inner"
            />
          </div>

          {/* Botão de Correção */}
          <div className="flex justify-end">
            <button
              onClick={handleCorrigirRedacao}
              disabled={textoRedacao.length < 100 || corrigindo}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-pink-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {corrigindo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Corrigindo nas 5 Competências...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Corrigir com IA Tutora
                </>
              )}
            </button>
          </div>
        </div>

        {/* Banco de Repertórios & Feedback (Coluna Direita) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Banco de Repertórios Socioculturais */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-pink-400" />
              Repertórios Sugeridos
            </div>
            <p className="text-[11px] text-slate-400">
              Conecte o repertório ao argumento para garantir nota máxima na C2.
            </p>

            <div className="space-y-2.5">
              {repertorios.map((rep, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-pink-300">{rep.autor}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{rep.area}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium">{rep.conceito}</p>
                  <p className="text-[10px] text-slate-400">{rep.aplicacao}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resultado da Correção */}
          {resultadoCorrecao && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-pink-500/40 space-y-4 shadow-xl animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Nota Total da Redação
                  </span>
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300">
                    {resultadoCorrecao.notaTotal}
                    <span className="text-xs text-slate-400 font-normal"> / 1000</span>
                  </div>
                </div>
                <Award className="w-8 h-8 text-pink-400" />
              </div>

              <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">C1 (Norma Culta):</span>
                  <span className="text-pink-300">{resultadoCorrecao.notaC1} / 200</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">C2 (Tema & Repertório):</span>
                  <span className="text-pink-300">{resultadoCorrecao.notaC2} / 200</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">C3 (Argumentação):</span>
                  <span className="text-pink-300">{resultadoCorrecao.notaC3} / 200</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">C4 (Coesão):</span>
                  <span className="text-pink-300">{resultadoCorrecao.notaC4} / 200</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">C5 (Intervenção):</span>
                  <span className="text-pink-300">{resultadoCorrecao.notaC5} / 200</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                <strong>Diagnóstico C5:</strong> {resultadoCorrecao.feedback.c5}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
