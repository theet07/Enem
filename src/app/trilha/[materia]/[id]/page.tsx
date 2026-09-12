"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  Play,
  FileText,
  Brain,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Loader2,
  Calendar,
} from "lucide-react";
import { ETAPA_FUNCOES_1_GRAU } from "@/lib/data/trilha-matematica";
import { useStudy } from "@/lib/store/study-context";

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
    ipAtual: 0,
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

  const [faseAtiva, setFaseAtiva] = useState<"A" | "T" | "I" | "V" | "O">(
    progresso.faseAtual === "concluido" ? "O" : (progresso.faseAtual as any)
  );

  const [abaTeoria, setAbaTeoria] = useState<"video" | "resumo" | "mapa">("video");
  const [feynmanInput, setFeynmanInput] = useState(progresso.feynmanTexto || "");
  const [avaliandoFeynman, setAvaliandoFeynman] = useState(false);
  const [feynmanResultado, setFeynmanResultado] = useState<any>(
    progresso.feynmanAvaliacao || null
  );

  const [indiceQuestaoVerificacao, setIndiceQuestaoVerificacao] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState<string | null>(null);
  const [mostrarExplicacao, setMostrarExplicacao] = useState(false);
  const [ultimoDeltaIP, setUltimoDeltaIP] = useState<number | null>(null);

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
      concluirEtapaAtivo(etapa.id);
      setFaseAtiva("O");
    }
  };

  const stepsAtivo = [
    { id: "A", label: "ativação", tempo: "3 min" },
    { id: "T", label: "teoria nova", tempo: "12 min" },
    { id: "I", label: "interiorização", tempo: "5 min" },
    { id: "V", label: "verificação", tempo: "15 min" },
    { id: "O", label: "organização", tempo: "1 min" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Navegação e Cabeçalho */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-[#6B665C] dark:text-[#B5B0A4]">
          <Link href="/" className="hover:text-[#232019] dark:hover:text-[#F1EEE7]">
            início
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/trilha/matematica" className="hover:text-[#232019] dark:hover:text-[#F1EEE7]">
            matemática
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span>funções do 1º grau</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-1">
          <h1 className="font-serif text-2xl sm:text-3xl text-[#232019] dark:text-[#F1EEE7] font-normal">
            {etapa.titulo}
          </h1>
          <span className="text-xs text-[#6B665C] dark:text-[#B5B0A4] shrink-0">
            índice da etapa:{" "}
            <strong className="font-serif text-sm text-[#232019] dark:text-[#F1EEE7]">
              {progresso.ipAtual.toFixed(1).replace(".", ",")}
            </strong>
          </span>
        </div>
      </div>

      {/* Barra de Fases do Ciclo Ativo */}
      <div className="flex items-center justify-between border-b border-[#E5E1D8] dark:border-[#38352F] overflow-x-auto gap-4">
        {stepsAtivo.map((step) => {
          const isAtivo = faseAtiva === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setFaseAtiva(step.id as any)}
              className={`pb-3 text-xs transition-colors relative whitespace-nowrap ${
                isAtivo
                  ? "text-[#3D6FB4] font-semibold"
                  : "text-[#6B665C] dark:text-[#B5B0A4] hover:text-[#232019] dark:hover:text-[#F1EEE7]"
              }`}
            >
              <span>{step.label}</span>
              <span className="text-[10px] opacity-60 ml-1">({step.tempo})</span>

              {isAtivo && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3D6FB4]" />
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* FASE A — ATIVAÇÃO */}
      {/* ========================================================================= */}
      {faseAtiva === "A" && (
        <section className="bg-[#FFFFFF] dark:bg-[#242220] border border-[#E5E1D8] dark:border-[#38352F] rounded-xl p-6 space-y-6">
          <div className="space-y-1">
            <span className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
              fase a · ativação cognitiva (3 min)
            </span>
            <h2 className="text-base font-medium text-[#232019] dark:text-[#F1EEE7]">
              recuperação rápida de conceitos pré-requisito
            </h2>
            <p className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
              responder a estas questões antes de ver a matéria nova fixa melhor o aprendizado.
            </p>
          </div>

          <div className="space-y-6 divide-y divide-[#E5E1D8] dark:divide-[#38352F]">
            {etapa.questoesAtivacao.map((q, qIndex) => {
              const respostaDada = progresso.respostasAtivacao[q.id];

              return (
                <div key={q.id} className={qIndex > 0 ? "pt-6 space-y-3" : "space-y-3"}>
                  <p className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
                    questão {qIndex + 1} de {etapa.questoesAtivacao.length}
                  </p>

                  <p className="text-sm font-medium text-[#232019] dark:text-[#F1EEE7] leading-relaxed">
                    {q.enunciado}
                  </p>

                  <div className="space-y-2">
                    {q.alternativas.map((alt) => {
                      const foiSelecionada = respostaDada === alt.letra;
                      const revelado = Boolean(respostaDada);

                      let bordaEstilo = "border-[#E5E1D8] dark:border-[#38352F]";
                      let textoEstilo = "text-[#232019] dark:text-[#F1EEE7]";

                      if (revelado) {
                        if (alt.ehCorreta) {
                          bordaEstilo = "border-[#3D6FB4] bg-[#3D6FB4]/5";
                        } else if (foiSelecionada) {
                          bordaEstilo = "border-red-400 dark:border-red-500";
                        } else {
                          textoEstilo = "text-[#6B665C] dark:text-[#B5B0A4] opacity-50";
                        }
                      }

                      return (
                        <button
                          key={alt.letra}
                          disabled={revelado}
                          onClick={() => responderAtivacao(etapa.id, q.id, alt.letra)}
                          className={`w-full p-3 rounded-lg border text-left text-xs transition-colors flex items-start gap-2.5 ${bordaEstilo} ${textoEstilo}`}
                        >
                          <span className="font-semibold text-xs text-[#6B665C] dark:text-[#B5B0A4]">
                            {alt.letra})
                          </span>
                          <span className="flex-1 leading-relaxed">{alt.texto}</span>
                        </button>
                      );
                    })}
                  </div>

                  {respostaDada && (
                    <p className="text-xs text-[#6B665C] dark:text-[#B5B0A4] bg-[#F7F5F0] dark:bg-[#1C1A17] p-3 rounded-lg leading-relaxed">
                      <strong>explicação:</strong>{" "}
                      {q.alternativas.find((a) => a.letra === respostaDada)?.explicacao}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                avancarFaseAtivo(etapa.id, "T");
                setFaseAtiva("T");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3D6FB4] hover:bg-[#315891] text-[#FFFFFF] text-xs font-medium transition-colors"
            >
              ir para teoria nova
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* FASE T — TEORIA NOVA */}
      {/* ========================================================================= */}
      {faseAtiva === "T" && (
        <section className="bg-[#FFFFFF] dark:bg-[#242220] border border-[#E5E1D8] dark:border-[#38352F] rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E1D8] dark:border-[#38352F]">
            <div>
              <span className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
                fase t · teoria nova ({etapa.videoDuracaoMin} min)
              </span>
              <h2 className="text-base font-medium text-[#232019] dark:text-[#F1EEE7]">
                taxa de variação e equação da reta
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setAbaTeoria("video")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  abaTeoria === "video"
                    ? "bg-[#3D6FB4] text-white"
                    : "text-[#6B665C] dark:text-[#B5B0A4] hover:text-[#232019]"
                }`}
              >
                vídeo
              </button>
              <button
                onClick={() => setAbaTeoria("resumo")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  abaTeoria === "resumo"
                    ? "bg-[#3D6FB4] text-white"
                    : "text-[#6B665C] dark:text-[#B5B0A4] hover:text-[#232019]"
                }`}
              >
                resumo
              </button>
              <button
                onClick={() => setAbaTeoria("mapa")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  abaTeoria === "mapa"
                    ? "bg-[#3D6FB4] text-white"
                    : "text-[#6B665C] dark:text-[#B5B0A4] hover:text-[#232019]"
                }`}
              >
                mapa conceitual
              </button>
            </div>
          </div>

          {abaTeoria === "video" && (
            <div className="space-y-2">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-[#E5E1D8] dark:border-[#38352F] bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${etapa.youtubeId}?rel=0`}
                  title={etapa.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="text-[11px] text-[#6B665C] dark:text-[#B5B0A4]">
                fonte: {etapa.videoCanal} · duração: {etapa.videoDuracaoMin} minutos
              </p>
            </div>
          )}

          {abaTeoria === "resumo" && (
            <div className="space-y-4 text-xs text-[#232019] dark:text-[#F1EEE7]">
              <div className="p-4 bg-[#F7F5F0] dark:bg-[#1C1A17] rounded-lg text-center">
                <span className="font-serif text-2xl font-normal block text-[#232019] dark:text-[#F1EEE7]">
                  {etapa.resumoVisual.formulaPrincipal}
                </span>
                <span className="text-[11px] text-[#6B665C] dark:text-[#B5B0A4]">
                  lei de formação da função afim
                </span>
              </div>

              <div className="space-y-3 divide-y divide-[#E5E1D8] dark:divide-[#38352F]">
                {etapa.resumoVisual.itensChave.map((item, i) => (
                  <div key={i} className={i > 0 ? "pt-3 space-y-1" : "space-y-1"}>
                    <h4 className="font-medium text-xs text-[#232019] dark:text-[#F1EEE7]">
                      {item.titulo}
                    </h4>
                    <p className="text-[#6B665C] dark:text-[#B5B0A4] leading-relaxed">
                      {item.descricao}
                    </p>
                  </div>
                ))}
              </div>

              <p className="p-3 bg-[#F7F5F0] dark:bg-[#1C1A17] rounded-lg text-[#6B665C] dark:text-[#B5B0A4] leading-relaxed">
                <strong>dica enem:</strong> {etapa.resumoVisual.dicaOuroEnem}
              </p>
            </div>
          )}

          {abaTeoria === "mapa" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {etapa.mapaMental.nos.map((no, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg border border-[#E5E1D8] dark:border-[#38352F] space-y-2 bg-[#F7F5F0]/30 dark:bg-[#1C1A17]/30"
                  >
                    <h4 className="text-xs font-medium text-[#232019] dark:text-[#F1EEE7]">
                      {no.titulo}
                    </h4>
                    <ul className="space-y-1 text-[11px] text-[#6B665C] dark:text-[#B5B0A4]">
                      {no.subitens.map((sub, sIdx) => (
                        <li key={sIdx}>· {sub}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                avancarFaseAtivo(etapa.id, "I");
                setFaseAtiva("I");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3D6FB4] hover:bg-[#315891] text-[#FFFFFF] text-xs font-medium transition-colors"
            >
              ir para interiorização
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* FASE I — INTERIORIZAÇÃO */}
      {/* ========================================================================= */}
      {faseAtiva === "I" && (
        <section className="bg-[#FFFFFF] dark:bg-[#242220] border border-[#E5E1D8] dark:border-[#38352F] rounded-xl p-6 space-y-5">
          <div className="space-y-1">
            <span className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
              fase i · interiorização (técnica de feynman)
            </span>
            <h2 className="text-base font-medium text-[#232019] dark:text-[#F1EEE7]">
              explique com suas palavras
            </h2>
            <p className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
              articular o conceito em linguagem simples expõe o que você realmente entendeu.
            </p>
          </div>

          <div className="p-4 bg-[#F7F5F0] dark:bg-[#1C1A17] rounded-lg space-y-1.5">
            <p className="text-xs font-medium text-[#232019] dark:text-[#F1EEE7] leading-relaxed">
              "{etapa.feynmanPrompt.pergunta}"
            </p>
            <p className="text-[11px] text-[#6B665C] dark:text-[#B5B0A4]">
              dica: {etapa.feynmanPrompt.dicaOrientadora}
            </p>
          </div>

          <div className="space-y-2">
            <textarea
              rows={5}
              value={feynmanInput}
              onChange={(e) => setFeynmanInput(e.target.value)}
              placeholder="digite sua explicação aqui..."
              className="w-full bg-[#F7F5F0] dark:bg-[#1C1A17] border border-[#E5E1D8] dark:border-[#38352F] rounded-lg p-3 text-xs text-[#232019] dark:text-[#F1EEE7] placeholder-[#6B665C] dark:placeholder-[#B5B0A4] focus:outline-none focus:border-[#3D6FB4] leading-relaxed"
            />

            <div className="flex justify-end">
              <button
                onClick={handleAvaliarFeynman}
                disabled={feynmanInput.trim().length < 20 || avaliandoFeynman}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3D6FB4] hover:bg-[#315891] text-[#FFFFFF] text-xs font-medium disabled:opacity-40 transition-colors"
              >
                {avaliandoFeynman ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    avaliando...
                  </>
                ) : (
                  "avaliar com tutor"
                )}
              </button>
            </div>
          </div>

          {feynmanResultado && (
            <div className="p-4 bg-[#F7F5F0] dark:bg-[#1C1A17] rounded-lg border border-[#E5E1D8] dark:border-[#38352F] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#232019] dark:text-[#F1EEE7]">
                  diagnóstico do tutor
                </span>
                <span className="font-serif text-sm font-semibold text-[#3D6FB4]">
                  {feynmanResultado.notaDominio}% de domínio
                </span>
              </div>

              <div className="space-y-2 text-[#6B665C] dark:text-[#B5B0A4] text-xs">
                {feynmanResultado.pontosPositivos?.map((p: string, i: number) => (
                  <p key={i}>· {p}</p>
                ))}
                {feynmanResultado.lacunas?.map((l: string, i: number) => (
                  <p key={i}>· ponto de atenção: {l}</p>
                ))}
              </div>

              <p className="pt-2 border-t border-[#E5E1D8] dark:border-[#38352F] text-[11px] text-[#6B665C] dark:text-[#B5B0A4]">
                {feynmanResultado.dicaPedagogica}
              </p>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                avancarFaseAtivo(etapa.id, "V");
                setFaseAtiva("V");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3D6FB4] hover:bg-[#315891] text-[#FFFFFF] text-xs font-medium transition-colors"
            >
              ir para verificação prática
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* FASE V — VERIFICAÇÃO PRÁTICA */}
      {/* ========================================================================= */}
      {faseAtiva === "V" && (
        <section className="bg-[#FFFFFF] dark:bg-[#242220] border border-[#E5E1D8] dark:border-[#38352F] rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8] dark:border-[#38352F]">
            <div>
              <span className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
                fase v · verificação prática
              </span>
              <h2 className="text-sm font-medium text-[#232019] dark:text-[#F1EEE7]">
                questão {indiceQuestaoVerificacao + 1} de {etapa.questoesVerificacao.length}
              </h2>
            </div>

            <span className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
              acertos: {progresso.acertosVerificacao} / {etapa.questoesVerificacao.length}
            </span>
          </div>

          {(() => {
            const q = etapa.questoesVerificacao[indiceQuestaoVerificacao];
            return (
              <div className="space-y-4">
                <p className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
                  enem {q.anoEnem || "inep"} · {q.habilidadeInep} · dificuldade: {q.dificuldadeCalibrada} pts
                </p>

                <p className="text-sm text-[#232019] dark:text-[#F1EEE7] font-medium leading-relaxed whitespace-pre-line">
                  {q.enunciado}
                </p>

                <div className="space-y-2">
                  {q.alternativas.map((alt) => {
                    const foiSelecionada = respostaSelecionada === alt.letra;

                    let bordaEstilo = "border-[#E5E1D8] dark:border-[#38352F]";
                    let textoEstilo = "text-[#232019] dark:text-[#F1EEE7]";

                    if (mostrarExplicacao) {
                      if (alt.ehCorreta) {
                        bordaEstilo = "border-[#3D6FB4] bg-[#3D6FB4]/5";
                      } else if (foiSelecionada) {
                        bordaEstilo = "border-red-400 dark:border-red-500";
                      } else {
                        textoEstilo = "text-[#6B665C] dark:text-[#B5B0A4] opacity-50";
                      }
                    }

                    return (
                      <button
                        key={alt.letra}
                        disabled={mostrarExplicacao}
                        onClick={() => handleSubmeterQuestaoVerificacao(alt.letra)}
                        className={`w-full p-3 rounded-lg border text-left text-xs transition-colors flex items-start gap-2.5 ${bordaEstilo} ${textoEstilo}`}
                      >
                        <span className="font-semibold text-xs text-[#6B665C] dark:text-[#B5B0A4]">
                          {alt.letra})
                        </span>
                        <span className="flex-1 leading-relaxed">{alt.texto}</span>
                      </button>
                    );
                  })}
                </div>

                {mostrarExplicacao && (
                  <div className="p-4 bg-[#F7F5F0] dark:bg-[#1C1A17] rounded-lg space-y-3 text-xs border border-[#E5E1D8] dark:border-[#38352F]">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#232019] dark:text-[#F1EEE7]">
                        análise pedagógica dos distratores
                      </span>

                      {ultimoDeltaIP !== null && (
                        <span className="font-serif text-xs text-[#3D6FB4] font-semibold">
                          {ultimoDeltaIP >= 0 ? `+${ultimoDeltaIP}` : ultimoDeltaIP} no índice
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 text-[11px] text-[#6B665C] dark:text-[#B5B0A4] leading-relaxed">
                      {q.alternativas.map((a) => (
                        <p key={a.letra}>
                          <strong className="text-[#232019] dark:text-[#F1EEE7]">
                            alternativa {a.letra}:
                          </strong>{" "}
                          {a.explicacao}
                        </p>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleProximaQuestaoVerificacao}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3D6FB4] hover:bg-[#315891] text-[#FFFFFF] text-xs font-medium transition-colors"
                      >
                        {indiceQuestaoVerificacao + 1 < etapa.questoesVerificacao.length
                          ? "próxima questão"
                          : "organizar revisão"}
                        <ArrowRight className="w-3.5 h-3.5" />
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
      {/* FASE O — ORGANIZAÇÃO */}
      {/* ========================================================================= */}
      {faseAtiva === "O" && (
        <section className="bg-[#FFFFFF] dark:bg-[#242220] border border-[#E5E1D8] dark:border-[#38352F] rounded-xl p-8 space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
              fase o · organização
            </span>
            <h2 className="font-serif text-2xl text-[#232019] dark:text-[#F1EEE7] font-normal">
              ciclo ativo concluído
            </h2>
            <p className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
              a etapa foi concluída e agendada na repetição espaçada.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left">
            <div className="p-3 bg-[#F7F5F0] dark:bg-[#1C1A17] rounded-lg border border-[#E5E1D8] dark:border-[#38352F]">
              <span className="text-[11px] text-[#6B665C] dark:text-[#B5B0A4] block">
                acertos no treino
              </span>
              <span className="font-serif text-lg text-[#232019] dark:text-[#F1EEE7]">
                {progresso.acertosVerificacao} / {etapa.questoesVerificacao.length}
              </span>
            </div>

            <div className="p-3 bg-[#F7F5F0] dark:bg-[#1C1A17] rounded-lg border border-[#E5E1D8] dark:border-[#38352F]">
              <span className="text-[11px] text-[#6B665C] dark:text-[#B5B0A4] block">
                novo índice
              </span>
              <span className="font-serif text-lg text-[#3D6FB4]">
                {progresso.ipAtual.toFixed(1).replace(".", ",")}
              </span>
            </div>

            <div className="p-3 bg-[#F7F5F0] dark:bg-[#1C1A17] rounded-lg border border-[#E5E1D8] dark:border-[#38352F]">
              <span className="text-[11px] text-[#6B665C] dark:text-[#B5B0A4] block">
                próxima revisão
              </span>
              <span className="text-xs font-medium text-[#232019] dark:text-[#F1EEE7]">
                em {progresso.sm2Data?.intervaloDias || 1} dia(s) (sm-2)
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <Link
              href="/trilha/matematica"
              className="px-4 py-2 rounded-lg border border-[#E5E1D8] dark:border-[#38352F] text-xs font-medium text-[#232019] dark:text-[#F1EEE7] hover:bg-[#F7F5F0] dark:hover:bg-[#1C1A17] transition-colors"
            >
              ver trilha de matemática
            </Link>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-[#3D6FB4] hover:bg-[#315891] text-[#FFFFFF] text-xs font-medium transition-colors"
            >
              voltar ao início
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
