// Registry: plugar um algoritmo novo e escrever a logica e registrar aqui.
// O roster e a vitrine da home; ready reflete o que ja roda.

import type { AlgoCategory, Complexity, SortAlgorithm } from "@/lib/engine/types";
import { bubble } from "./bubble";
import { insertion } from "./insertion";
import { selection } from "./selection";
import { merge } from "./merge";
import { quick } from "./quick";
import { heap } from "./heap";
import { shell } from "./shell";
import { gnome } from "./gnome";
import { cocktail } from "./cocktail";
import { comb } from "./comb";
import { oddeven } from "./oddeven";
import { cycle } from "./cycle";
import { counting } from "./counting";
import { radix } from "./radix";
import { bucket } from "./bucket";
import { pigeonhole } from "./pigeonhole";
import { pancake } from "./pancake";
import { bogo } from "./bogo";
import { stalin } from "./stalin";
import { miracle } from "./miracle";
import { intelligentdesign } from "./intelligentdesign";
import { quantumbogo } from "./quantumbogo";
import { sleep } from "./sleep";
import { timsort } from "./timsort";
import { introsort } from "./introsort";
import { bitonic } from "./bitonic";

export interface RosterEntry {
  slug: string;
  category: AlgoCategory;
  ready: boolean;
  accent: string;
  complexity: Complexity;
  stable?: boolean;
}

const sortImpls: Record<string, SortAlgorithm> = {
  bubble,
  insertion,
  selection,
  merge,
  quick,
  heap,
  shell,
  gnome,
  cocktail,
  comb,
  oddeven,
  cycle,
  counting,
  radix,
  bucket,
  pigeonhole,
  pancake,
  bogo,
  stalin,
  miracle,
  intelligentdesign,
  quantumbogo,
  sleep,
  timsort,
  introsort,
  bitonic,
};

export function getSortAlgorithm(slug: string): SortAlgorithm | undefined {
  return sortImpls[slug];
}

export function isReady(slug: string): boolean {
  return slug in sortImpls;
}

export const roster: RosterEntry[] = [
  // ordenacao
  { slug: "bubble", category: "sort", ready: true, accent: "#5b7fff", stable: true, complexity: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" } },
  { slug: "insertion", category: "sort", ready: true, accent: "#2ee6ff", stable: true, complexity: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" } },
  { slug: "selection", category: "sort", ready: true, accent: "#a984ff", stable: false, complexity: { best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" } },
  { slug: "shell", category: "sort", ready: true, accent: "#8b9bff", stable: false, complexity: { best: "O(n log n)", avg: "O(n^1.5)", worst: "O(n²)", space: "O(1)" } },
  { slug: "gnome", category: "sort", ready: true, accent: "#f472b6", stable: true, complexity: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" } },
  { slug: "cocktail", category: "sort", ready: true, accent: "#22d3ee", stable: true, complexity: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" } },
  { slug: "comb", category: "sort", ready: true, accent: "#4ade80", stable: false, complexity: { best: "O(n log n)", avg: "O(n²/2^p)", worst: "O(n²)", space: "O(1)" } },
  { slug: "oddeven", category: "sort", ready: true, accent: "#38bdf8", stable: true, complexity: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" } },
  { slug: "cycle", category: "sort", ready: true, accent: "#c084fc", stable: false, complexity: { best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" } },
  { slug: "merge", category: "sort", ready: true, accent: "#3ef08a", stable: true, complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)" } },
  { slug: "quick", category: "sort", ready: true, accent: "#ff5ca0", stable: false, complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)" } },
  { slug: "heap", category: "sort", ready: true, accent: "#ffc84d", stable: false, complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)" } },
  { slug: "counting", category: "sort", ready: true, accent: "#60a5fa", stable: true, complexity: { best: "O(n+k)", avg: "O(n+k)", worst: "O(n+k)", space: "O(k)" } },
  { slug: "radix", category: "sort", ready: true, accent: "#34d399", stable: true, complexity: { best: "O(nk)", avg: "O(nk)", worst: "O(nk)", space: "O(n+k)" } },
  { slug: "bucket", category: "sort", ready: true, accent: "#fbbf24", stable: true, complexity: { best: "O(n+k)", avg: "O(n+k)", worst: "O(n²)", space: "O(n+k)" } },
  { slug: "pigeonhole", category: "sort", ready: true, accent: "#f0abfc", stable: true, complexity: { best: "O(n+k)", avg: "O(n+k)", worst: "O(n+k)", space: "O(k)" } },
  { slug: "pancake", category: "sort", ready: true, accent: "#fb923c", stable: false, complexity: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" } },
  { slug: "bogo", category: "sort", ready: true, accent: "#ff6b6b", stable: false, complexity: { best: "O(n)", avg: "O(n·n!)", worst: "∞", space: "O(1)" } },
  { slug: "stalin", category: "sort", ready: true, accent: "#ef4444", stable: false, complexity: { best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(1)" } },
  { slug: "sleep", category: "sort", ready: true, accent: "#818cf8", stable: false, complexity: { best: "O(n)", avg: "O(n+k)", worst: "O(n+k)", space: "O(n)" } },
  { slug: "quantumbogo", category: "sort", ready: true, accent: "#22d3ee", stable: false, complexity: { best: "O(n)", avg: "O(1)", worst: "O(1)", space: "O(1)" } },
  { slug: "miracle", category: "sort", ready: true, accent: "#e879f9", stable: true, complexity: { best: "O(n)", avg: "∞", worst: "∞", space: "O(1)" } },
  { slug: "intelligentdesign", category: "sort", ready: true, accent: "#c4b5fd", stable: true, complexity: { best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(1)" } },
  { slug: "timsort", category: "sort", ready: true, accent: "#2dd4bf", stable: true, complexity: { best: "O(n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)" } },
  { slug: "introsort", category: "sort", ready: true, accent: "#f97316", stable: false, complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(log n)" } },
  { slug: "bitonic", category: "sort", ready: true, accent: "#38bdf8", stable: false, complexity: { best: "O(n log²n)", avg: "O(n log²n)", worst: "O(n log²n)", space: "O(1)" } },
  // busca
  { slug: "linear", category: "search", ready: false, accent: "#38bdf8", complexity: { best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)" } },
  { slug: "binary", category: "search", ready: false, accent: "#a3e635", complexity: { best: "O(1)", avg: "O(log n)", worst: "O(log n)", space: "O(1)" } },
  // pathfinding
  { slug: "bfs", category: "path", ready: false, accent: "#5b7fff", complexity: { best: "O(V+E)", avg: "O(V+E)", worst: "O(V+E)", space: "O(V)" } },
  { slug: "dfs", category: "path", ready: false, accent: "#a984ff", complexity: { best: "O(V+E)", avg: "O(V+E)", worst: "O(V+E)", space: "O(V)" } },
  { slug: "dijkstra", category: "path", ready: false, accent: "#ffc84d", complexity: { best: "O(E log V)", avg: "O(E log V)", worst: "O(E log V)", space: "O(V)" } },
  { slug: "astar", category: "path", ready: false, accent: "#ff5ca0", complexity: { best: "O(E)", avg: "O(E log V)", worst: "O(E log V)", space: "O(V)" } },
];

export const CATEGORIES: AlgoCategory[] = ["sort", "search", "path"];

export function rosterByCategory(cat: AlgoCategory): RosterEntry[] {
  return roster.filter((r) => r.category === cat);
}

export function rosterEntry(slug: string): RosterEntry | undefined {
  return roster.find((r) => r.slug === slug);
}
