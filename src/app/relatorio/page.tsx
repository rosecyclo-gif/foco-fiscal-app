"use client";

import { useEffect, useState } from "react";
import { getUserRelatorios, Relatorio } from "@/lib/database";

export default function RelatorioPage() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [emailInput, setEmailInput] = useState("");

  // Load user email from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setUserEmail(savedEmail);
      setEmailInput(savedEmail);
    }
  }, []);

  // Load relatorios when email is set
  useEffect(() => {
    if (userEmail) {
      loadRelatorios();
    }
  }, [userEmail]);

  async function loadRelatorios() {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserRelatorios(userEmail);
      setRelatorios(data);
      if (data.length === 0) {
        setError("Nenhum relatório encontrado para este email");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar relatórios"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSetEmail() {
    if (emailInput.trim()) {
      setUserEmail(emailInput);
      localStorage.setItem("userEmail", emailInput);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] px-6 py-10 text-[#1C0A00]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 rounded-[28px] border border-[#E5D8C7] bg-white/95 p-8 shadow-[0_24px_80px_rgba(28,10,0,0.08)]">
          <h1 className="text-4xl font-semibold">Meus Relatórios</h1>
          <p className="mt-4 text-base leading-7 text-[#4B3B2D]">
            Aqui você encontra todos os relatórios salvos. Cada relatório foi
            gerado com análise de IA com base em suas respostas.
          </p>

          {/* Email Input Section */}
          <div className="mt-6 rounded-2xl bg-[#F7EFE3] p-4">
            <label className="block text-sm font-semibold text-[#1C0A00]">
              Seu Email (para buscar relatórios)
            </label>
            <div className="mt-3 flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="seu.email@exemplo.com"
                disabled={userEmail !== ""}
                className="flex-1 rounded-xl border border-[#D4BFA6] bg-white px-4 py-2 text-[#1C0A00] placeholder-[#99714C] disabled:bg-[#E8DCC8]"
              />
              {userEmail === "" && (
                <button
                  type="button"
                  onClick={handleSetEmail}
                  className="rounded-xl bg-[#B8860B] px-6 py-2 font-semibold text-white hover:bg-[#A4750A]"
                >
                  Buscar
                </button>
              )}
              {userEmail && (
                <button
                  type="button"
                  onClick={() => {
                    setUserEmail("");
                    setEmailInput("");
                    setRelatorios([]);
                    localStorage.removeItem("userEmail");
                  }}
                  className="rounded-xl bg-[#99714C] px-6 py-2 font-semibold text-white hover:bg-[#7A5838]"
                >
                  Limpar
                </button>
              )}
            </div>
            {userEmail && (
              <p className="mt-2 text-sm text-green-700">
                ✓ Buscando relatórios para: {userEmail}
              </p>
            )}
          </div>
        </header>

        {loading && (
          <div className="rounded-[28px] border border-[#E5D8C7] bg-white p-8 text-center">
            <p className="text-[#4B3B2D]">Carregando relatórios...</p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-red-700">
            {error}
          </div>
        )}

        {relatorios.length > 0 && (
          <section className="grid gap-6">
            {relatorios.map((relatorio) => (
              <div
                key={relatorio.id}
                className="rounded-[28px] border border-[#E5D8C7] bg-white p-8 shadow-[0_16px_40px_rgba(28,10,0,0.05)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
                      Relatório
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">
                      ID: {relatorio.id?.substring(0, 8)}...
                    </h2>
                    <p className="mt-2 text-sm text-[#99714C]">
                      Gerado em{" "}
                      {new Date(
                        relatorio.generated_at || ""
                      ).toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl bg-[#F7EFE3] p-4">
                  <div className="max-h-96 overflow-y-auto whitespace-pre-wrap text-sm leading-7 text-[#4B3B2D]">
                    {relatorio.content}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {!loading && relatorios.length === 0 && !error && userEmail && (
          <div className="rounded-[28px] border border-[#E5D8C7] bg-white p-8 text-center">
            <p className="text-[#4B3B2D]">
              Nenhum relatório encontrado. Crie um novo em{" "}
              <a href="/diagnostico" className="font-semibold text-[#B8860B]">
                Diagnóstico
              </a>
              .
            </p>
          </div>
        )}

        {!userEmail && !loading && (
          <div className="rounded-[28px] border border-[#E5D8C7] bg-white p-8 text-center">
            <p className="text-[#4B3B2D]">
              Insira seu email acima para visualizar seus relatórios.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
