import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Intelligent Design sort (piada): verifica a ordem atual e declara que, seja
// qual for, foi assim de propósito. Reordenar seria questionar o design.
export const intelligentdesign: SortAlgorithm = {
  slug: "intelligentdesign",
  category: "sort",
  stable: true,
  accent: "#c4b5fd",
  complexity: { best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(1)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];

    let sorted = true;
    for (let i = 0; i + 1 < n; i++) {
      moves.push({ t: "compare", i, j: i + 1, note: { k: "compare", a: a[i], b: a[i + 1] } });
      if (a[i] > a[i + 1]) sorted = false;
    }
    moves.push({ t: "note", note: { k: "designed" } });
    if (sorted) for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    return moves;
  },
};
