import type { Bloco, RespostaItem, ResultadoDiagnostico, NivelResposta } from "@/types/diagnostico";
import { blocos } from "@/lib/diagnosticoData";

const blocosPorNumero = new Map<number, Bloco>(blocos.map((bloco) => [bloco.numero, bloco]));

function getNivelPontos(nivel: NivelResposta): number {
  return nivel;
}

function classifyMaturidade(score: number) {
  if (score >= 80) return "Maturidade Estratégica";
  if (score >= 60) return "Maturidade em Desenvolvimento";
  if (score >= 40) return "Maturidade Inicial";
  return "Maturidade Reativa";
}

function classifyRisco(score: number, scoresPorBloco: Record<number, number>) {
  const criticos = blocos.filter((bloco) => bloco.critico);
  const criticosBaixos = criticos.filter((bloco) => scoresPorBloco[bloco.numero] < 50);

  if (score < 40 || criticosBaixos.length >= 2) return "Crítico";
  if (score < 60 || criticosBaixos.length >= 1) return "Elevado";
  if (score < 80) return "Moderado";
  if (criticos.some((bloco) => scoresPorBloco[bloco.numero] < 70)) return "Moderado";
  return "Baixo";
}

function findPadraoPredominante(respostas: RespostaItem[]): "A" | "B" | "C" | "D" {
  const contagem = { A: 0, B: 0, C: 0, D: 0 };

  respostas.forEach((resposta) => {
    if (resposta.nivel === 100) contagem.A += 1;
    if (resposta.nivel === 60) contagem.B += 1;
    if (resposta.nivel === 25) contagem.C += 1;
    if (resposta.nivel === 0) contagem.D += 1;
  });

  const maior = Object.entries(contagem).sort((a, b) => b[1] - a[1])[0][0] as "A" | "B" | "C" | "D";
  return maior;
}

export function calculateResultadoDiagnostico(respostas: RespostaItem[]): ResultadoDiagnostico {
  const scoresPorBloco: Record<number, number> = {};
  const totalPorBloco: Record<number, number> = {};

  blocos.forEach((bloco) => {
    scoresPorBloco[bloco.numero] = 0;
    totalPorBloco[bloco.numero] = 0;
  });

  respostas.forEach((resposta) => {
    const itemId = resposta.itemId;
    const blocoId = Number(itemId.split(".")[0]);
    if (!Number.isNaN(blocoId) && blocosPorNumero.has(blocoId)) {
      scoresPorBloco[blocoId] += getNivelPontos(resposta.nivel);
      totalPorBloco[blocoId] += 1;
    }
  });

  const scoresPorBlocoFinal: Record<number, number> = {};

  blocos.forEach((bloco) => {
    const total = totalPorBloco[bloco.numero] || bloco.itens.length;
    const soma = scoresPorBloco[bloco.numero] || 0;
    scoresPorBlocoFinal[bloco.numero] = total > 0 ? Number((soma / total).toFixed(2)) : 0;
  });

  const scoreGeral = Number(
    blocos
      .reduce((acc, bloco) => acc + scoresPorBlocoFinal[bloco.numero] * bloco.peso, 0)
      .toFixed(2)
  );

  return {
    respostas,
    scoresPorBloco: scoresPorBlocoFinal,
    scoreGeral,
    classificacaoMaturidade: classifyMaturidade(scoreGeral),
    classificacaoRisco: classifyRisco(scoreGeral, scoresPorBlocoFinal),
    padraoPredominate: findPadraoPredominante(respostas),
  };
}
