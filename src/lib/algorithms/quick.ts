import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Quicksort com partição de Lomuto: o pivô é o último elemento da faixa.
export const quick: SortAlgorithm = {
  slug: "quick",
  category: "sort",
  stable: false,
  accent: "#ff5ca0",
  complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];

    const swap = (x: number, y: number) => {
      const t = a[x];
      a[x] = a[y];
      a[y] = t;
    };

    const part = (lo: number, hi: number): number => {
      const pivot = a[hi];
      moves.push({ t: "pivot", i: hi, note: { k: "pivot", v: pivot } });
      moves.push({ t: "range", from: lo, to: hi });
      let i = lo;
      for (let j = lo; j < hi; j++) {
        moves.push({ t: "compare", i: j, j: hi, note: { k: "compare", a: a[j], b: pivot } });
        if (a[j] < pivot) {
          if (i !== j) {
            moves.push({ t: "swap", i, j, note: { k: "swap", a: a[j], b: a[i] } });
            swap(i, j);
          }
          i++;
        }
      }
      if (i !== hi) {
        moves.push({ t: "swap", i, j: hi, note: { k: "swap", a: a[hi], b: a[i] } });
        swap(i, hi);
      }
      return i;
    };

    const sort = (lo: number, hi: number) => {
      if (lo > hi) return;
      if (lo === hi) {
        moves.push({ t: "markSorted", i: lo });
        return;
      }
      const p = part(lo, hi);
      moves.push({ t: "markSorted", i: p, note: { k: "markSorted", v: a[p] } });
      sort(lo, p - 1);
      sort(p + 1, hi);
    };

    sort(0, n - 1);
    for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
