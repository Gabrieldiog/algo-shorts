import type { Complexity } from "@/lib/engine/types";

// A grade do pathfinding. Mesma filosofia da engine de ordenação, só que 2D:
// cada algoritmo devolve uma lista de passos e o player os aplica num Frame.

export interface GridSpec {
  rows: number;
  cols: number;
  walls: Set<string>;
  start: [number, number];
  end: [number, number];
}

export type PathStep =
  | { t: "frontier"; k: string } // entrou na fila de espera
  | { t: "visit"; k: string } // foi explorado
  | { t: "path"; k: string }; // faz parte do caminho final

export interface PathFrame {
  visited: Set<string>;
  frontier: Set<string>;
  path: Set<string>;
  visitedCount: number;
  pathLen: number;
  reached: boolean;
}

export const cellKey = (r: number, c: number): string => `${r},${c}`;

export function emptyPathFrame(): PathFrame {
  return { visited: new Set(), frontier: new Set(), path: new Set(), visitedCount: 0, pathLen: 0, reached: false };
}

export function applyPathStep(prev: PathFrame, s: PathStep): PathFrame {
  const next: PathFrame = { ...prev };
  if (s.t === "frontier") {
    next.frontier = new Set(prev.frontier);
    next.frontier.add(s.k);
  } else if (s.t === "visit") {
    next.visited = new Set(prev.visited);
    next.visited.add(s.k);
    next.frontier = new Set(prev.frontier);
    next.frontier.delete(s.k);
    next.visitedCount = prev.visitedCount + 1;
  } else {
    next.path = new Set(prev.path);
    next.path.add(s.k);
    next.pathLen = prev.pathLen + 1;
    next.reached = true;
  }
  return next;
}

export function buildPathFrame(steps: PathStep[], upto: number): PathFrame {
  let f = emptyPathFrame();
  const n = Math.max(0, Math.min(upto, steps.length));
  for (let i = 0; i < n; i++) f = applyPathStep(f, steps[i]);
  return f;
}

export interface PathAlgorithm {
  slug: string;
  category: "path";
  complexity: Complexity;
  accent: string;
  generate: (grid: GridSpec) => PathStep[];
}

const DIRS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
] as const;

export function neighbors(r: number, c: number, g: GridSpec): [number, number][] {
  const out: [number, number][] = [];
  for (const [dr, dc] of DIRS) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < g.rows && nc >= 0 && nc < g.cols && !g.walls.has(cellKey(nr, nc))) out.push([nr, nc]);
  }
  return out;
}

export function reconstruct(prev: Map<string, string>, endK: string, startK: string): PathStep[] {
  const path: PathStep[] = [];
  let cur: string | undefined = endK;
  while (cur && cur !== startK) {
    path.push({ t: "path", k: cur });
    cur = prev.get(cur);
  }
  path.push({ t: "path", k: startK });
  return path.reverse();
}
