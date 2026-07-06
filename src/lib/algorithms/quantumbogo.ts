import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Quantum Bogo sort (piada de CS): embaralha uma vez. Se não caiu ordenado,
// destrói o universo — assim, em algum universo, ele acertou de primeira.
export const quantumbogo: SortAlgorithm = {
  slug: "quantumbogo",
  category: "sort",
  stable: false,
  accent: "#22d3ee",
  complexity: { best: "O(n)", avg: "O(1)", worst: "O(1)", space: "O(1)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }, { t: "note", note: { k: "shuffle" } }];

    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      if (j !== i) {
        moves.push({ t: "swap", i, j, note: { k: "swap", a: a[i], b: a[j] } });
        const t = a[i];
        a[i] = a[j];
        a[j] = t;
      }
    }

    let sorted = true;
    for (let i = 0; i + 1 < n; i++) {
      moves.push({ t: "compare", i, j: i + 1, note: { k: "compare", a: a[i], b: a[i + 1] } });
      if (a[i] > a[i + 1]) sorted = false;
    }

    if (sorted) {
      for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
      moves.push({ t: "note", note: { k: "done" } });
      return moves;
    }

    moves.push({ t: "note", note: { k: "universe" } });
    for (let i = 0; i < n; i++) moves.push({ t: "remove", i });
    return moves;
  },
};
