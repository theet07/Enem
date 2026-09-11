"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  AreaProficiency,
  calcularNotaGlobalEnem,
  atualizarIP,
} from "@/lib/engine/proficiency";
import {
  SM2Item,
  calcularProximaRevisaoSM2,
  converterDesempenhoParaQualidadeSM2,
} from "@/lib/engine/spaced-repetition";

export interface UserProfile {
  nome: string;
  cursoAlvo: string;
  universidadeAlvo: string;
  notaCorteAlvo: number;
  notaAlvo: number;
  dataProva: string;
  streakDias: number;
  seguroCoringaDisponivel: boolean;
}

export interface TopicProgressState {
  etapaId: string;
  topicoSlug: string;
  faseAtual: "A" | "T" | "I" | "V" | "O" | "concluido";
  ipAtual: number;
  questoesRespondidas: number;
  respostasAtivacao: Record<string, string>; // questaoId -> letra
  respostasVerificacao: Record<string, string>;
  acertosVerificacao: number;
  totalVerificacao: number;
  feynmanTexto: string;
  feynmanAvaliacao?: {
    notaDominio: number;
    pontosPositivos: string[];
    lacunas: string[];
    dicaPedagogica: string;
  };
  sm2Data: SM2Item;
  concluidoEm?: string;
}

export interface DistracaoLog {
  timestamp: string;
  motivo: string;
}

export interface SessaoFoco {
  ativa: boolean;
  tempoRestanteSegundos: number;
  blocoMinutos: number;
  modoPausa: boolean;
  contratoIntencao?: {
    quando: string;
    onde: string;
    oQue: string;
  };
  distracoes: DistracaoLog[];
}

interface StudyContextType {
  profile: UserProfile;
  proficiencias: AreaProficiency;
  notaEstimadaEnem: number;
  gapParaCorte: number;
  topicoProgresso: Record<string, TopicProgressState>;
  sessaoFoco: SessaoFoco;
  // Ações
  responderAtivacao: (etapaId: string, questaoId: string, letra: string) => void;
  salvarFeynman: (etapaId: string, texto: string, avaliacao?: any) => void;
  responderVerificacao: (
    etapaId: string,
    topicoSlug: string,
    questaoId: string,
    letra: string,
    ehCorreta: boolean,
    dificuldade: number
  ) => { novoIP: number; delta: number };
  avancarFaseAtivo: (etapaId: string, novaFase: "A" | "T" | "I" | "V" | "O" | "concluido") => void;
  concluirEtapaAtivo: (etapaId: string) => void;
  registrarDistracao: (motivo?: string) => void;
  iniciarModoFortaleza: (contrato: { quando: string; onde: string; oQue: string }, minutos?: number) => void;
  encerrarModoFortaleza: () => void;
}

const STORAGE_KEY = "trilha1000_study_state_v1";

const DEFAULT_PROFILE: UserProfile = {
  nome: "Matheus",
  cursoAlvo: "Medicina",
  universidadeAlvo: "USP / SISU",
  notaCorteAlvo: 795.5,
  notaAlvo: 815.0,
  dataProva: "2026-11-08",
  streakDias: 6,
  seguroCoringaDisponivel: true,
};

const DEFAULT_PROFICIENCIA: AreaProficiency = {
  matematica: 560,
  natureza: 620,
  humanas: 685,
  linguagens: 660,
  redacao: 760,
};

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [proficiencias, setProficiencias] = useState<AreaProficiency>(DEFAULT_PROFICIENCIA);
  const [topicoProgresso, setTopicoProgresso] = useState<Record<string, TopicProgressState>>({
    "etapa-f1g-01": {
      etapaId: "etapa-f1g-01",
      topicoSlug: "funcoes-1-grau",
      faseAtual: "A",
      ipAtual: 540,
      questoesRespondidas: 0,
      respostasAtivacao: {},
      respostasVerificacao: {},
      acertosVerificacao: 0,
      totalVerificacao: 4,
      feynmanTexto: "",
      sm2Data: {
        repeticoes: 0,
        intervaloDias: 1,
        fatorFacilidade: 2.5,
        proximaRevisao: new Date().toISOString(),
        ultimaRevisao: new Date().toISOString(),
      },
    },
  });

  const [sessaoFoco, setSessaoFoco] = useState<SessaoFoco>({
    ativa: false,
    tempoRestanteSegundos: 25 * 60,
    blocoMinutos: 25,
    modoPausa: false,
    distracoes: [],
  });

  // Carregar do LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.proficiencias) setProficiencias(parsed.proficiencias);
        if (parsed.topicoProgresso) setTopicoProgresso(parsed.topicoProgresso);
      }
    } catch (e) {
      console.error("Erro ao carregar dados locais:", e);
    }
  }, []);

  // Salvar no LocalStorage ao alterar
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ profile, proficiencias, topicoProgresso })
      );
    } catch (e) {
      console.error("Erro ao salvar dados locais:", e);
    }
  }, [profile, proficiencias, topicoProgresso]);

  const notaEstimadaEnem = calcularNotaGlobalEnem(proficiencias);
  const gapParaCorte = Math.max(0, Math.round((profile.notaCorteAlvo - notaEstimadaEnem) * 10) / 10);

  const responderAtivacao = (etapaId: string, questaoId: string, letra: string) => {
    setTopicoProgresso((prev) => {
      const atual = prev[etapaId] || {
        etapaId,
        topicoSlug: "funcoes-1-grau",
        faseAtual: "A",
        ipAtual: 540,
        questoesRespondidas: 0,
        respostasAtivacao: {},
        respostasVerificacao: {},
        acertosVerificacao: 0,
        totalVerificacao: 4,
        feynmanTexto: "",
        sm2Data: {
          repeticoes: 0,
          intervaloDias: 1,
          fatorFacilidade: 2.5,
          proximaRevisao: new Date().toISOString(),
          ultimaRevisao: new Date().toISOString(),
        },
      };

      return {
        ...prev,
        [etapaId]: {
          ...atual,
          respostasAtivacao: {
            ...atual.respostasAtivacao,
            [questaoId]: letra,
          },
        },
      };
    });
  };

  const salvarFeynman = (etapaId: string, texto: string, avaliacao?: any) => {
    setTopicoProgresso((prev) => {
      const atual = prev[etapaId];
      if (!atual) return prev;
      return {
        ...prev,
        [etapaId]: {
          ...atual,
          feynmanTexto: texto,
          feynmanAvaliacao: avaliacao || atual.feynmanAvaliacao,
        },
      };
    });
  };

  const responderVerificacao = (
    etapaId: string,
    topicoSlug: string,
    questaoId: string,
    letra: string,
    ehCorreta: boolean,
    dificuldade: number
  ) => {
    const atual = topicoProgresso[etapaId] || {
      etapaId,
      topicoSlug,
      faseAtual: "V",
      ipAtual: proficiencias.matematica,
      questoesRespondidas: 0,
      respostasAtivacao: {},
      respostasVerificacao: {},
      acertosVerificacao: 0,
      totalVerificacao: 4,
      feynmanTexto: "",
      sm2Data: {
        repeticoes: 0,
        intervaloDias: 1,
        fatorFacilidade: 2.5,
        proximaRevisao: new Date().toISOString(),
        ultimaRevisao: new Date().toISOString(),
      },
    };

    // Atualiza IP com o motor Bayesiano / TRI
    const { novoIP, delta } = atualizarIP({
      ipAtual: atual.ipAtual,
      dificuldadeQuestao: dificuldade,
      acertou: ehCorreta,
      questoesRespondidasNoTopico: atual.questoesRespondidas,
    });

    const novasRespostas = { ...atual.respostasVerificacao, [questaoId]: letra };
    const novosAcertos = atual.acertosVerificacao + (ehCorreta ? 1 : 0);

    setTopicoProgresso((prev) => ({
      ...prev,
      [etapaId]: {
        ...atual,
        ipAtual: novoIP,
        questoesRespondidas: atual.questoesRespondidas + 1,
        respostasVerificacao: novasRespostas,
        acertosVerificacao: novosAcertos,
      },
    }));

    // Atualiza a proficiência geral de Matemática do perfil
    setProficiencias((prev) => ({
      ...prev,
      matematica: Math.round(novoIP * 10) / 10,
    }));

    return { novoIP, delta };
  };

  const avancarFaseAtivo = (
    etapaId: string,
    novaFase: "A" | "T" | "I" | "V" | "O" | "concluido"
  ) => {
    setTopicoProgresso((prev) => {
      const atual = prev[etapaId];
      if (!atual) return prev;
      return {
        ...prev,
        [etapaId]: {
          ...atual,
          faseAtual: novaFase,
        },
      };
    });
  };

  const concluirEtapaAtivo = (etapaId: string) => {
    setTopicoProgresso((prev) => {
      const atual = prev[etapaId];
      if (!atual) return prev;

      const taxaAcertoPct =
        atual.totalVerificacao > 0
          ? (atual.acertosVerificacao / atual.totalVerificacao) * 100
          : 75;

      const q = converterDesempenhoParaQualidadeSM2(taxaAcertoPct);
      const { repeticoes, intervaloDias, fatorFacilidade, proximaRevisao } =
        calcularProximaRevisaoSM2(atual.sm2Data, q);

      return {
        ...prev,
        [etapaId]: {
          ...atual,
          faseAtual: "concluido",
          concluidoEm: new Date().toISOString(),
          sm2Data: {
            repeticoes,
            intervaloDias,
            fatorFacilidade,
            proximaRevisao: proximaRevisao.toISOString(),
            ultimaRevisao: new Date().toISOString(),
          },
        },
      };
    });
  };

  const registrarDistracao = (motivo: string = "Distração externa / Notificação") => {
    setSessaoFoco((prev) => ({
      ...prev,
      distracoes: [
        ...prev.distracoes,
        {
          timestamp: new Date().toLocaleTimeString("pt-BR"),
          motivo,
        },
      ],
    }));
  };

  const iniciarModoFortaleza = (
    contrato: { quando: string; onde: string; oQue: string },
    minutos: number = 25
  ) => {
    setSessaoFoco({
      ativa: true,
      tempoRestanteSegundos: minutos * 60,
      blocoMinutos: minutos,
      modoPausa: false,
      contratoIntencao: contrato,
      distracoes: [],
    });
  };

  const encerrarModoFortaleza = () => {
    setSessaoFoco((prev) => ({
      ...prev,
      ativa: false,
    }));
  };

  return (
    <StudyContext.Provider
      value={{
        profile,
        proficiencias,
        notaEstimadaEnem,
        gapParaCorte,
        topicoProgresso,
        sessaoFoco,
        responderAtivacao,
        salvarFeynman,
        responderVerificacao,
        avancarFaseAtivo,
        concluirEtapaAtivo,
        registrarDistracao,
        iniciarModoFortaleza,
        encerrarModoFortaleza,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error("useStudy deve ser usado dentro de um StudyProvider");
  }
  return context;
}
