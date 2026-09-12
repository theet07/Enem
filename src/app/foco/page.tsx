"use client";

import React, { useState, useEffect } from "react";
import {
  Maximize2,
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { useStudy } from "@/lib/store/study-context";

export default function ModoFortalezaPage() {
  const { sessaoFoco, iniciarModoFortaleza, encerrarModoFortaleza, registrarDistracao } =
    useStudy();

  const [contratoPreenchido, setContratoPreenchido] = useState(false);
  const [quando, setQuando] = useState("agora (próximos 25 minutos)");
  const [onde, setOnde] = useState("na mesa de estudos sem celular por perto");
  const [oQue, setOQue] = useState("ciclo ativo de funções do 1º grau");

  const [duracaoMinutos, setDuracaoMinutos] = useState(25);
  const [segundosRestantes, setSegundosRestantes] = useState(25 * 60);
  const [timerAtivo, setTimerAtivo] = useState(false);
  const [blocoConcluido, setBlocoConcluido] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch((err) => {
        console.error(err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch((err) => {
        console.error(err);
      });
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerAtivo && segundosRestantes > 0) {
      interval = setInterval(() => {
        setSegundosRestantes((prev) => prev - 1);
      }, 1000);
    } else if (segundosRestantes === 0 && timerAtivo) {
      setTimerAtivo(false);
      setBlocoConcluido(true);
    }
    return () => clearInterval(interval);
  }, [timerAtivo, segundosRestantes]);

  const handleIniciarSessao = () => {
    iniciarModoFortaleza({ quando, onde, oQue }, duracaoMinutos);
    setSegundosRestantes(duracaoMinutos * 60);
    setContratoPreenchido(true);
    setTimerAtivo(true);
  };

  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;
  const formatado = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {!contratoPreenchido ? (
        <section className="bg-[#FFFFFF] dark:bg-[#242220] border border-[#E5E1D8] dark:border-[#38352F] rounded-xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1 border-b border-[#E5E1D8] dark:border-[#38352F] pb-4">
            <span className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
              intenção de implementação
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#232019] dark:text-[#F1EEE7] font-normal">
              modo fortaleza
            </h1>
            <p className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
              um contrato rápido de 3 perguntas para eliminar a distração antes de começar.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
                quando você vai estudar?
              </label>
              <input
                type="text"
                value={quando}
                onChange={(e) => setQuando(e.target.value)}
                className="w-full bg-[#F7F5F0] dark:bg-[#1C1A17] border border-[#E5E1D8] dark:border-[#38352F] rounded-lg px-3 py-2 text-xs text-[#232019] dark:text-[#F1EEE7] focus:outline-none focus:border-[#3D6FB4]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
                onde será o estudo?
              </label>
              <input
                type="text"
                value={onde}
                onChange={(e) => setOnde(e.target.value)}
                className="w-full bg-[#F7F5F0] dark:bg-[#1C1A17] border border-[#E5E1D8] dark:border-[#38352F] rounded-lg px-3 py-2 text-xs text-[#232019] dark:text-[#F1EEE7] focus:outline-none focus:border-[#3D6FB4]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
                o que exatamente será estudado?
              </label>
              <input
                type="text"
                value={oQue}
                onChange={(e) => setOQue(e.target.value)}
                className="w-full bg-[#F7F5F0] dark:bg-[#1C1A17] border border-[#E5E1D8] dark:border-[#38352F] rounded-lg px-3 py-2 text-xs text-[#232019] dark:text-[#F1EEE7] focus:outline-none focus:border-[#3D6FB4]"
              />
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
                duração do bloco pomodoro:
              </label>
              <div className="flex gap-2">
                {[15, 25, 50].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setDuracaoMinutos(m);
                      setSegundosRestantes(m * 60);
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs transition-colors border ${
                      duracaoMinutos === m
                        ? "bg-[#3D6FB4] text-white border-[#3D6FB4]"
                        : "bg-[#F7F5F0] dark:bg-[#1C1A17] text-[#6B665C] dark:text-[#B5B0A4] border-[#E5E1D8] dark:border-[#38352F]"
                    }`}
                  >
                    {m} min
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleIniciarSessao}
            className="w-full py-2.5 rounded-lg bg-[#3D6FB4] hover:bg-[#315891] text-[#FFFFFF] text-xs font-medium transition-colors flex items-center justify-center gap-2"
          >
            entrar no modo foco
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>
      ) : (
        <section className="bg-[#FFFFFF] dark:bg-[#242220] border border-[#E5E1D8] dark:border-[#38352F] rounded-xl p-8 text-center space-y-8">
          <div className="flex items-center justify-between text-xs text-[#6B665C] dark:text-[#B5B0A4]">
            <span>bloco de foco em andamento</span>
            <button
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1 hover:text-[#232019] dark:hover:text-[#F1EEE7]"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3 h-3" /> sair da tela cheia
                </>
              ) : (
                <>
                  <Maximize2 className="w-3 h-3" /> tela cheia
                </>
              )}
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-[#6B665C] dark:text-[#B5B0A4]">
              estudando agora:
            </span>
            <h2 className="text-sm font-medium text-[#232019] dark:text-[#F1EEE7]">
              {oQue}
            </h2>
          </div>

          {/* Timer em fonte Fraunces Serifada */}
          <div className="font-serif text-7xl sm:text-8xl text-[#232019] dark:text-[#F1EEE7] font-normal tracking-tight">
            {formatado}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setTimerAtivo(!timerAtivo)}
              className="px-5 py-2 rounded-lg bg-[#3D6FB4] hover:bg-[#315891] text-[#FFFFFF] text-xs font-medium transition-colors inline-flex items-center gap-1.5"
            >
              {timerAtivo ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> pausar
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> continuar
                </>
              )}
            </button>

            <button
              onClick={() => {
                setTimerAtivo(false);
                setSegundosRestantes(duracaoMinutos * 60);
              }}
              className="p-2 rounded-lg border border-[#E5E1D8] dark:border-[#38352F] text-[#6B665C] dark:text-[#B5B0A4] hover:text-[#232019] dark:hover:text-[#F1EEE7] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Botão de Registro de Distração sem Culpa */}
          <div className="pt-6 border-t border-[#E5E1D8] dark:border-[#38352F] space-y-2">
            <button
              onClick={() => registrarDistracao("distração registrada")}
              className="text-xs text-[#6B665C] dark:text-[#B5B0A4] hover:text-[#232019] dark:hover:text-[#F1EEE7] underline"
            >
              fui distraído (registrar sem julgamento)
            </button>

            {sessaoFoco.distracoes.length > 0 && (
              <p className="text-[11px] text-[#6B665C] dark:text-[#B5B0A4]">
                {sessaoFoco.distracoes.length} distração(ões) registrada(s) nesta sessão.
              </p>
            )}
          </div>

          {blocoConcluido && (
            <div className="p-4 bg-[#F7F5F0] dark:bg-[#1C1A17] rounded-lg space-y-2 text-xs">
              <p className="font-medium text-[#232019] dark:text-[#F1EEE7]">
                bloco concluído. esse bloco valeu a pena para você?
              </p>
              <div className="flex justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((estrela) => (
                  <button
                    key={estrela}
                    onClick={() => {
                      encerrarModoFortaleza();
                      setContratoPreenchido(false);
                      setBlocoConcluido(false);
                    }}
                    className="w-7 h-7 rounded border border-[#E5E1D8] dark:border-[#38352F] hover:border-[#3D6FB4] text-xs font-serif text-[#232019] dark:text-[#F1EEE7]"
                  >
                    {estrela}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => {
                encerrarModoFortaleza();
                setContratoPreenchido(false);
              }}
              className="text-xs text-[#6B665C] dark:text-[#B5B0A4] hover:underline"
            >
              encerrar sessão
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
