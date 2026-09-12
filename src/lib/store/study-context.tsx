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
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

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
  respostasAtivacao: Record<string, string>;
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
  resetarTudoZerado: () => void;
}

// Chave limpa zerada v4
const STORAGE_KEY = "trilha1000_study_state_v4_zeroed";
const LEGACY_KEYS = [
  "trilha1000_study_state",
  "trilha1000_study_state_v1",
  "trilha1000_study_state_v2",
  "trilha1000_study_state_v3_clean_zero",
];

const INITIAL_PROFILE: UserProfile = {
  nome: "Matheus",
  cursoAlvo: "Medicina",
  universidadeAlvo: "USP / SISU",
  notaCorteAlvo: 795.5,
  notaAlvo: 815.0,
  dataProva: "2026-11-08",
  streakDias: 0,
  seguroCoringaDisponivel: true,
};

const INITIAL_PROFICIENCIA: AreaProficiency = {
  matematica: 0,
  natureza: 0,
  humanas: 0,
  linguagens: 0,
  redacao: 0,
};

const INITIAL_TOPIC_PROGRESS: Record<string, TopicProgressState> = {
  "etapa-f1g-01": {
    etapaId: "etapa-f1g-01",
    topicoSlug: "funcoes-1-grau",
    faseAtual: "A",
    ipAtual: 0,
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
};

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [proficiencias, setProficiencias] = useState<AreaProficiency>(INITIAL_PROFICIENCIA);
  const [topicoProgresso, setTopicoProgresso] = useState<Record<string, TopicProgressState>>(
    INITIAL_TOPIC_PROGRESS
  );

  const [sessaoFoco, setSessaoFoco] = useState<SessaoFoco>({
    ativa: false,
    tempoRestanteSegundos: 25 * 60,
    blocoMinutos: 25,
    modoPausa: false,
    distracoes: [],
  });

  // 1. Carregar estado local ou sincronizar com o Supabase
  useEffect(() => {
    try {
      // Limpa chaves legadas com mocks antigos
      LEGACY_KEYS.forEach((k) => {
        try {
          localStorage.removeItem(k);
        } catch (e) {}
      });

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

    // Se o Supabase estiver configurado, busca dados salvos no banco
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const carregarDadosSupabase = async () => {
        try {
          const { data, error } = await client.from("user_progress").select("*");
          if (!error && data && data.length > 0) {
            const map: Record<string, TopicProgressState> = {};
            let maiorMatIP = 0;

            data.forEach((row: any) => {
              const etapaId = row.etapa_id || "etapa-f1g-01";
              const ip = Number(row.indice_proficiencia) || 0;
              maiorMatIP = Math.max(maiorMatIP, ip);

              map[etapaId] = {
                etapaId,
                topicoSlug: "funcoes-1-grau",
                faseAtual: row.fase_ativo_atual || "A",
                ipAtual: ip,
                questoesRespondidas: row.questoes_respondidas || 0,
                respostasAtivacao: {},
                respostasVerificacao: {},
                acertosVerificacao: 0,
                totalVerificacao: 4,
                feynmanTexto: row.feynman_resposta || "",
                feynmanAvaliacao: row.feynman_avaliacao,
                sm2Data: {
                  repeticoes: row.repeticoes || 0,
                  intervaloDias: Number(row.intervalo_dias) || 1,
                  fatorFacilidade: Number(row.fator_facilidade) || 2.5,
                  proximaRevisao: row.proxima_revisao || new Date().toISOString(),
                  ultimaRevisao: row.ultima_revisao || new Date().toISOString(),
                },
              };
            });

            setTopicoProgresso((prev) => ({ ...prev, ...map }));
            if (maiorMatIP > 0) {
              setProficiencias((prev) => ({ ...prev, matematica: maiorMatIP }));
            }
          }
        } catch (err) {
          console.warn("Supabase init error:", err);
        }
      };

      carregarDadosSupabase();
    }
  }, []);

  // 2. Salvar no LocalStorage a cada alteração
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

  const resetarTudoZerado = () => {
    setProfile(INITIAL_PROFILE);
    setProficiencias(INITIAL_PROFICIENCIA);
    setTopicoProgresso(INITIAL_TOPIC_PROGRESS);
    setSessaoFoco({
      ativa: false,
      tempoRestanteSegundos: 25 * 60,
      blocoMinutos: 25,
      modoPausa: false,
      distracoes: [],
    });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  const responderAtivacao = (etapaId: string, questaoId: string, letra: string) => {
    setTopicoProgresso((prev) => {
      const atual = prev[etapaId] || {
        ...INITIAL_TOPIC_PROGRESS["etapa-f1g-01"],
        etapaId,
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

    if (isSupabaseConfigured && supabase) {
      Promise.resolve(
        supabase
          .from("user_progress")
          .upsert(
            {
              etapa_id: etapaId,
              feynman_resposta: texto,
              feynman_avaliacao: avaliacao || null,
              fase_ativo_atual: "I",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "etapa_id" }
          )
      )
        .then(({ error }) => {
          if (error) console.warn("Supabase feynman upsert warning:", error.message);
        })
        .catch((e: unknown) => console.warn(e));
    }
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
      ...INITIAL_TOPIC_PROGRESS["etapa-f1g-01"],
      etapaId,
      topicoSlug,
      faseAtual: "V",
    };

    const { novoIP, delta } = atualizarIP({
      ipAtual: atual.ipAtual,
      dificuldadeQuestao: dificuldade,
      acertou: ehCorreta,
      questoesRespondidasNoTopico: atual.questoesRespondidas,
    });

    const novasRespostas = { ...atual.respostasVerificacao, [questaoId]: letra };
    const novosAcertos = atual.acertosVerificacao + (ehCorreta ? 1 : 0);
    const questoesTotal = atual.questoesRespondidas + 1;

    setTopicoProgresso((prev) => ({
      ...prev,
      [etapaId]: {
        ...atual,
        ipAtual: novoIP,
        questoesRespondidas: questoesTotal,
        respostasVerificacao: novasRespostas,
        acertosVerificacao: novosAcertos,
      },
    }));

    setProficiencias((prev) => ({
      ...prev,
      matematica: Math.round(novoIP * 10) / 10,
    }));

    // Se o streak for 0, marca 1 dia estudado
    setProfile((prev) => ({
      ...prev,
      streakDias: Math.max(1, prev.streakDias),
    }));

    // Sincroniza diretamente no Supabase se configurado
    if (isSupabaseConfigured && supabase) {
      Promise.resolve(
        supabase
          .from("user_progress")
          .upsert(
            {
              etapa_id: etapaId,
              indice_proficiencia: novoIP,
              questoes_respondidas: questoesTotal,
              fase_ativo_atual: "V",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "etapa_id" }
          )
      )
        .then(({ error }) => {
          if (error) console.warn("Supabase upsert warning:", error.message);
        })
        .catch((e: unknown) => console.warn(e));
    }

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

      // Sincroniza conclusão e próximo agendamento no Supabase
      if (isSupabaseConfigured && supabase) {
        Promise.resolve(
          supabase
            .from("user_progress")
            .upsert(
              {
                etapa_id: etapaId,
                status: "dominado",
                fase_ativo_atual: "concluido",
                proxima_revisao: proximaRevisao.toISOString(),
                intervalo_dias: intervaloDias,
                fator_facilidade: fatorFacilidade,
                repeticoes: repeticoes,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "etapa_id" }
            )
        )
          .then(({ error }) => {
            if (error) console.warn("Supabase completion warning:", error.message);
          })
          .catch((e: unknown) => console.warn(e));
      }

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

  const registrarDistracao = (motivo: string = "Distração registrada") => {
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

    if (isSupabaseConfigured && supabase) {
      Promise.resolve(
        supabase
          .from("sessoes_estudo")
          .insert({
            inicio: new Date().toISOString(),
            duracao_minutos: minutos,
            contrato_intencao: contrato,
          })
      )
        .then(({ error }) => {
          if (error) console.warn("Supabase session warning:", error.message);
        })
        .catch((e: unknown) => console.warn(e));
    }
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
        resetarTudoZerado,
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
