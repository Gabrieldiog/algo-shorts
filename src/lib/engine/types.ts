// -----------------------------------------------------------------------------
// A engine — o coração do projeto. Separa a LÓGICA do algoritmo da RENDERIZAÇÃO.
//
// Cada algoritmo é um "conector" com o mesmo contrato (mesma filosofia do
// Balcão): recebe uma entrada e devolve uma lista de `Move` — eventos atômicos
// (comparar, trocar, marcar). O player aplica esses eventos num único array de
// trabalho, então nunca guardamos N cópias do array: escala pra centenas de
// barras e milhares de passos sem estourar memória.
//
// Cada Move carrega uma `Note` estruturada (chave + valores). Quem traduz a Note
// pra fala do personagem é a camada de i18n — a engine não conhece idioma.
// -----------------------------------------------------------------------------

/** Fala estruturada do personagem. A i18n vira isto em PT/EN/ES. */
export type Note =
  | { k: "start"; n: number }
  | { k: "pass"; n: number }
  | { k: "compare"; a: number; b: number }
  | { k: "swap"; a: number; b: number }
  | { k: "noswap"; a: number; b: number }
  | { k: "setValue"; v: number; i: number }
  | { k: "markSorted"; v: number }
  | { k: "pivot"; v: number }
  | { k: "selectMin"; v: number }
  | { k: "insert"; v: number }
  | { k: "done" }
  // busca
  | { k: "searchStart"; target: number }
  | { k: "look"; v: number }
  | { k: "tooLow"; v: number; target: number }
  | { k: "tooHigh"; v: number; target: number }
  | { k: "found"; v: number; i: number }
  | { k: "notFound"; target: number };

/** Evento atômico que o player aplica ao array de trabalho. */
export type Move =
  | { t: "compare"; i: number; j: number; note?: Note }
  | { t: "swap"; i: number; j: number; note?: Note }
  | { t: "overwrite"; i: number; value: number; note?: Note } // escrita direta (merge, shell)
  | { t: "markSorted"; i: number; note?: Note }
  | { t: "pivot"; i: number; note?: Note }
  | { t: "cursor"; i: number; note?: Note } // ponteiro (busca, inserção)
  | { t: "range"; from: number; to: number; note?: Note } // subfaixa ativa
  | { t: "found"; i: number; note?: Note } // achou (busca)
  | { t: "note"; note: Note }; // só narração, sem mudança visual

/** Estatísticas acumuladas ao longo da execução. */
export interface Stats {
  comparisons: number;
  swaps: number;
  writes: number;
}

/** O estado visível num instante — o que a viz desenha. */
export interface Frame {
  array: number[];
  comparing: number[]; // transitório: só o frame atual
  swapping: number[]; // transitório
  cursor: number | null;
  pivot: number | null;
  range: [number, number] | null;
  sorted: Set<number>;
  found: number | null;
  note: Note | null;
  stats: Stats;
}

export type AlgoCategory = "sort" | "search" | "path";

export interface Complexity {
  best: string;
  avg: string;
  worst: string;
  space: string;
}

/** Metadados + lógica de um algoritmo de ordenação. */
export interface SortAlgorithm {
  slug: string;
  category: "sort";
  complexity: Complexity;
  stable: boolean;
  /** cor de destaque do card (var CSS ou hex) */
  accent: string;
  /** recebe o array e devolve a trilha de eventos */
  generate: (input: number[]) => Move[];
}
