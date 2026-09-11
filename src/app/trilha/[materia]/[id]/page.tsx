"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Play,
  FileText,
  Brain,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Calendar,
  Award,
  ChevronRight,
  TrendingUp,
  Clock,
  Send,
  Loader2,
  BookOpen,
  Zap,
  AlertCircle,
} from "lucide-react";
import { ETAPA_FUNCOES_1_GRAU } from "@/lib/data/trilha-matematica";
import { useStudy } from "@/lib/store/study-context";
import { classificarProficiencia } from "@/lib/engine/proficiency";

export default function CicloAtivoPage({
  params,
}: {
  params: Promise<{ materia: string; id: string }>;
}) {
  const resolvedParams = use(params);
  const { materia, id } = resolvedParams;

  const {
    proficiencias,
    topicoProgresso,
    responderAtivacao,
    salvarFeynman,
    responderVerificacao,
    avancarFaseAtivo,
    concluirEtapaAtivo,
  } = useStudy();

  const etapa = ETAPA_FUNCOES_1_GRAU;
  const progresso = topicoProgresso[etapa.id] || {
    etapaId: etapa.id,
    topicoSlug: etapa.topicoSlug,
    faseAtual: "A",
    ipAtual: 540,
    questoesRespondidas: 0,
    respostasAtivacao: {},
    respostasVerificacao: {},
    acertosVerificacao: 0,
    totalVerificacao: etapa.questoesVerificacao.length,
    feynmanTexto: "",
    sm2Data: {
      repeticoes: 0,
      intervaloDias: 1,
      fatorFacilidade: 2.5,
      proximaRevisao: new Date().toISOString(),
      ultimaRevisao: new Date().toISOString(),
    },
  };

  // Estado local para controle das abas do ciclo
  const [faseAtiva, setFaseAtiva] = useState<"A" | "T" | "I" | "V" | "O">(
    progresso.faseAtual === "concluido" ? "O" : (progresso.faseAtual as any)
  );

  // Estados locais da Teoria
  const [abaTeoria, setAbaTeoria] = useState<"video" | "resumo" | "mapa">("video");

  // Estados locais do Feynman
  const [feynmanInput, setFeynmanInput] = useState(progresso.feynmanTexto || "");
  const [avaliandoFeynman, setAvaliandoFeynman] = useState(false);
  const [feynmanResultado, setFeynmanResultado] = useState<any>(
    progresso.feynmanAvaliacao || null
  );

  // Estados locais da Verificação
  const [indiceQuestaoVerificacao, setIndiceQuestaoVerificacao] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState<string | null>(null);
  const [mostrarExplicacao, setMostrarExplicacao] = useState(false);
  const [ultimoDeltaIP, setUltimoDeltaIP] = useState<number | null>(null);

  // Disparo do Confete na conclusão
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"],
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Avaliação Feynman via API Tutor
  const handleAvaliarFeynman = async () => {
    if (!feynmanInput.trim() || avaliandoFeynman) return;
    setAvaliandoFeynman(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "explain_feedback",
          topico: etapa.titulo,
          contextoEtapa: etapa.subtitulo,
          textoUsuario: feynmanInput,
        }),
      });

      const data = await res.json();
      setFeynmanResultado(data);
      salvarFeynman(etapa.id, feynmanInput, data);
    } catch (err) {
      console.error("Erro ao avaliar Feynman:", err);
    } finally {
      setAvaliandoFeynman(false);
    }
  };

  // Submeter Questão de Verificação
  const handleSubmeterQuestaoVerificacao = (letra: string) => {
    if (mostrarExplicacao) return;

    setRespostaSelecionada(letra);
    setMostrarExplicacao(true);

    const questaoAtual = etapa.questoesVerificacao[indiceQuestaoVerificacao];
    const alternativaEscolhida = questaoAtual.alternativas.find((a) => a.letra === letra);
    const ehCorreta = alternativaEscolhida?.ehCorreta || false;

    const { delta } = responderVerificacao(
      etapa.id,
      etapa.topicoSlug,
      questaoAtual.id,
      letra,
      ehCorreta,
      questaoAtual.dificuldadeCalibrada
    );

    setUltimoDeltaIP(delta);
  };

  const handleProximaQuestaoVerificacao = () => {
    setMostrarExplicacao(false);
    setRespostaSelecionada(null);
    setUltimoDeltaIP(null);

    if (indiceQuestaoVerificacao + 1 < etapa.questoesVerificacao.length) {
      setIndiceQuestaoVerificacao((prev) => prev + 1);
    } else {
      // Concluiu as questões práticas -> Avança para Organização
      concluirEtapaAtivo(etapa.id);
      setFaseAtiva("O");
      triggerConfetti();
    }
  };

  const stepsAtivo = [
    {
      id: "A",
      label: "A — Ativação",
      tempo: "3 min",
      desc: "Retrieval rápido da base",
      concluido: Object.keys(progresso.respostasAtivacao).length > 0,
    },
    {
      id: "T",
      label: "T — Teoria Nova",
      tempo: "12 min",
      desc: "Vídeo curado + Resumo visual",
      concluido: faseAtiva !== "A",
    },
    {
      id: "I",
      label: "I — Interiorização",
      tempo: "5 min",
      desc: "Explique com suas palavras",
      concluido: Boolean(feynmanResultado),
    },
    {
      id: "V",
      label: "V — Verificação",
      tempo: "15 min",
      desc: "Exercícios com TRI",
      concluido: progresso.acertosVerificacao >= 1 || faseAtiva === "O",
    },
    {
      id: "O",
      label: "O — Organização",
      tempo: "1 min",
      desc: "SM-2 agendado",
      concluido: progresso.faseAtual === "concluido",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER DA ETAPA COM BREADCRUMB */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Link href="/" className="hover:text-slate-200">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/trilha/matematica" className="hover:text-slate-200">
            Matemática
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-violet-400">Funções do 1º Grau</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {etapa.titulo}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl mt-1">
              {etapa.subtitulo}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                IP deste Tópico
              </span>
              <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                {progresso.ipAtual.toFixed(1)} pts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BARRA DE PROGRESSO DO CICLO ATIVO (5 PASSOS CIENTÍFICOS) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-2 rounded-2xl glass-panel border border-slate-800">
        {stepsAtivo.map((step) => {
          const isAtivo = faseAtiva === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setFaseAtiva(step.id as any)}
              className={`p-3 rounded-xl text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isAtivo
                  ? "bg-violet-600/20 border border-violet-500/40 shadow-sm shadow-violet-500/10"
                  : "bg-slate-900/40 hover:bg-slate-900/80 border border-transparent"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold ${
                    isAtivo ? "text-violet-300" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
                {step.concluido && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 truncate">{step.desc}</p>
              <span className="text-[9px] text-slate-400 font-medium mt-1">
                ⏱ {step.tempo}
              </span>
            </button>
          );
        })}
      </div>

      {/* CONTEÚDO PRINCIPAL DE ACORDO COM A FASE ATIVA */}

      {/* ========================================================================= */}
      {/* FASE A — ATIVAÇÃO (Retrieval Practice de Conteúdo Prévio) */}
      {/* ========================================================================= */}
      {faseAtiva === "A" && (
        <section className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                <Brain className="w-3.5 h-3.5" />
                Fase A — Ativação Cognitiva (3 min)
              </div>
              <h2 className="text-xl font-bold text-white mt-2">
                Aqueça o cérebro com o pré-requisito
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Recordar ativamente conceitos anteriores (Plano Cartesiano e Taxas) aumenta a retenção
                da matéria nova em até 50%.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {etapa.questoesAtivacao.map((q, qIndex) => {
              const respostaDada = progresso.respostasAtivacao[q.id];

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">
                      Questão {qIndex + 1} de {etapa.questoesAtivacao.length}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Dificuldade TRI: {q.dificuldadeCalibrada} pts
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                    {q.enunciado}
                  </p>

                  <div className="space-y-2.5">
                    {q.alternativas.map((alt) => {
                      const foiSelecionada = respostaDada === alt.letra;
                      const revelado = Boolean(respostaDada);

                      let corEstilo =
                        "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-violet-500/40 hover:bg-slate-900";

                      if (revelado) {
                        if (alt.ehCorreta) {
                          corEstilo = "bg-emerald-500/15 border-emerald-500/50 text-emerald-200";
                        } else if (foiSelecionada) {
                          corEstilo = "bg-rose-500/15 border-rose-500/50 text-rose-200";
                        } else {
                          corEstilo = "bg-slate-950/40 border-slate-900 text-slate-400 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={alt.letra}
                          disabled={revelado}
                          onClick={() => responderAtivacao(etapa.id, q.id, alt.letra)}
                          className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${corEstilo}`}
                        >
                          <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 text-xs font-bold text-slate-200">
                            {alt.letra}
                          </span>
                          <span className="flex-1 mt-0.5">{alt.texto}</span>
                        </button>
                      );
                    })}
                  </div>

                  {respostaDada && (
                    <div className="p-3.5 rounded-xl bg-violet-950/30 border border-violet-500/20 text-xs text-slate-300 leading-relaxed">
                      <strong className="text-violet-300 block mb-1">Explicação:</strong>
                      {
                        q.alternativas.find((a) => a.letra === respostaDada)
                          ?.explicacao
                      }
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                avancarFaseAtivo(etapa.id, "T");
                setFaseAtiva("T");
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition"
            >
              Ativação Concluída — Ir para Teoria Nova
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* FASE T — TEORIA NOVA (Vídeo Curado + Dual Coding: Resumo e Mapa) */}
      {/* ========================================================================= */}
      {faseAtiva === "T" && (
        <section className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                <Play className="w-3.5 h-3.5" />
                Fase T — Teoria Nova (Vídeo + Codificação Dual)
              </div>
              <h2 className="text-xl font-bold text-white mt-2">
                Conceito Central: Taxa de Variação & Equação da Reta
              </h2>
            </div>

            {/* Alternador de Visualização (Vídeo x Resumo Visual x Mapa Mental) */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setAbaTeoria("video")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  abaTeoria === "video"
                    ? "bg-violet-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Vídeo Curado ({etapa.videoDuracaoMin}m)
              </button>
              <button
                onClick={() => setAbaTeoria("resumo")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  abaTeoria === "resumo"
                    ? "bg-violet-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Resumo Visual
              </button>
              <button
                onClick={() => setAbaTeoria("mapa")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  abaTeoria === "mapa"
                    ? "bg-violet-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Mapa Mental
              </button>
            </div>
          </div>

          {/* Player de Vídeo Curado */}
          {abaTeoria === "video" && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${etapa.youtubeId}?rel=0&modestbranding=1`}
                  title={etapa.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Canal de Referência: <strong>{etapa.videoCanal}</strong></span>
                <span>Duração Ideal: {etapa.videoDuracaoMin} minutos (sem enrolação)</span>
              </div>
            </div>
          )}

          {/* Aba: Resumo Visual Esquematizado */}
          {abaTeoria === "resumo" && (
            <div className="space-y-5">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/40 via-slate-900 to-slate-950 border border-violet-500/30 text-center space-y-2">
                <span className="text-xs uppercase tracking-widest text-violet-400 font-bold">
                  Equação Fundamental da Reta
                </span>
                <div className="text-3xl sm:text-4xl font-black text-cyan-300 tracking-wider">
                  {etapa.resumoVisual.formulaPrincipal}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {etapa.resumoVisual.itensChave.map((item, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-white">{item.titulo}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.descricao}
                      </p>
                    </div>
                    <span className="block text-[11px] font-mono text-cyan-300 bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
                      {item.destaque}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                  <strong className="text-amber-300 block mb-0.5">Dica de Ouro ENEM:</strong>
                  {etapa.resumoVisual.dicaOuroEnem}
                </div>
              </div>
            </div>
          )}

          {/* Aba: Mapa Mental Dual Coding */}
          {abaTeoria === "mapa" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Conceito Central
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {etapa.mapaMental.conceitoCentral}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {etapa.mapaMental.nos.map((no, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3"
                  >
                    <div
                      className={`inline-block px-3 py-1 rounded-lg bg-gradient-to-r ${no.cor} text-white text-xs font-bold shadow-sm`}
                    >
                      {no.titulo}
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {no.subitens.map((sub, sIdx) => (
                        <li key={sIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          <span>{sub}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                avancarFaseAtivo(etapa.id, "I");
                setFaseAtiva("I");
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition"
            >
              Teoria Compreendida — Ir para Interiorização
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* FASE I — INTERIORIZAÇÃO (Técnica de Feynman / Avaliação por IA) */}
      {/* ========================================================================= */}
      {faseAtiva === "I" && (
        <section className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
          <div className="pb-4 border-b border-slate-800 space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Brain className="w-3.5 h-3.5" />
              Fase I — Interiorização (Técnica de Feynman)
            </div>
            <h2 className="text-xl font-bold text-white">Explique para Ensinar</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Você só domina um conteúdo quando consegue explicá-lo em linguagem simples. A IA Tutora
              avaliará sua resposta e apontará eventuais lacunas conceituais.
            </p>
          </div>

          {/* O Desafio de Explicação */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-950/30 via-slate-900 to-slate-900 border border-violet-500/30 space-y-3">
            <h3 className="text-sm font-bold text-violet-300 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              Seu Desafio de Explicação:
            </h3>
            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
              "{etapa.feynmanPrompt.pergunta}"
            </p>
            <p className="text-xs text-slate-400">
              💡 <strong>Dica da Tutora:</strong> {etapa.feynmanPrompt.dicaOrientadora}
            </p>
          </div>

          {/* Campo de Texto */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Digite sua explicação com suas próprias palavras:</span>
              <span>{feynmanInput.length} caracteres</span>
            </div>
            <textarea
              rows={5}
              value={feynmanInput}
              onChange={(e) => setFeynmanInput(e.target.value)}
              placeholder="Ex: Numa corrida de app, a bandeirada inicial é o coeficiente linear b porque você já paga só de entrar no carro..."
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-violet-500 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 leading-relaxed shadow-inner"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-400 items-center">
                <span>Conceitos-chave sugeridos:</span>
                {etapa.feynmanPrompt.conceitosObrigatorios.map((c, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <button
                onClick={handleAvaliarFeynman}
                disabled={feynmanInput.trim().length < 20 || avaliandoFeynman}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-violet-600/20"
              >
                {avaliandoFeynman ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Avaliando com IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    Avaliar com IA Tutora
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Resultado da Avaliação da IA */}
          {feynmanResultado && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-violet-500/40 space-y-4 shadow-xl animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-300">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Feedback da IA Tutora
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Análise conceitual do seu modelo mental
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Domínio Percebido:</span>
                  <span className="px-2.5 py-1 rounded-lg text-sm font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {feynmanResultado.notaDominio}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> O que você explicou muito bem:
                  </span>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    {feynmanResultado.pontosPositivos?.map((p: string, i: number) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> O que pode ser refinado:
                  </span>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    {feynmanResultado.lacunas?.map((l: string, i: number) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                🎯 <strong>Orientação Final:</strong> {feynmanResultado.dicaPedagogica}
              </p>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                avancarFaseAtivo(etapa.id, "V");
                setFaseAtiva("V");
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition"
            >
              Interiorização Concluída — Ir para Verificação Prática
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* FASE V — VERIFICAÇÃO PRÁTICA (Questões Estilo ENEM + TRI + Distratores) */}
      {/* ========================================================================= */}
      {faseAtiva === "V" && (
        <section className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
          {/* Header da Verificação */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                Fase V — Verificação Prática (Calibrada TRI)
              </div>
              <h2 className="text-xl font-bold text-white mt-2">
                Questão {indiceQuestaoVerificacao + 1} de {etapa.questoesVerificacao.length}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                Acertos:{" "}
                <strong className="text-emerald-400">{progresso.acertosVerificacao}</strong> /{" "}
                {etapa.questoesVerificacao.length}
              </span>
              <div className="w-24 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{
                    width: `${
                      ((indiceQuestaoVerificacao + (mostrarExplicacao ? 1 : 0)) /
                        etapa.questoesVerificacao.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Card da Questão Atual */}
          {(() => {
            const q = etapa.questoesVerificacao[indiceQuestaoVerificacao];
            return (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                    <span>ENEM {q.anoEnem || "Inep"}</span>
                    <span>•</span>
                    <span>{q.habilidadeInep}</span>
                    <span>•</span>
                    <span className="text-cyan-400">Dificuldade TRI: {q.dificuldadeCalibrada}</span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium whitespace-pre-line">
                    {q.enunciado}
                  </p>
                </div>

                {/* Alternativas */}
                <div className="space-y-3">
                  {q.alternativas.map((alt) => {
                    const foiSelecionada = respostaSelecionada === alt.letra;

                    let estilo =
                      "bg-slate-950/70 border-slate-800 text-slate-200 hover:border-violet-500/50 hover:bg-slate-900";

                    if (mostrarExplicacao) {
                      if (alt.ehCorreta) {
                        estilo = "bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-md";
                      } else if (foiSelecionada) {
                        estilo = "bg-rose-500/20 border-rose-500 text-rose-200";
                      } else {
                        estilo = "bg-slate-950/40 border-slate-900 text-slate-400 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={alt.letra}
                        disabled={mostrarExplicacao}
                        onClick={() => handleSubmeterQuestaoVerificacao(alt.letra)}
                        className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${estilo}`}
                      >
                        <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 font-bold text-xs text-slate-200">
                          {alt.letra}
                        </span>
                        <span className="flex-1 mt-1 leading-relaxed">{alt.texto}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explicação de Cada Alternativa (Por que a certa é certa e as erradas são erradas) */}
                {mostrarExplicacao && (
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-violet-500/30 space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {respostaSelecionada &&
                        q.alternativas.find((a) => a.letra === respostaSelecionada)?.ehCorreta ? (
                          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5" />
                            Você acertou!
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                            <XCircle className="w-5 h-5" />
                            Alternativa incorreta.
                          </div>
                        )}
                      </div>

                      {ultimoDeltaIP !== null && (
                        <div
                          className={`text-xs font-black px-3 py-1 rounded-full border ${
                            ultimoDeltaIP >= 0
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                          }`}
                        >
                          {ultimoDeltaIP >= 0 ? `+${ultimoDeltaIP}` : ultimoDeltaIP} pts no IP
                        </div>
                      )}
                    </div>

                    {/* Análise de todos os distratores */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Análise Pedagógica dos Distratores:
                      </h4>
                      <div className="space-y-2 text-xs leading-relaxed">
                        {q.alternativas.map((a) => (
                          <div
                            key={a.letra}
                            className={`p-3 rounded-lg border ${
                              a.ehCorreta
                                ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
                                : "bg-slate-950 border-slate-800 text-slate-400"
                            }`}
                          >
                            <strong>Alternativa {a.letra}:</strong> {a.explicacao}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleProximaQuestaoVerificacao}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition shadow-md"
                      >
                        {indiceQuestaoVerificacao + 1 < etapa.questoesVerificacao.length
                          ? "Próxima Questão"
                          : "Finalizar Ciclo e Organizar Revisão"}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </section>
      )}

      {/* ========================================================================= */}
      {/* FASE O — ORGANIZAÇÃO (Agendamento SM-2 & Conclusão) */}
      {/* ========================================================================= */}
      {faseAtiva === "O" && (
        <section className="p-8 rounded-3xl glass-panel-glow border border-violet-500/40 text-center space-y-6 relative overflow-hidden">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-1 shadow-lg shadow-violet-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Award className="w-8 h-8 text-cyan-300" />
            </div>
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Ciclo ATIVO Concluído com Sucesso!
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Etapa: Funções do 1º Grau
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Você completou a ativação, absorveu a teoria com codificação dual, interiorizou o
              conceito pela técnica de Feynman e validou na prática com itens reais do ENEM.
            </p>
          </div>

          {/* Resultados da Sessão */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-bold">
                Acertos no Treino
              </span>
              <div className="text-2xl font-black text-white">
                {progresso.acertosVerificacao} / {etapa.questoesVerificacao.length}
              </div>
              <p className="text-[10px] text-emerald-400 font-medium">Taxa de retenção sólida</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-bold">
                Novo IP de Matemática
              </span>
              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                {progresso.ipAtual.toFixed(1)}
              </div>
              <p className="text-[10px] text-slate-400">Subindo rumo aos 800 pts</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-bold">
                Próxima Revisão (SM-2)
              </span>
              <div className="text-base font-bold text-amber-300 flex items-center gap-1 mt-1">
                <Calendar className="w-4 h-4 text-amber-400" />
                Em 2 dias
              </div>
              <p className="text-[10px] text-slate-400">Agendado automaticamente na fila</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/trilha/matematica"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
            >
              Ver Skill Tree de Matemática
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              Ir para o Dashboard Principal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
