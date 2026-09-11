"use client";

import React, { useState } from "react";
import { Sparkles, X, Send, Bot, MessageSquare, HelpCircle, Loader2 } from "lucide-react";

interface FloatingTutorChatProps {
  topicoNome?: string;
  contextoEtapa?: string;
}

export function FloatingTutorChat({
  topicoNome = "Funções do 1º Grau",
  contextoEtapa = "Matemática e suas Tecnologias - Taxa de variação e equações de reta no ENEM",
}: FloatingTutorChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pergunta, setPergunta] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagens, setMensagens] = useState<
    { sender: "user" | "tutor"; texto: string; timestamp: string }[]
  >([
    {
      sender: "tutor",
      texto: `Olá! Sou a sua **IA Tutora** do Trilha 1000. Estou acompanhando sua sessão sobre **${topicoNome}**. Tem alguma dúvida sobre o conceito, gráficos ou quer entender o distrator de alguma questão? É só me perguntar!`,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const quickPrompts = [
    "Qual a pegadinha clássica do ENEM sobre reta?",
    "Como saber rapidamente se a função é crescente?",
    "Me dê um exemplo de questão com táxi ou app.",
  ];

  const handleEnviar = async (textoParaEnviar?: string) => {
    const texto = textoParaEnviar || pergunta;
    if (!texto.trim() || loading) return;

    const novaMensagemUsuario = {
      sender: "user" as const,
      texto,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMensagens((prev) => [...prev, novaMensagemUsuario]);
    setPergunta("");
    setLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "tira_duvidas",
          topico: topicoNome,
          contextoEtapa,
          perguntaUsuario: texto,
        }),
      });

      const data = await res.json();
      const respostaTexto =
        data.resposta ||
        "Não foi possível obter a resposta no momento. Tente novamente em instantes.";

      setMensagens((prev) => [
        ...prev,
        {
          sender: "tutor",
          texto: respostaTexto,
          timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      setMensagens((prev) => [
        ...prev,
        {
          sender: "tutor",
          texto: "Ops! Tive um problema temporário de conexão. Verifique sua chave de API ou tente novamente.",
          timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botão Flutuante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-medium shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Sparkles className="w-5 h-5 text-cyan-200 animate-pulse" />
          <span className="text-sm font-semibold tracking-wide">Tutor Gemini</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}

      {/* Janela de Conversa */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] rounded-2xl glass-panel-glow flex flex-col overflow-hidden shadow-2xl border border-violet-500/30">
          {/* Header */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-100">Tutor Trilha 1000</h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    Gemini
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                  Contexto: {topicoNome}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-sm bg-slate-950/60">
            {mensagens.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "tutor" && (
                  <div className="w-7 h-7 rounded-lg bg-violet-600/30 border border-violet-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-violet-300" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none"
                      : "bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-line text-xs sm:text-sm">{msg.texto}</p>
                  <span className="block text-[10px] text-slate-400 mt-1 text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs py-2">
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>O Tutor Gemini está analisando sua pergunta...</span>
              </div>
            )}
          </div>

          {/* Sugestões Rápidas */}
          <div className="px-3 py-2 bg-slate-900/70 border-t border-slate-800/80 flex gap-1.5 overflow-x-auto">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleEnviar(prompt)}
                disabled={loading}
                className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-slate-800/90 text-slate-300 hover:text-white hover:bg-violet-600/30 border border-slate-700/60 transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input de Mensagem */}
          <div className="p-3 bg-slate-900/95 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEnviar()}
              placeholder="Pergunte qualquer dúvida da aula..."
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
            <button
              onClick={() => handleEnviar()}
              disabled={!pergunta.trim() || loading}
              className="p-2.5 rounded-xl bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md shadow-violet-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
