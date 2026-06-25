export type NivelResposta = 100 | 60 | 25 | 0;
export type SubitemLetra = "a" | "b" | "c" | "d" | "e" | "f" | "g";

export interface Subitem {
  letra: SubitemLetra;
  funcao: string;
  texto: string;
  ehComprometedora: boolean;
}

export interface ItemDiagnostico {
  id: string;
  bloco: number;
  titulo: string;
  perguntaPrincipal: string;
  subitens: Subitem[];
}

export interface Bloco {
  numero: number;
  tema: string;
  peso: number;
  critico: boolean;
  itens: ItemDiagnostico[];
}

export interface RespostaItem {
  itemId: string;
  nivel: NivelResposta;
}

export interface ResultadoDiagnostico {
  respostas: RespostaItem[];
  scoresPorBloco: Record<number, number>;
  scoreGeral: number;
  classificacaoMaturidade: string;
  classificacaoRisco: string;
  padraoPredominate: "A" | "B" | "C" | "D";
}
