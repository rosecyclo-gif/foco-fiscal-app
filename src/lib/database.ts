import { supabase } from "./supabaseClient";
import { generateReport } from "./ai";

export interface Diagnostico {
  id?: string;
  user_email: string;
  responses: Record<string, any>;
  resultado: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
}

export interface Relatorio {
  id?: string;
  diagnostico_id: string;
  user_email: string;
  content: string;
  content_html?: string;
  generated_at?: string;
  metadata?: Record<string, any>;
}

/**
 * Save a diagnostic result to the database
 */
export async function saveDiagnostico(
  userEmail: string,
  responses: Record<string, any>,
  resultado: Record<string, any>
): Promise<Diagnostico | null> {
  try {
    const { data, error } = await supabase
      .from("diagnosticos")
      .insert([
        {
          user_email: userEmail,
          responses,
          resultado,
          metadata: {
            userAgent: typeof window !== "undefined" ? navigator.userAgent : "",
            timestamp: new Date().toISOString(),
          },
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error saving diagnostico:", error);
      return null;
    }

    return data as Diagnostico;
  } catch (error) {
    console.error("Exception saving diagnostico:", error);
    return null;
  }
}

/**
 * Get all diagnosticos for a user
 */
export async function getUserDiagnosticos(
  userEmail: string
): Promise<Diagnostico[]> {
  try {
    const { data, error } = await supabase
      .from("diagnosticos")
      .select("*")
      .eq("user_email", userEmail)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching diagnosticos:", error);
      return [];
    }

    return data as Diagnostico[];
  } catch (error) {
    console.error("Exception fetching diagnosticos:", error);
    return [];
  }
}

/**
 * Get a single diagnostico
 */
export async function getDiagnostico(id: string): Promise<Diagnostico | null> {
  try {
    const { data, error } = await supabase
      .from("diagnosticos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching diagnostico:", error);
      return null;
    }

    return data as Diagnostico;
  } catch (error) {
    console.error("Exception fetching diagnostico:", error);
    return null;
  }
}

/**
 * Generate and save a report for a diagnostico
 */
export async function generateAndSaveRelatorio(
  diagnosticoId: string,
  userEmail: string
): Promise<Relatorio | null> {
  try {
    // Get the diagnostico
    const diagnostico = await getDiagnostico(diagnosticoId);
    if (!diagnostico) {
      console.error("Diagnostico not found");
      return null;
    }

    // Generate report using AI
    const reportContent = await generateReport(
      diagnostico.responses,
      diagnostico.resultado
    );

    if (!reportContent) {
      console.error("Failed to generate report content");
      return null;
    }

    // Save to database
    const { data, error } = await supabase
      .from("relatorios")
      .insert([
        {
          diagnostico_id: diagnosticoId,
          user_email: userEmail,
          content: reportContent,
          metadata: {
            generated_at: new Date().toISOString(),
          },
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error saving relatorio:", error);
      return null;
    }

    return data as Relatorio;
  } catch (error) {
    console.error("Exception generating and saving relatorio:", error);
    return null;
  }
}

/**
 * Get all relatorios for a user
 */
export async function getUserRelatorios(
  userEmail: string
): Promise<Relatorio[]> {
  try {
    const { data, error } = await supabase
      .from("relatorios")
      .select("*")
      .eq("user_email", userEmail)
      .order("generated_at", { ascending: false });

    if (error) {
      console.error("Error fetching relatorios:", error);
      return [];
    }

    return data as Relatorio[];
  } catch (error) {
    console.error("Exception fetching relatorios:", error);
    return [];
  }
}

/**
 * Get a single relatorio
 */
export async function getRelatorio(id: string): Promise<Relatorio | null> {
  try {
    const { data, error } = await supabase
      .from("relatorios")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching relatorio:", error);
      return null;
    }

    return data as Relatorio;
  } catch (error) {
    console.error("Exception fetching relatorio:", error);
    return null;
  }
}

/**
 * Get relatorio by diagnostico ID
 */
export async function getRelatorioByDiagnosticoId(
  diagnosticoId: string
): Promise<Relatorio | null> {
  try {
    const { data, error } = await supabase
      .from("relatorios")
      .select("*")
      .eq("diagnostico_id", diagnosticoId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows found" error
      console.error("Error fetching relatorio:", error);
    }

    return data ? (data as Relatorio) : null;
  } catch (error) {
    console.error("Exception fetching relatorio:", error);
    return null;
  }
}
