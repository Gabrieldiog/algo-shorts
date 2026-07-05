import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Cocktail (shaker) sort: bubble sort que vai e volta. Numa passada empurra o
// maior pro fim; na volta, puxa o menor pro começo.
export const cocktail: SortAlgorithm = {
  slug: "cocktail",
  category: "sort",
  stable: true,
  accent: "#22d3ee",
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

    let lo = 0;
    let hi = n - 1;
    let swapped = true;
    while (swapped && lo < hi) {
      swapped = false;
      for (let j = lo; j < hi; j++) {
        moves.push({ t: "compare", i: j, j: j + 1, note: { k: "compare", a: a[j], b: a[j + 1] } });
        if (a[j] > a[j + 1]) {
          moves.push({ t: "swap", i: j, j: j + 1, note: { k: "swap", a: a[j], b: a[j + 1] } });
          swap(j, j + 1);
          swapped = true;
        }
      }
      moves.push({ t: "markSorted", i: hi });
      hi--;
      if (!swapped) break;
      swapped = false;
      for (let j = hi; j > lo; j--) {
        moves.push({ t: "compare", i: j - 1, j, note: { k: "compare", a: a[j - 1], b: a[j] } });
        if (a[j - 1] > a[j]) {
          moves.push({ t: "swap", i: j - 1, j, note: { k: "swap", a: a[j - 1], b: a[j] } });
          swap(j - 1, j);
          swapped = true;
        }
      }
      moves.push({ t: "markSorted", i: lo });
      lo++;
    }

    for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
