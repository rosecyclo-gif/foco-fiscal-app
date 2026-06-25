"use client";

import { useMemo, useState, useEffect } from "react";
import { blocos, niveisResposta } from "@/lib/diagnosticoData";
import type { NivelResposta } from "@/types/diagnostico";
import { calculateResultadoDiagnostico } from "@/lib/calculos";
import { saveDiagnostico, generateAndSaveRelatorio } from "@/lib/database";

const initialRespostas = blocos.flatMap((bloco) =>
  bloco.itens.map((item) => ({ itemId: item.id, nivel: 0 as NivelResposta }))
);

export default function DiagnosticoPage() {
  const [respostas, setRespostas] = useState(initialRespostas);
  const [report, setReport] = useState<string | null>(null);
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

  const resultado = useMemo(
    () => calculateResultadoDiagnostico(respostas),
    [respostas]
  );

  function handleSelect(itemId: string, nivel: NivelResposta) {
    setRespostas((current) =>
      current.map((resposta) =>
        resposta.itemId === itemId ? { ...resposta, nivel } : resposta
      )
    );
  }

  function handleSetEmail() {
    if (emailInput.trim()) {
      setUserEmail(emailInput);
      localStorage.setItem("userEmail", emailInput);
    }
  }

  async function handleSubmit() {
    if (!userEmail) {
      setError("Por favor, insira seu email antes de continuar");
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      // First, save the diagnostic to database
      const diagnostico = await saveDiagnostico(userEmail, respostas, resultado);
      if (!diagnostico || !diagnostico.id) {
        throw new Error("Falha ao salvar diagnóstico");
      }

      // Then, generate and save the report
      const relatorio = await generateAndSaveRelatorio(
        diagnostico.id,
        userEmail
      );
      if (!relatorio) {
        throw new Error("Falha ao gerar relatório");
      }

      setReport(relatorio.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] px-6 py-10 text-[#1C0A00]">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 rounded-[28px] border border-[#E5D8C7] bg-white/95 p-8 shadow-[0_24px_80px_rgba(28,10,0,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#B8860B]">
            Diagnóstico
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">
            Preencha os níveis de resposta para cada item
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#4B3B2D]">
            Use a escala de 4 níveis para indicar o grau de conformidade de cada item.
            Após enviar, a IA gera um relatório investigativo com análise de contradições.
          </p>

          {/* Email Input Section */}
          <div className="mt-6 rounded-2xl bg-[#F7EFE3] p-4">
            <label className="block text-sm font-semibold text-[#1C0A00]">
              Seu Email (para salvar relatório)
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
                  Confirmar
                </button>
              )}
              {userEmail && (
                <button
                  type="button"
                  onClick={() => {
                    setUserEmail("");
                    setEmailInput("");
                    localStorage.removeItem("userEmail");
                  }}
                  className="rounded-xl bg-[#99714C] px-6 py-2 font-semibold text-white hover:bg-[#7A5838]"
                >
                  Mudar
                </button>
              )}
            </div>
            {userEmail && (
              <p className="mt-2 text-sm text-green-700">
                ✓ Email confirmado: {userEmail}
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#F7EFE3] p-4">
              <p className="font-semibold">Score geral</p>
              <p className="text-3xl font-bold">{resultado.scoreGeral.toFixed(2)}</p>
            </div>
            <div className="rounded-2xl bg-[#F7EFE3] p-4">
              <p className="font-semibold">Classificação de risco</p>
              <p className="text-3xl font-bold">{resultado.classificacaoRisco}</p>
            </div>
          </div>
        </header>

        <section className="grid gap-6">
          {blocos.map((bloco) => (
            <div key={bloco.numero} className="rounded-[28px] border border-[#E5D8C7] bg-white p-6 shadow-[0_16px_40px_rgba(28,10,0,0.05)]">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
                    Bloco {bloco.numero}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">{bloco.tema}</h2>
                </div>
                <span className="rounded-full border border-[#B8860B] px-3 py-1 text-sm font-semibold text-[#B8860B]">
                  {bloco.critico ? "Crítico" : "Não crítico"}
                </span>
              </div>
              <div className="space-y-5">
                {bloco.itens.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-[#E8D8C0] bg-[#FBF6F0] p-5">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#99714C]">Item {item.id}</p>
                        <p className="mt-2 text-lg font-semibold">{item.titulo}</p>
                        <p className="mt-2 text-sm leading-6 text-[#4B3B2D]">{item.perguntaPrincipal}</p>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-4">
                      {niveisResposta.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleSelect(item.id, option.value)}
                          className={`rounded-2xl border px-3 py-3 text-left transition hover:border-[#B8860B] hover:bg-[#F4E6C6] ${
                            respostas.find((r) => r.itemId === item.id)?.nivel === option.value
                              ? "border-[#B8860B] bg-[#F4E6C6]"
                              : "border-transparent bg-white"
                          }`}
                        >
                          <p className="font-semibold">{option.label}</p>
                          <p className="mt-1 text-sm text-[#4B3B2D]">{option.value} pontos</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !userEmail}
            className="inline-flex items-center justify-center rounded-full bg-[#B8860B] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#A4750A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Gerando relatório..." : "Gerar relatório IA"}
          </button>
          <p className="text-sm text-[#4B3B2D]">
            {!userEmail
              ? "Insira seu email acima para gerar e salvar o relatório"
              : "Após gerar, o relatório será salvo e exibido abaixo."}
          </p>
        </div>

        {error ? (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        ) : null}

        {report ? (
          <section className="mt-10 rounded-[28px] border border-[#E5D8C7] bg-white p-8 shadow-[0_16px_40px_rgba(28,10,0,0.05)]">
            <h2 className="text-2xl font-semibold">Relatório gerado pela IA</h2>
            <div className="mt-4 whitespace-pre-line text-[#4B3B2D]">{report}</div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
