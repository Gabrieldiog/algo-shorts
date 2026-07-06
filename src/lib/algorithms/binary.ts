import type { Move, SearchAlgorithm } from "@/lib/engine/types";

// Busca binária: no array ordenado, olha o meio da faixa; se o alvo é maior,
// descarta a metade de baixo, se é menor, a de cima. Corta o problema pela metade
// a cada passo.
export const binary: SearchAlgorithm = {
  slug: "binary",
  category: "search",
  accent: "#a3e635",
  complexity: { best: "O(1)", avg: "O(log n)", worst: "O(log n)", space: "O(1)" },

  generate(a, target) {
    const moves: Move[] = [{ t: "note", note: { k: "searchStart", target } }];
    let lo = 0;
    let hi = a.length - 1;
    while (lo <= hi) {
      moves.push({ t: "range", from: lo, to: hi });
      const mid = (lo + hi) >> 1;
      moves.push({ t: "compare", i: mid, j: mid, note: { k: "look", v: a[mid] } });
      if (a[mid] === target) {
        moves.push({ t: "found", i: mid, note: { k: "found", v: a[mid], i: mid } });
        return moves;
      }
      if (a[mid] < target) {
        moves.push({ t: "note", note: { k: "tooLow", v: a[mid], target } });
        lo = mid + 1;
      } else {
        moves.push({ t: "note", note: { k: "tooHigh", v: a[mid], target } });
        hi = mid - 1;
      }
    }
    moves.push({ t: "note", note: { k: "notFound", target } });
    return moves;
  },
};
