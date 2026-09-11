/**
 * Motor de Repetição Espaçada (SM-2 Adaptado) — Trilha 1000
 * Baseado nos princípios de Retrieval Practice e na curva de esquecimento de Ebbinghaus.
 */

export interface SM2Item {
  repeticoes: number;
  intervaloDias: number;
  fatorFacilidade: number; // Padrão: 2.5 (mínimo 1.3)
  proximaRevisao: string; // ISO date string
  ultimaRevisao: string;
}

export interface SM2UpdateResult {
  repeticoes: number;
  intervaloDias: number;
  fatorFacilidade: number;
  proximaRevisao: Date;
  urgenciaRevisao: number;
}

/**
 * Converte a taxa de acerto do Ciclo ATIVO (0 a 100%) em qualidade SM-2 (0 a 5).
 */
export function converterDesempenhoParaQualidadeSM2(taxaAcertoPct: number): number {
  if (taxaAcertoPct >= 90) return 5;
  if (taxaAcertoPct >= 75) return 4;
  if (taxaAcertoPct >= 60) return 3;
  if (taxaAcertoPct >= 40) return 2;
  if (taxaAcertoPct >= 20) return 1;
  return 0;
}

/**
 * Executa o cálculo SM-2 para determinar o próximo intervalo de revisão em dias.
 * @param qualidade Nota de 0 a 5 (ou calculada via converterDesempenhoParaQualidadeSM2)
 */
export function calcularProximaRevisaoSM2(
  item: SM2Item,
  qualidade: number
): SM2UpdateResult {
  const q = Math.max(0, Math.min(5, Math.round(qualidade)));
  let { repeticoes, intervaloDias, fatorFacilidade } = item;

  if (q >= 3) {
    if (repeticoes === 0) {
      intervaloDias = 1;
    } else if (repeticoes === 1) {
      intervaloDias = 6;
    } else {
      intervaloDias = Math.round(intervaloDias * fatorFacilidade);
    }
    repeticoes += 1;
  } else {
    // Falha de recuperação: reinicia ciclo de repetições mantendo histórico adaptado
    repeticoes = 0;
    intervaloDias = 1;
  }

  // Atualização do Fator de Facilidade (EF)
  fatorFacilidade =
    fatorFacilidade + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (fatorFacilidade < 1.3) {
    fatorFacilidade = 1.3;
  }

  const hoje = new Date();
  const proximaRevisao = new Date(hoje);
  proximaRevisao.setDate(hoje.getDate() + Math.max(1, intervaloDias));

  return {
    repeticoes,
    intervaloDias: Math.max(1, intervaloDias),
    fatorFacilidade: Math.round(fatorFacilidade * 100) / 100,
    proximaRevisao,
    urgenciaRevisao: calcularUrgenciaRevisao(proximaRevisao),
  };
}

/**
 * Calcula a urgência de revisão de um tópico (1.0 = vence hoje, > 1.0 = atrasado, < 1.0 = no futuro)
 */
export function calcularUrgenciaRevisao(proximaRevisao: Date | string): number {
  const target = typeof proximaRevisao === "string" ? new Date(proximaRevisao) : proximaRevisao;
  const agora = new Date();
  const diffDias = (agora.getTime() - target.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDias >= 0) {
    // Já venceu ou vence hoje: urgência cresce linearmente
    return 1.0 + Math.min(2.0, diffDias * 0.2);
  }
  // Ainda no futuro: urgência proporcional à proximidade
  return Math.max(0.1, 1.0 + diffDias * 0.15);
}

/**
 * Fórmula de Priorização de Tópico do Trilha 1000:
 * prioridade = (1 - IP_normalizado) * peso_importancia * urgencia_de_revisao
 */
export function calcularPrioridadeTopico(
  ip: number,
  pesoImportancia: number = 1.0,
  proximaRevisao: Date | string
): number {
  const ipNormalizado = Math.min(1, Math.max(0, ip / 1000));
  const urgencia = calcularUrgenciaRevisao(proximaRevisao);
  const prioridade = (1 - ipNormalizado) * pesoImportancia * urgencia;
  return Math.round(prioridade * 100) / 100;
}
