import type { Move, SearchAlgorithm } from "@/lib/engine/types";

// Busca linear: olha elemento por elemento, da esquerda pra direita, até achar o
// alvo ou o array acabar. Funciona em qualquer array.
export const linear: SearchAlgorithm = {
  slug: "linear",
  category: "search",
  accent: "#38bdf8",
  complexity: { best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)" },

  generate(a, target) {
    const moves: Move[] = [{ t: "note", note: { k: "searchStart", target } }];
    for (let i = 0; i < a.length; i++) {
      moves.push({ t: "compare", i, j: i, note: { k: "look", v: a[i] } });
      if (a[i] === target) {
        moves.push({ t: "found", i, note: { k: "found", v: a[i], i } });
        return moves;
      }
    }
    moves.push({ t: "note", note: { k: "notFound", target } });
    return moves;
  },
};
