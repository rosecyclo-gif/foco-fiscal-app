import { notFound } from "next/navigation";

export default function RelatorioPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F1] px-6 py-10 text-[#1C0A00]">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-[#E5D8C7] bg-white p-10 shadow-[0_24px_80px_rgba(28,10,0,0.08)]">
        <h1 className="text-4xl font-semibold">Relatórios</h1>
        <p className="mt-4 text-lg leading-8 text-[#4B3B2D]">
          Esta página é um placeholder para relatórios salvos.
          A integração com Supabase e status de pagamento será adicionada na próxima etapa.
        </p>
      </div>
    </main>
  );
}
