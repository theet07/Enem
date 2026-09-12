"use client";

import React, { useState } from "react";
import { X, Send, MessageSquare, Loader2 } from "lucide-react";

interface FloatingTutorChatProps {
  topicoNome?: string;
  contextoEtapa?: string;
}

export function FloatingTutorChat({
  topicoNome = "Funções do 1º grau",
  contextoEtapa = "Matemática e suas tecnologias - Taxa de variação e equações de reta no Enem",
}: FloatingTutorChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pergunta, setPergunta] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagens, setMensagens] = useState<
    { sender: "user" | "tutor"; texto: string; timestamp: string }[]
  >([
    {
      sender: "tutor",
      texto: `Olá. Sou o tutor de apoio da Trilha 1000. Estou acompanhando sua sessão sobre ${topicoNome}. Tem alguma dúvida conceitual ou quer revisar alguma alternativa? Pode perguntar.`,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const quickPrompts = [
    "qual o padrão mais comum do enem nesse assunto?",
    "como identificar o coeficiente angular no gráfico?",
    "me dê um exemplo prático de aplicação.",
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
      {/* Botão Flutuante Minimalista */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#3D6FB4] hover:bg-[#315891] text-[#FFFFFF] text-xs font-medium transition-colors shadow-sm"
        >
          <MessageSquare className="w-4 h-4" />
          <span>tutor</span>
        </button>
      )}

      {/* Janela de Conversa Editorial */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[380px] h-[520px] rounded-xl bg-[#FFFFFF] dark:bg-[#242220] border border-[#E5E1D8] dark:border-[#38352F] flex flex-col overflow-hidden shadow-sm">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#E5E1D8] dark:border-[#38352F] flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-[#232019] dark:text-[#F1EEE7]">
                tutor de estudo
              </h3>
              <p className="text-[11px] text-[#6B665C] dark:text-[#B5B0A4] truncate max-w-[240px]">
                {topicoNome}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#6B665C] dark:text-[#B5B0A4] hover:text-[#232019] dark:hover:text-[#F1EEE7] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[#F7F5F0]/30 dark:bg-[#1C1A17]/30">
            {mensagens.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#3D6FB4] text-[#FFFFFF]"
                      : "bg-[#FFFFFF] dark:bg-[#242220] text-[#232019] dark:text-[#F1EEE7] border border-[#E5E1D8] dark:border-[#38352F]"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.texto}</p>
                </div>
                <span className="text-[10px] text-[#6B665C] dark:text-[#B5B0A4] mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-[#6B665C] dark:text-[#B5B0A4] text-xs py-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3D6FB4]" />
                <span>consultando tutor...</span>
              </div>
            )}
          </div>

          {/* Sugestões Rápidas */}
          <div className="px-3 py-2 border-t border-[#E5E1D8] dark:border-[#38352F] flex gap-1.5 overflow-x-auto bg-[#FFFFFF] dark:bg-[#242220]">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleEnviar(prompt)}
                disabled={loading}
                className="shrink-0 text-[11px] px-2.5 py-1 rounded-md bg-[#F7F5F0] dark:bg-[#1C1A17] text-[#6B665C] dark:text-[#B5B0A4] hover:text-[#232019] dark:hover:text-[#F1EEE7] border border-[#E5E1D8] dark:border-[#38352F] transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input de Mensagem */}
          <div className="p-3 border-t border-[#E5E1D8] dark:border-[#38352F] flex items-center gap-2 bg-[#FFFFFF] dark:bg-[#242220]">
            <input
              type="text"
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEnviar()}
              placeholder="digite sua dúvida..."
              className="flex-1 bg-[#F7F5F0] dark:bg-[#1C1A17] border border-[#E5E1D8] dark:border-[#38352F] rounded-lg px-3 py-1.5 text-xs text-[#232019] dark:text-[#F1EEE7] placeholder-[#6B665C] dark:placeholder-[#B5B0A4] focus:outline-none focus:border-[#3D6FB4]"
            />
            <button
              onClick={() => handleEnviar()}
              disabled={!pergunta.trim() || loading}
              className="p-2 rounded-lg bg-[#3D6FB4] text-white hover:bg-[#315891] disabled:opacity-40 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
