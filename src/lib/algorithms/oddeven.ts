import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Odd-Even (brick) sort: alterna passadas comparando pares em índices ímpares e
// depois pares. Foi pensado pra hardware paralelo, onde cada par roda junto.
export const oddeven: SortAlgorithm = {
  slug: "oddeven",
  category: "sort",
  stable: true,
  accent: "#38bdf8",
  complexity: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];
    const swap = (x: number, y: number) => {
      const t = a[x];
      a[x] = a[y];
      a[y] = t;
    };

    let sorted = false;
    while (!sorted) {
      sorted = true;
      for (let i = 1; i + 1 < n; i += 2) {
        moves.push({ t: "compare", i, j: i + 1, note: { k: "compare", a: a[i], b: a[i + 1] } });
        if (a[i] > a[i + 1]) {
          moves.push({ t: "swap", i, j: i + 1, note: { k: "swap", a: a[i], b: a[i + 1] } });
          swap(i, i + 1);
          sorted = false;
        }
      }
      for (let i = 0; i + 1 < n; i += 2) {
        moves.push({ t: "compare", i, j: i + 1, note: { k: "compare", a: a[i], b: a[i + 1] } });
        if (a[i] > a[i + 1]) {
          moves.push({ t: "swap", i, j: i + 1, note: { k: "swap", a: a[i], b: a[i + 1] } });
          swap(i, i + 1);
          sorted = false;
        }
      }
    }

    for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
