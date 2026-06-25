import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F6F1] text-[#1C0A00]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <section className="rounded-[32px] border border-[#E5D8C7] bg-white/90 p-12 shadow-[0_24px_80px_rgba(28,10,0,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#B8860B]">
            FOCO FISCAL®
          </p>
          <h1 className="mt-6 text-5xl font-semibold leading-tight">
            Diagnóstico investigativo de exposição fiscal-trabalhista
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4B3B2D]">
            Mapa rápido de conformidade com NR-1 e riscos psicossociais.
            Integra IA, banco e pagamento no fluxo inicial do produto.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-[#B8860B] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#A4750A]"
              href="/diagnostico"
            >
              Iniciar diagnóstico
            </Link>
            <Link
              className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-[#B8860B] px-6 py-4 text-sm font-semibold text-[#1C0A00] transition hover:bg-[#F4E6C6]"
              href="/relatorio"
            >
              Ver relatório
            </Link>
          </div>
          <div className="mt-10 rounded-3xl bg-[#F7EFE3] p-6">
            <h2 className="text-xl font-semibold">Próximos passos</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[#4B3B2D]">
              <li>Configurar OpenAI em <code className="rounded bg-white px-2 py-0.5">.env.local</code></li>
              <li>Executar <code className="rounded bg-white px-2 py-0.5">npm install</code> e <code className="rounded bg-white px-2 py-0.5">npm run dev</code></li>
              <li>Testar geração de relatório e depois integrar Supabase/Hotmart</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
