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
  { slug: "merge", category: "sort", ready: true, accent: "#3ef08a", stable: true, complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)" } },
  { slug: "quick", category: "sort", ready: true, accent: "#ff5ca0", stable: false, complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)" } },
  { slug: "heap", category: "sort", ready: true, accent: "#ffc84d", stable: false, complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)" } },
  { slug: "counting", category: "sort", ready: false, accent: "#60a5fa", stable: true, complexity: { best: "O(n+k)", avg: "O(n+k)", worst: "O(n+k)", space: "O(k)" } },
  { slug: "radix", category: "sort", ready: false, accent: "#34d399", stable: true, complexity: { best: "O(nk)", avg: "O(nk)", worst: "O(nk)", space: "O(n+k)" } },
  { slug: "pancake", category: "sort", ready: false, accent: "#fb923c", stable: false, complexity: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" } },
  { slug: "bogo", category: "sort", ready: false, accent: "#ff6b6b", stable: false, complexity: { best: "O(n)", avg: "O(n·n!)", worst: "∞", space: "O(1)" } },
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
