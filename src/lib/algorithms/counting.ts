import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Counting sort: conta quantas vezes cada valor aparece e reconstrói o array a
// partir das contagens. Não compara elementos entre si.
export const counting: SortAlgorithm = {
  slug: "counting",
  category: "sort",
  stable: true,
  accent: "#60a5fa",
  complexity: { best: "O(n+k)", avg: "O(n+k)", worst: "O(n+k)", space: "O(k)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];

    let max = 0;
    for (const v of a) if (v > max) max = v;
    const count = new Array(max + 1).fill(0);

    // fase 1: contar (varre lendo cada valor)
    for (let i = 0; i < n; i++) {
      moves.push({ t: "cursor", i, note: { k: "look", v: a[i] } });
      count[a[i]]++;
    }

    // fase 2: escrever de volta em ordem, a partir das contagens
    let out = 0;
    for (let v = 1; v <= max; v++) {
      for (let c = 0; c < count[v]; c++) {
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
