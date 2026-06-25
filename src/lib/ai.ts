import { OpenAI } from "openai";
import type { RespostaItem, ResultadoDiagnostico, NivelResposta } from "@/types/diagnostico";
import { blocos } from "@/lib/diagnosticoData";

function buildResponseSummary(respostas: RespostaItem) {
  const bloco = Number(respostas.itemId.split(".")[0]);
  return `Item ${respostas.itemId} (bloco ${bloco}): ${respostas.nivel}`;
}

export function buildDiagnosticPrompt(respostas: RespostaItem[], resultado: ResultadoDiagnostico) {
  const resumoRespostas = respostas.map(buildResponseSummary).join("\n");
  const blocosTexto = blocos
    .map(
      (bloco) =>
        `Bloco ${bloco.numero} - ${bloco.tema} (peso ${bloco.peso}): ${bloco.critico ? "crítico" : "não crítico"}`
    )
    .join("\n");

  return `Você é um assistente de conformidade fiscal e trabalhista. Use a metodologia investigativa do projeto FOCO FISCAL.

Regras de cruzamento obrigatórias:
- Bloco 1 × Bloco 5: verifique contradição entre inventário documentado e participação sem registro.
- Bloco 1 × Bloco 6: compare documentação declarada com capacidade de apresentação em fiscalização.
- Bloco 2 × Bloco 3: verifique se riscos psicossociais identificados têm liderança e política adequadas.
- Bloco 2 × Bloco 1: confirme se avaliação psicossocial tem metodologia documentada.
- Bloco 3 × Bloco 4: confira coerência entre políticas de saúde mental e prevenção ao assédio.
- Bloco 4 × Bloco 5: avalie se a comunicação chega aos trabalhadores.
- Bloco 5 × Bloco 6: compare participação com consistência nos registros e no eSocial.

${blocosTexto}

Scores do diagnóstico:
- Score geral: ${resultado.scoreGeral}
- Maturidade: ${resultado.classificacaoMaturidade}
- Risco: ${resultado.classificacaoRisco}
- Padrão predominante: ${resultado.padraoPredominate}

Respostas:
${resumoRespostas}

Gere um relatório investigativo curto, objetivo e com linguagem formal. Destaque:
1. principais riscos identificados;
2. contradições entre blocos quando presentes;
3. recomendações rápidas de melhoria.
`;
}

export async function generateAIReport(respostas: RespostaItem[], resultado: ResultadoDiagnostico) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return "OpenAI API key não configurada. Defina OPENAI_API_KEY no ambiente do servidor.";
  }

  const client = new OpenAI({ apiKey });
  const prompt = buildDiagnosticPrompt(respostas, resultado);

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Você é um assistente especialista em auditoria trabalhista e riscos psicossociais.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 900,
  });

  return completion.choices?.[0]?.message?.content?.trim() ?? "Não foi possível gerar o relatório de IA.";
}

/**
 * Generate a report from raw responses and resultado object
 * Used by the database integration for saving reports
 */
export async function generateReport(
  responses: Record<string, any>,
  resultado: Record<string, any>
): Promise<string | null> {
  try {
    // Convert responses to RespostaItem array format
    // Handle both array and object formats
    const respostaItems: RespostaItem[] = [];
    
    if (Array.isArray(responses)) {
      // If it's already an array of RespostaItem
      respostaItems.push(...(responses as RespostaItem[]));
    } else {
      // If it's an object, convert to array
      for (const [key, value] of Object.entries(responses)) {
        respostaItems.push({
          itemId: key,
          nivel: value as unknown as NivelResposta,
        });
      }
    }

    // Convert resultado to ResultadoDiagnostico format
    const resultadoObj: ResultadoDiagnostico = {
      respostas: respostaItems,
      scoreGeral: resultado.scoreGeral ?? 0,
      classificacaoMaturidade: resultado.classificacaoMaturidade ?? "Indefinida",
      classificacaoRisco: resultado.classificacaoRisco ?? "Indefinido",
      padraoPredominate: resultado.padraoPredominate ?? "Indefinido",
      scoresPorBloco: resultado.scoresPorBloco ?? {},
    };

    return await generateAIReport(respostaItems, resultadoObj);
  } catch (error) {
    console.error("Error generating report:", error);
    return null;
  }
}
