import { NextResponse } from "next/server";
import type { HotmartWebhookPayload } from "@/lib/payments";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as HotmartWebhookPayload;

    // Implementar verificação de assinatura e persistência real no Supabase.
    const event = payload.event || "unknown";

    return NextResponse.json({ status: "ok", event });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno" },
      { status: 500 }
    );
  }
}
