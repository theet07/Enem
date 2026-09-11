"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Timer,
  Shield,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Flame,
  Brain,
  ThumbsUp,
  Sparkles,
} from "lucide-react";
import { useStudy } from "@/lib/store/study-context";

export default function ModoFortalezaPage() {
  const { sessaoFoco, iniciarModoFortaleza, encerrarModoFortaleza, registrarDistracao } =
    useStudy();

  // Contrato de Intenção
  const [contratoPreenchido, setContratoPreenchido] = useState(false);
  const [quando, setQuando] = useState("Agora (próximos 25 minutos)");
  const [onde, setOnde] = useState("Na mesa de estudos sem o celular por perto");
  const [oQue, setOQue] = useState("Ciclo ATIVO de Funções do 1º Grau (Matemática)");

  // Timer Pomodoro
  const [duracaoMinutos, setDuracaoMinutos] = useState(25);
  const [segundosRestantes, setSegundosRestantes] = useState(25 * 60);
  const [timerAtivo, setTimerAtivo] = useState(false);
  const [blocoConcluido, setBlocoConcluido] = useState(false);

  // Fullscreen
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. SE O CONTRATO AINDA NÃO FOI CONFIRMADO */}
      {!contratoPreenchido ? (
        <section className="p-6 sm:p-8 rounded-3xl glass-panel-glow border border-violet-500/30 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              Modo Fortaleza • Intenção de Implementação (Gollwitzer)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Contrato de Foco Rápido (15 segundos)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Metas vagas como "vou estudar hoje" falham pela inércia. Definir <strong>quando</strong>,{" "}
              <strong>onde</strong> e <strong>o que exatamente</strong> quadruplica a probabilidade de
              manter a concentração ininterrupta.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                1. Quando você vai focar?
              </label>
              <input
                type="text"
                value={quando}
                onChange={(e) => setQuando(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                2. Onde será o estudo?
              </label>
              <input
                type="text"
                value={onde}
                onChange={(e) => setOnde(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                3. O que exatamente será estudado?
              </label>
              <input
                type="text"
                value={oQue}
                onChange={(e) => setOQue(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Duração do Bloco Pomodoro Adaptativo:
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
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition ${
                      duracaoMinutos === m
                        ? "bg-violet-600 text-white border-violet-500 shadow-md"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    {m} minutos {m === 25 && "(Padrão)"} {m === 15 && "(Retomada Leve)"} {m === 50 && "(Denso)"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleIniciarSessao}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2"
          >
            Assinar Contrato e Entrar na Fortaleza
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      ) : (
        /* 2. DENTRO DA FORTALEZA: TIMER + BOTÃO FUI DISTRAÍDO */
        <section className="p-8 rounded-3xl glass-panel-glow border border-violet-500/40 text-center space-y-8 relative overflow-hidden">
          {/* Header da Sessão Ativa */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Ambiente Protegido Contra Distrações</span>
            </div>

            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:bg-slate-800 transition"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" /> Sair da Tela Cheia
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" /> Tela Cheia Imersiva
                </>
              )}
            </button>
          </div>

          {/* O QUE ESTOU ESTUDANDO */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-md mx-auto">
            <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider block">
              Foco Atual
            </span>
            <p className="text-sm font-bold text-white mt-0.5">{oQue}</p>
          </div>

          {/* TIMER GIGANTE */}
          <div className="space-y-4">
            <div className="text-6xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 font-mono tracking-tight drop-shadow-lg">
              {formatado}
            </div>

            {/* Controles do Timer */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setTimerAtivo(!timerAtivo)}
                className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-violet-600/30 transition"
              >
                {timerAtivo ? (
                  <>
                    <Pause className="w-4 h-4" /> Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Continuar
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setTimerAtivo(false);
                  setSegundosRestantes(duracaoMinutos * 60);
                }}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* BOTÃO "FUI DISTRAÍDO" (SEM CULPA, COM DADO) */}
          <div className="pt-6 border-t border-slate-800/80 max-w-md mx-auto space-y-3">
            <div className="space-y-1">
              <span className="text-xs text-slate-400">
                Se desconcentrou? Não se culpe. Transforme em dado:
              </span>
            </div>

            <button
              onClick={() => registrarDistracao("Distração rápida")}
              className="w-full py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 transition flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Registrar: Fui Distraído (1 clique)
            </button>

            {sessaoFoco.distracoes.length > 0 && (
              <p className="text-[11px] text-slate-400">
                {sessaoFoco.distracoes.length} distração(ões) registrada(s) nesta sessão. O painel
                analítico usará isso para calibrar seus horários mais produtivos.
              </p>
            )}
          </div>

          {/* AVALIAÇÃO DO BLOCO APÓS TÉRMINO */}
          {blocoConcluido && (
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-4 animate-fade-in">
              <div className="flex items-center justify-center gap-2 text-emerald-300 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Bloco de {duracaoMinutos} minutos concluído!
              </div>
              <p className="text-xs text-slate-300">
                Avaliação de 1 clique: esse bloco valeu a pena para sua evolução?
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((estrela) => (
                  <button
                    key={estrela}
                    onClick={() => {
                      encerrarModoFortaleza();
                      setContratoPreenchido(false);
                      setBlocoConcluido(false);
                    }}
                    className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-xs font-bold text-white transition flex items-center justify-center"
                  >
                    {estrela}★
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
              className="text-xs text-slate-400 hover:text-slate-300 underline"
            >
              Encerrar Sessão da Fortaleza
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
