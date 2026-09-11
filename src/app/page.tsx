"use client";

import React from "react";
import Link from "next/link";
import {
  Target,
  Flame,
  Shield,
  ArrowRight,
  TrendingUp,
  Brain,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
  Calendar,
  Clock,
  ChevronRight,
  Award,
  BookOpen,
  Atom,
  Globe,
  PenTool,
  AlertCircle,
} from "lucide-react";
import { useStudy } from "@/lib/store/study-context";
import { classificarProficiencia } from "@/lib/engine/proficiency";

export default function DashboardPage() {
  const { profile, proficiencias, notaEstimadaEnem, gapParaCorte } = useStudy();

  const areas = [
    {
      id: "matematica",
      nome: "Matemática",
      codigo: "MT",
      ip: proficiencias.matematica,
      cor: "from-blue-500 to-indigo-600",
      accent: "text-blue-400",
      border: "border-blue-500/30",
      bg: "bg-blue-500/10",
      icon: TrendingUp,
      link: "/trilha/matematica",
      status: "Em Progresso • Etapa 2",
      descricao: "Álgebra, Funções Afim e Quadrática, Geometria e Estatística.",
    },
    {
      id: "natureza",
      nome: "Ciências da Natureza",
      codigo: "CN",
      ip: proficiencias.natureza,
      cor: "from-emerald-500 to-teal-600",
      accent: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
      icon: Atom,
      link: "#",
      status: "Próxima da fila",
      descricao: "Ecologia, Estequiometria, Mecânica e Ondulatória.",
    },
    {
      id: "humanas",
      nome: "Ciências Humanas",
      codigo: "CH",
      ip: proficiencias.humanas,
      cor: "from-amber-500 to-orange-600",
      accent: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
      icon: Globe,
      link: "#",
      status: "Sólido",
      descricao: "História do Brasil, Geopolítica, Cidadania e Filosofia.",
    },
    {
      id: "linguagens",
      nome: "Linguagens e Códigos",
      codigo: "LC",
      ip: proficiencias.linguagens,
      cor: "from-purple-500 to-violet-600",
      accent: "text-purple-400",
      border: "border-purple-500/30",
      bg: "bg-purple-500/10",
      icon: BookOpen,
      link: "#",
      status: "Estável",
      descricao: "Gêneros Textuais, Variação Linguística e Literatura.",
    },
    {
      id: "redacao",
      nome: "Redação Dissertativa",
      codigo: "RD",
      ip: proficiencias.redacao,
      cor: "from-pink-500 to-rose-600",
      accent: "text-pink-400",
      border: "border-pink-500/30",
      bg: "bg-pink-500/10",
      icon: PenTool,
      link: "/redacao",
      status: "Competência 5 em Foco",
      descricao: "Proposta de Intervenção, Repertório e Coesão Textual.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. HERO: NOTA ESTIMADA ENEM & PROGRESSO DO CURSO */}
      <section className="relative overflow-hidden rounded-3xl glass-panel-glow p-6 sm:p-8">
        {/* Glow de fundo */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Coluna Esquerda: Nota Global Estimada */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Índice de Proficiência Ponderado TRI
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Sua Nota Estimada no ENEM:{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400">
                {notaEstimadaEnem.toFixed(1)}
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Calculada com base na dificuldade real das questões que você resolveu nas 5
              competências. Faltam exatamente{" "}
              <strong className="text-amber-300">+{gapParaCorte.toFixed(1)} pontos</strong> para atingir
              a nota de corte de <strong className="text-white">{profile.cursoAlvo}</strong> na{" "}
              <strong className="text-white">{profile.universidadeAlvo}</strong>.
            </p>

            {/* Barra de Progresso Rumo ao Corte */}
            <div className="space-y-2 pt-2 max-w-xl">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400">Atual: {notaEstimadaEnem.toFixed(1)}</span>
                <span className="text-amber-400 font-semibold">
                  Meta SISU: {profile.notaCorteAlvo.toFixed(1)} pts
                </span>
              </div>
              <div className="w-full h-3.5 bg-slate-900/90 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-amber-400 transition-all duration-1000 shadow-md shadow-violet-500/20"
                  style={{ width: `${Math.min(100, (notaEstimadaEnem / profile.notaCorteAlvo) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span>0</span>
                <span>500 (Média Nacional)</span>
                <span>750</span>
                <span className="text-amber-300 font-semibold">{profile.notaCorteAlvo}</span>
                <span>1000</span>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Card de Foco & Streak */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Constância Sem Culpa
                </div>
                {profile.seguroCoringaDisponivel && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                    <Shield className="w-3 h-3" /> Seguro 1x/semana
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{profile.streakDias}</span>
                <span className="text-sm text-slate-400">dias consecutivos de estudo</span>
              </div>
              <p className="text-xs text-slate-400">
                Lembre-se: se a vida acontecer e você pausar um dia, seu seguro cobre sem quebrar
                a sequência. O importante é o retorno ágil.
              </p>
            </div>

            <Link
              href="/foco"
              className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-violet-600/30 via-indigo-600/20 to-slate-900 border border-violet-500/40 hover:border-violet-500/70 transition-all shadow-lg shadow-violet-950/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition">
                    Entrar no Modo Fortaleza
                  </h4>
                  <p className="text-xs text-slate-400">Pomodoro adaptativo + bloqueio de fricção</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CARD DE DECISÃO ZERO: "O QUE ESTUDAR HOJE" */}
      <section className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-violet-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-amber-300" />
                Decisão Zero do Dia
              </span>
              <span className="text-xs text-slate-400">
                O algoritmo escolheu o tópico de maior impacto para sua nota
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              Matemática: Funções do 1º Grau (Afim)
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              <strong className="text-cyan-400">Por que hoje?</strong> Esse tópico tem peso 1.5 no
              Enem (cai em média 4 a 6 questões por ano) e seu IP atual (560) indica que acertar
              itens de taxa de variação elevará sua nota estimada em aproximadamente{" "}
              <span className="text-emerald-400 font-semibold">+18 pontos</span>.
            </p>
          </div>

          <Link
            href="/trilha/matematica/funcoes-1-grau"
            className="shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Iniciar Ciclo ATIVO
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. AS 5 COMPETÊNCIAS DO ENEM (SKILL TREE OVERVIEW) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-violet-400" />
              As 5 Competências do ENEM
            </h2>
            <p className="text-xs text-slate-400">
              Acompanhe seu Índice de Proficiência (0 a 1000) por área de conhecimento
            </p>
          </div>
          <Link
            href="/trilha/matematica"
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
          >
            Ver Trilha Completa
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {areas.map((area) => {
            const Icon = area.icon;
            const classif = classificarProficiencia(area.ip);

            return (
              <div
                key={area.id}
                className="p-5 rounded-2xl glass-card-interactive flex flex-col justify-between space-y-4 border border-slate-800/80"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${area.cor} p-0.5 shadow-md`}
                      >
                        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                          <Icon className={`w-5 h-5 ${area.accent}`} />
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {area.codigo}
                        </span>
                        <h3 className="text-base font-bold text-white">{area.nome}</h3>
                      </div>
                    </div>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${classif.badge}`}>
                      {classif.nivel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {area.descricao}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-400">Índice de Proficiência</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black text-white">{area.ip.toFixed(1)}</span>
                      <span className="text-xs text-slate-400">/ 1000</span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${area.cor}`}
                      style={{ width: `${(area.ip / 1000) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 font-medium">{area.status}</span>
                    {area.link !== "#" ? (
                      <Link
                        href={area.link}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        Acessar Trilha <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-400">Em breve</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FILA DE REVISÃO ESPAÇADA DO DIA (SM-2) */}
      <section className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Fila de Revisão Espaçada de Hoje</h3>
              <p className="text-xs text-slate-400">
                1 tópico programado pelo algoritmo SM-2 para evitar a curva de esquecimento
              </p>
            </div>
          </div>
          <Link
            href="/revisao"
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
          >
            Abrir Fila Completa <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-400">Matemática</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Retenção Atual: 84%
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-200">
                Conjuntos e Intervalos Numéricos
              </h4>
              <p className="text-[11px] text-slate-400">
                Última revisão há 6 dias • 3 flashcards + 2 questões rápidas
              </p>
            </div>
            <Link
              href="/trilha/matematica/funcoes-1-grau"
              className="px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 text-xs font-semibold border border-violet-500/30 transition"
            >
              Revisar Agora (5 min)
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 flex flex-col justify-center items-center text-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-1" />
            <p className="text-xs font-semibold text-slate-300">Ciências Humanas e Natureza em dia!</p>
            <p className="text-[11px] text-slate-400">
              Próximas revisões dessas áreas agendadas para amanhã.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
