import { NextResponse } from "next/server";
import { calculateResultadoDiagnostico } from "@/lib/calculos";
import { generateAIReport } from "@/lib/ai";
import type { RespostaItem } from "@/types/diagnostico";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { respostas: RespostaItem[] };
    if (!body?.respostas) {
      return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 });
    }

    const resultado = calculateResultadoDiagnostico(body.respostas);
    const report = await generateAIReport(body.respostas, resultado);

    return NextResponse.json({ report, resultado });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno" },
      { status: 500 }
    );
  }
}
