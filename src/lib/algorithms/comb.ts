import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Comb sort: bubble com um gap que encolhe (fator 1.3). O gap grande mata as
// "tartarugas" (valores pequenos presos no fim) que travam o bubble.
export const comb: SortAlgorithm = {
  slug: "comb",
  category: "sort",
  stable: false,
  accent: "#4ade80",
  complexity: { best: "O(n log n)", avg: "O(n²/2^p)", worst: "O(n²)", space: "O(1)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];

    let gap = n;
    let swapped = true;
    while (gap > 1 || swapped) {
      gap = Math.floor(gap / 1.3);
      if (gap < 1) gap = 1;
      swapped = false;
      for (let i = 0; i + gap < n; i++) {
        moves.push({ t: "compare", i, j: i + gap, note: { k: "compare", a: a[i], b: a[i + gap] } });
        if (a[i] > a[i + gap]) {
          moves.push({ t: "swap", i, j: i + gap, note: { k: "swap", a: a[i], b: a[i + gap] } });
          const t = a[i];
          a[i] = a[i + gap];
          a[i + gap] = t;
          swapped = true;
        }
      }
    }

    for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
