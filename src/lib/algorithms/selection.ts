import type { Move, SortAlgorithm } from "@/lib/engine/types";

export const selection: SortAlgorithm = {
  slug: "selection",
  category: "sort",
  stable: false,
  accent: "#a984ff",
  complexity: { best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];

    for (let i = 0; i < n - 1; i++) {
      let min = i;
      moves.push({ t: "cursor", i, note: { k: "selectMin", v: a[min] } });
      for (let j = i + 1; j < n; j++) {
        moves.push({ t: "compare", i: min, j, note: { k: "compare", a: a[min], b: a[j] } });
        if (a[j] < a[min]) {
          min = j;
          moves.push({ t: "cursor", i: min, note: { k: "selectMin", v: a[min] } });
        }
      }
      if (min !== i) {
        moves.push({ t: "swap", i, j: min, note: { k: "swap", a: a[min], b: a[i] } });
        const t = a[i];
        a[i] = a[min];
        a[min] = t;
      }
      moves.push({ t: "markSorted", i, note: { k: "markSorted", v: a[i] } });
    }

    for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
