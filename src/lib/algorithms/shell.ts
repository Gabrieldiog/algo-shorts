import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Shell sort: insertion sort com "gaps" que encolhem. Compara elementos
// distantes primeiro, o que joga os fora-do-lugar pra perto do destino cedo.
export const shell: SortAlgorithm = {
  slug: "shell",
  category: "sort",
  stable: false,
  accent: "#8b9bff",
  complexity: { best: "O(n log n)", avg: "O(n^1.5)", worst: "O(n²)", space: "O(1)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < n; i++) {
        let j = i;
        while (j >= gap) {
          moves.push({ t: "compare", i: j - gap, j, note: { k: "compare", a: a[j - gap], b: a[j] } });
          if (a[j - gap] > a[j]) {
            moves.push({ t: "swap", i: j - gap, j, note: { k: "swap", a: a[j - gap], b: a[j] } });
            const t = a[j - gap];
            a[j - gap] = a[j];
            a[j] = t;
            j -= gap;
          } else {
            break;
          }
        }
      }
    }

    for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
