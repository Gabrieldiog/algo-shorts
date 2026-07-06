import { cellKey, neighbors, reconstruct, type GridSpec, type PathAlgorithm, type PathStep } from "./grid";

// extrai o índice do menor valor numa lista (fila de prioridade simples; a grade
// é pequena, então uma busca linear já dá conta).
function popMin<T>(pq: [number, T][]): T {
  let mi = 0;
  for (let i = 1; i < pq.length; i++) if (pq[i][0] < pq[mi][0]) mi = i;
  return pq.splice(mi, 1)[0][1];
}

function bfsGen(g: GridSpec): PathStep[] {
  const steps: PathStep[] = [];
  const startK = cellKey(g.start[0], g.start[1]);
  const endK = cellKey(g.end[0], g.end[1]);
  const q: [number, number][] = [g.start];
  const seen = new Set([startK]);
  const prev = new Map<string, string>();
  steps.push({ t: "frontier", k: startK });
  let found = false;
  while (q.length) {
    const [r, c] = q.shift()!;
    const k = cellKey(r, c);
    steps.push({ t: "visit", k });
    if (k === endK) {
      found = true;
      break;
    }
    for (const [nr, nc] of neighbors(r, c, g)) {
      const nk = cellKey(nr, nc);
      if (!seen.has(nk)) {
        seen.add(nk);
        prev.set(nk, k);
        q.push([nr, nc]);
        steps.push({ t: "frontier", k: nk });
      }
    }
  }
  if (found) steps.push(...reconstruct(prev, endK, startK));
  return steps;
}

function dfsGen(g: GridSpec): PathStep[] {
  const steps: PathStep[] = [];
  const startK = cellKey(g.start[0], g.start[1]);
  const endK = cellKey(g.end[0], g.end[1]);
  const stack: [number, number][] = [g.start];
  const seen = new Set<string>();
  const prev = new Map<string, string>();
  steps.push({ t: "frontier", k: startK });
  let found = false;
  while (stack.length) {
    const [r, c] = stack.pop()!;
    const k = cellKey(r, c);
    if (seen.has(k)) continue;
    seen.add(k);
    steps.push({ t: "visit", k });
    if (k === endK) {
      found = true;
      break;
    }
    for (const [nr, nc] of neighbors(r, c, g)) {
      const nk = cellKey(nr, nc);
      if (!seen.has(nk)) {
        if (!prev.has(nk)) prev.set(nk, k);
        stack.push([nr, nc]);
        steps.push({ t: "frontier", k: nk });
      }
    }
  }
  if (found) steps.push(...reconstruct(prev, endK, startK));
  return steps;
}

function dijkstraGen(g: GridSpec): PathStep[] {
  const steps: PathStep[] = [];
  const startK = cellKey(g.start[0], g.start[1]);
  const endK = cellKey(g.end[0], g.end[1]);
  const dist = new Map<string, number>([[startK, 0]]);
  const prev = new Map<string, string>();
  const seen = new Set<string>();
  const pq: [number, [number, number]][] = [[0, g.start]];
  steps.push({ t: "frontier", k: startK });
  let found = false;
  while (pq.length) {
    const [r, c] = popMin(pq);
    const k = cellKey(r, c);
    if (seen.has(k)) continue;
    seen.add(k);
    steps.push({ t: "visit", k });
    if (k === endK) {
      found = true;
      break;
    }
    const d = dist.get(k) ?? Infinity;
    for (const [nr, nc] of neighbors(r, c, g)) {
      const nk = cellKey(nr, nc);
      const nd = d + 1;
      if (nd < (dist.get(nk) ?? Infinity)) {
        dist.set(nk, nd);
        prev.set(nk, k);
        pq.push([nd, [nr, nc]]);
        steps.push({ t: "frontier", k: nk });
      }
    }
  }
  if (found) steps.push(...reconstruct(prev, endK, startK));
  return steps;
}

function astarGen(g: GridSpec): PathStep[] {
  const steps: PathStep[] = [];
  const startK = cellKey(g.start[0], g.start[1]);
  const endK = cellKey(g.end[0], g.end[1]);
  const [er, ec] = g.end;
  const h = (r: number, c: number) => Math.abs(r - er) + Math.abs(c - ec);
  const gscore = new Map<string, number>([[startK, 0]]);
  const prev = new Map<string, string>();
  const seen = new Set<string>();
  const pq: [number, [number, number]][] = [[h(g.start[0], g.start[1]), g.start]];
  steps.push({ t: "frontier", k: startK });
  let found = false;
  while (pq.length) {
    const [r, c] = popMin(pq);
    const k = cellKey(r, c);
    if (seen.has(k)) continue;
    seen.add(k);
    steps.push({ t: "visit", k });
    if (k === endK) {
      found = true;
      break;
    }
    const gc = gscore.get(k) ?? Infinity;
    for (const [nr, nc] of neighbors(r, c, g)) {
      const nk = cellKey(nr, nc);
      const ng = gc + 1;
      if (ng < (gscore.get(nk) ?? Infinity)) {
        gscore.set(nk, ng);
        prev.set(nk, k);
        pq.push([ng + h(nr, nc), [nr, nc]]);
        steps.push({ t: "frontier", k: nk });
      }
    }
  }
  if (found) steps.push(...reconstruct(prev, endK, startK));
  return steps;
}

export const bfs: PathAlgorithm = { slug: "bfs", category: "path", accent: "#5b7fff", complexity: { best: "O(V+E)", avg: "O(V+E)", worst: "O(V+E)", space: "O(V)" }, generate: bfsGen };
export const dfs: PathAlgorithm = { slug: "dfs", category: "path", accent: "#a984ff", complexity: { best: "O(V+E)", avg: "O(V+E)", worst: "O(V+E)", space: "O(V)" }, generate: dfsGen };
export const dijkstra: PathAlgorithm = { slug: "dijkstra", category: "path", accent: "#ffc84d", complexity: { best: "O(E log V)", avg: "O(E log V)", worst: "O(E log V)", space: "O(V)" }, generate: dijkstraGen };
export const astar: PathAlgorithm = { slug: "astar", category: "path", accent: "#ff5ca0", complexity: { best: "O(E)", avg: "O(E log V)", worst: "O(E log V)", space: "O(V)" }, generate: astarGen };
