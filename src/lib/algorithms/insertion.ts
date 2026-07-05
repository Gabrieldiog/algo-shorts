import type { Move, SortAlgorithm } from "@/lib/engine/types";

export const insertion: SortAlgorithm = {
  slug: "insertion",
  category: "sort",
  stable: true,
  accent: "#2ee6ff",
  complexity: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];
    moves.push({ t: "markSorted", i: 0 });

    for (let i = 1; i < n; i++) {
      moves.push({ t: "cursor", i, note: { k: "insert", v: a[i] } });
      let j = i;
      while (j > 0) {
        moves.push({ t: "compare", i: j - 1, j, note: { k: "compare", a: a[j - 1], b: a[j] } });
        if (a[j - 1] > a[j]) {
          moves.push({ t: "swap", i: j - 1, j, note: { k: "swap", a: a[j - 1], b: a[j] } });
          const t = a[j - 1];
          a[j - 1] = a[j];
          a[j] = t;
          j--;
        } else {
          moves.push({ t: "note", note: { k: "noswap", a: a[j - 1], b: a[j] } });
          break;
        }
      }
    }

    for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
