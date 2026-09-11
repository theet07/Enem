-- ==============================================================================
-- TRILHA 1000 — SCHEMA COMPLETO SUPABASE POSTGRESQL
-- Plataforma de Estudos para o ENEM baseada em Ciência Cognitiva e Tutoria IA
-- ==============================================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABELA DE USUÁRIOS E PERFIL
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nome TEXT,
  prova_alvo_data DATE DEFAULT '2026-11-08',
  curso_alvo TEXT DEFAULT 'Medicina',
  universidade_alvo TEXT DEFAULT 'USP / SISU',
  nota_corte_alvo NUMERIC(5, 1) DEFAULT 795.5,
  nota_alvo NUMERIC(5, 1) DEFAULT 810.0,
  onboarding_completo BOOLEAN DEFAULT TRUE,
  streak_dias INT DEFAULT 5,
  seguro_coringa_disponivel BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE ÁREAS DO ENEM (5 Competências)
CREATE TABLE IF NOT EXISTS public.areas (
  id TEXT PRIMARY KEY, -- 'matematica', 'natureza', 'humanas', 'linguagens', 'redacao'
  nome TEXT NOT NULL,
  codigo TEXT NOT NULL,
  descricao TEXT,
  cor TEXT NOT NULL,
  icone TEXT NOT NULL,
  peso_padrao NUMERIC(3, 1) DEFAULT 1.0,
  ordem INT DEFAULT 1
);

-- 4. TABELA DE TÓPICOS (Skill Tree Nodes)
CREATE TABLE IF NOT EXISTS public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id TEXT REFERENCES public.areas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  fase_temporada TEXT NOT NULL DEFAULT 'fundacao' CHECK (fase_temporada IN ('fundacao', 'consolidacao', 'intensivo', 'reta_final')),
  ordem INT DEFAULT 1,
  pre_requisito_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  peso_enem NUMERIC(3, 1) DEFAULT 1.0,
  descricao TEXT,
  icone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABELA DE ETAPAS (Unidades do Ciclo ATIVO)
CREATE TABLE IF NOT EXISTS public.etapas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  video_url TEXT NOT NULL,
  video_canal TEXT NOT NULL,
  video_duracao_min INT DEFAULT 12,
  resumo_md TEXT NOT NULL,
  mapa_mental_json JSONB DEFAULT '{}'::jsonb,
  feynman_prompt TEXT NOT NULL,
  conceitos_chave TEXT[] DEFAULT '{}',
  ordem INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABELA DE QUESTÕES (Estilo ENEM com TRI e Distratores Comentados)
CREATE TABLE IF NOT EXISTS public.questoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etapa_id UUID REFERENCES public.etapas(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL DEFAULT 'verificacao' CHECK (tipo IN ('ativacao', 'verificacao', 'simulado')),
  enunciado TEXT NOT NULL,
  contexto_extra TEXT,
  imagem_url TEXT,
  dificuldade_calibrada NUMERIC(5, 1) NOT NULL DEFAULT 550.0,
  ano_enem INT,
  habilidade_inep TEXT,
  alternativas JSONB NOT NULL,
  ordem INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABELA DE PROGRESSO DO USUÁRIO & PROFICIÊNCIA (Elo/Bayesian & SM-2)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  etapa_id UUID REFERENCES public.etapas(id) ON DELETE CASCADE,
  indice_proficiencia NUMERIC(5, 1) DEFAULT 500.0 CHECK (indice_proficiencia >= 0 AND indice_proficiencia <= 1000),
  k_factor NUMERIC(4, 1) DEFAULT 32.0,
  status TEXT DEFAULT 'bloqueado' CHECK (status IN ('bloqueado', 'disponivel', 'em_progresso', 'dominado')),
  fase_ativo_atual TEXT DEFAULT 'A' CHECK (fase_ativo_atual IN ('A', 'T', 'I', 'V', 'O', 'concluido')),
  ultima_revisao TIMESTAMPTZ,
  proxima_revisao TIMESTAMPTZ,
  intervalo_dias NUMERIC(5, 1) DEFAULT 1.0,
  fator_facilidade NUMERIC(4, 2) DEFAULT 2.50,
  repeticoes INT DEFAULT 0,
  taxa_acerto NUMERIC(5, 2) DEFAULT 0.0,
  questoes_respondidas INT DEFAULT 0,
  feynman_resposta TEXT,
  feynman_avaliacao JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_etapa UNIQUE (user_id, etapa_id)
);

-- 8. TABELA DO MODO FORTALEZA (Sessões Anti-Procrastinação)
CREATE TABLE IF NOT EXISTS public.sessoes_estudo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  inicio TIMESTAMPTZ DEFAULT NOW(),
  fim TIMESTAMPTZ,
  duracao_minutos INT DEFAULT 0,
  blocos_completos INT DEFAULT 0,
  distracoes_registradas JSONB DEFAULT '[]'::jsonb,
  avaliacao_utilidade INT CHECK (avaliacao_utilidade BETWEEN 1 AND 5),
  contrato_intencao JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABELA DE REDAÇÕES (5 Competências do Inep + IA)
CREATE TABLE IF NOT EXISTS public.redacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  tema TEXT NOT NULL,
  texto TEXT NOT NULL,
  tempo_gasto_segundos INT DEFAULT 0,
  nota_c1 INT DEFAULT 0 CHECK (nota_c1 BETWEEN 0 AND 200),
  nota_c2 INT DEFAULT 0 CHECK (nota_c2 BETWEEN 0 AND 200),
  nota_c3 INT DEFAULT 0 CHECK (nota_c3 BETWEEN 0 AND 200),
  nota_c4 INT DEFAULT 0 CHECK (nota_c4 BETWEEN 0 AND 200),
  nota_c5 INT DEFAULT 0 CHECK (nota_c5 BETWEEN 0 AND 200),
  nota_total INT GENERATED ALWAYS AS (nota_c1 + nota_c2 + nota_c3 + nota_c4 + nota_c5) STORED,
  feedback_ia JSONB DEFAULT '{}'::jsonb,
  data_submissao TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABELA DE METAS
CREATE TABLE IF NOT EXISTS public.metas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('diaria', 'semanal', 'longo_prazo')),
  titulo TEXT NOT NULL,
  descricao TEXT,
  meta_minutos INT,
  progresso_minutos INT DEFAULT 0,
  meta_questoes INT,
  progresso_questoes INT DEFAULT 0,
  concluida BOOLEAN DEFAULT FALSE,
  data_referencia DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TABELA DE CONQUISTAS
CREATE TABLE IF NOT EXISTS public.conquistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  badge_nome TEXT NOT NULL,
  badge_descricao TEXT,
  badge_icone TEXT,
  data_conquista TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_badge UNIQUE (user_id, badge_id)
);

-- ÍNDICES
CREATE INDEX IF NOT EXISTS idx_topics_area ON public.topics(area_id);
CREATE INDEX IF NOT EXISTS idx_etapas_topic ON public.etapas(topic_id);
CREATE INDEX IF NOT EXISTS idx_questoes_etapa ON public.questoes(etapa_id);
CREATE INDEX IF NOT EXISTS idx_questoes_topic ON public.questoes(topic_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_revisao ON public.user_progress(proxima_revisao);
CREATE INDEX IF NOT EXISTS idx_sessoes_user ON public.sessoes_estudo(user_id);
CREATE INDEX IF NOT EXISTS idx_redacoes_user ON public.redacoes(user_id);

-- FUNÇÃO ELO / TRI ADAPTATIVO
CREATE OR REPLACE FUNCTION public.calcular_novo_ip(
  p_ip_atual NUMERIC,
  p_dificuldade_questao NUMERIC,
  p_acertou BOOLEAN,
  p_k_factor NUMERIC
) RETURNS NUMERIC AS $$
DECLARE
  v_esperado NUMERIC;
  v_real NUMERIC;
  v_novo_ip NUMERIC;
BEGIN
  v_esperado := 1.0 / (1.0 + POWER(10.0, (p_dificuldade_questao - p_ip_atual) / 400.0));
  v_real := CASE WHEN p_acertou THEN 1.0 ELSE 0.0 END;
  v_novo_ip := p_ip_atual + (p_k_factor * (v_real - v_esperado));
  IF v_novo_ip < 0 THEN v_novo_ip := 0; END IF;
  IF v_novo_ip > 1000 THEN v_novo_ip := 1000; END IF;
  RETURN ROUND(v_novo_ip, 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.etapas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessoes_estudo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conquistas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Areas" ON public.areas FOR SELECT USING (true);
CREATE POLICY "Public Read Topics" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Public Read Etapas" ON public.etapas FOR SELECT USING (true);
CREATE POLICY "Public Read Questoes" ON public.questoes FOR SELECT USING (true);

CREATE POLICY "User owns profile" ON public.users FOR ALL USING (auth.uid() = id);
CREATE POLICY "User owns progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User owns sessions" ON public.sessoes_estudo FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User owns redacoes" ON public.redacoes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User owns metas" ON public.metas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User owns conquistas" ON public.conquistas FOR ALL USING (auth.uid() = user_id);
