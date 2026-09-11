/**
 * Motor Matemático do Índice de Proficiência (IP) — Trilha 1000
 * Baseado em modelagem probabilística inspirada na Teoria de Resposta ao Item (TRI) e Elo rating.
 * Escala idêntica ao ENEM: 0 a 1000 pontos.
 */

export interface AreaProficiency {
  matematica: number;
  natureza: number;
  humanas: number;
  linguagens: number;
  redacao: number;
}

export interface IPUpdateParams {
  ipAtual: number;
  dificuldadeQuestao: number; // 300 (muito fácil) a 900 (muito difícil)
  acertou: boolean;
  questoesRespondidasNoTopico?: number;
}

export interface IPUpdateResult {
  novoIP: number;
  delta: number;
  probabilidadeEsperada: number;
  kFactorUsado: number;
}

/**
 * Calcula a probabilidade de acerto esperada com base na distância entre o IP do aluno
 * e a dificuldade calibrada do item (Função Logística de 1 Parâmetro).
 */
export function calcularProbabilidadeEsperada(ip: number, dificuldade: number): number {
  return 1 / (1 + Math.pow(10, (dificuldade - ip) / 400));
}

/**
 * Retorna o fator K dinâmico: diminui conforme o aluno ganha maturidade naquele tópico,
 * garantindo rápida calibragem inicial e estabilidade com o passar do tempo.
 */
export function obterKFactor(questoesRespondidas: number = 0): number {
  if (questoesRespondidas < 5) return 40;
  if (questoesRespondidas < 15) return 32;
  if (questoesRespondidas < 30) return 24;
  return 16;
}

/**
 * Atualiza o IP do aluno após responder uma questão.
 */
export function atualizarIP({
  ipAtual,
  dificuldadeQuestao,
  acertou,
  questoesRespondidasNoTopico = 0,
}: IPUpdateParams): IPUpdateResult {
  const probEsperada = calcularProbabilidadeEsperada(ipAtual, dificuldadeQuestao);
  const resultadoReal = acertou ? 1 : 0;
  const k = obterKFactor(questoesRespondidasNoTopico);

  const delta = k * (resultadoReal - probEsperada);
  let novoIP = ipAtual + delta;

  // Limites estritos do ENEM [0, 1000]
  novoIP = Math.max(0, Math.min(1000, novoIP));
  const roundedNovoIP = Math.round(novoIP * 10) / 10;

  return {
    novoIP: roundedNovoIP,
    delta: Math.round(delta * 10) / 10,
    probabilidadeEsperada: Math.round(probEsperada * 100) / 100,
    kFactorUsado: k,
  };
}

/**
 * Aplica decaimento da curva de esquecimento (Ebbinghaus) para tópicos sem revisão.
 * Decai suavemente após 7 dias de inatividade no tópico (máximo de 15% de decaimento).
 */
export function aplicarDecaimentoPorTempo(
  ipOriginal: number,
  diasSemRevisao: number
): number {
  if (diasSemRevisao <= 5) return ipOriginal;
  
  // Taxa diária de esquecimento suave lambda ~ 0.005
  const lambda = 0.004;
  const diasEfetivos = diasSemRevisao - 5;
  const fatorRetencao = Math.max(0.85, Math.exp(-lambda * diasEfetivos));
  
  return Math.round(ipOriginal * fatorRetencao * 10) / 10;
}

/**
 * Calcula a Nota Global Estimada ENEM (Média das 4 áreas + Redação)
 */
export function calcularNotaGlobalEnem(
  proficiencias: AreaProficiency,
  pesos?: Partial<Record<keyof AreaProficiency, number>>
): number {
  const pesosDefault: Record<keyof AreaProficiency, number> = {
    matematica: 1,
    natureza: 1,
    humanas: 1,
    linguagens: 1,
    redacao: 1,
    ...pesos,
  };

  const somaPesos = Object.values(pesosDefault).reduce((a, b) => a + b, 0);
  const somaPonderada =
    proficiencias.matematica * pesosDefault.matematica +
    proficiencias.natureza * pesosDefault.natureza +
    proficiencias.humanas * pesosDefault.humanas +
    proficiencias.linguagens * pesosDefault.linguagens +
    proficiencias.redacao * pesosDefault.redacao;

  return Math.round((somaPonderada / somaPesos) * 10) / 10;
}

/**
 * Determina a categoria pedagógica de domínio do aluno no tópico.
 */
export function classificarProficiencia(ip: number): {
  nivel: string;
  cor: string;
  badge: string;
} {
  if (ip >= 800) return { nivel: "Domínio Avançado", cor: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" };
  if (ip >= 700) return { nivel: "Competência Sólida", cor: "text-cyan-400", badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" };
  if (ip >= 600) return { nivel: "Intermediário em Construção", cor: "text-amber-400", badge: "bg-amber-500/20 text-amber-300 border-amber-500/40" };
  if (ip >= 500) return { nivel: "Fundamentos Básicos", cor: "text-orange-400", badge: "bg-orange-500/20 text-orange-300 border-orange-500/40" };
  return { nivel: "Etapa Inicial", cor: "text-rose-400", badge: "bg-rose-500/20 text-rose-300 border-rose-500/40" };
}
