import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Bucket sort: espalha os elementos em baldes por faixa de valor, ordena cada
// balde e concatena. Bom quando os dados são espalhados de forma uniforme.
export const bucket: SortAlgorithm = {
  slug: "bucket",
  category: "sort",
  stable: true,
  accent: "#fbbf24",
  complexity: { best: "O(n+k)", avg: "O(n+k)", worst: "O(n²)", space: "O(n+k)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];

    let max = 0;
    for (const v of a) if (v > max) max = v;
    const nb = Math.max(1, Math.floor(Math.sqrt(n)));
    const buckets: number[][] = Array.from({ length: nb }, () => []);

    for (let i = 0; i < n; i++) {
      moves.push({ t: "cursor", i, note: { k: "look", v: a[i] } });
      const b = Math.min(nb - 1, Math.floor(((a[i] - 1) / max) * nb));
      buckets[b].push(a[i]);
    }

    let out = 0;
    for (let b = 0; b < nb; b++) {
      buckets[b].sort((x, y) => x - y);
      for (const v of buckets[b]) {
        a[out] = v;
        moves.push({ t: "overwrite", i: out, value: v, note: { k: "setValue", v, i: out } });
        out++;
      }
    }

    for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
