import type { Move, SortAlgorithm } from "@/lib/engine/types";

export const merge: SortAlgorithm = {
  slug: "merge",
  category: "sort",
  stable: true,
  accent: "#3ef08a",
  complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];

    const sort = (lo: number, hi: number) => {
      if (hi - lo <= 1) return;
      const mid = (lo + hi) >> 1;
      sort(lo, mid);
      sort(mid, hi);

      moves.push({ t: "range", from: lo, to: hi - 1 });
      const left = a.slice(lo, mid);
      const right = a.slice(mid, hi);
      let i = 0;
      let j = 0;
      let k = lo;
      while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
          a[k] = left[i];
          moves.push({ t: "overwrite", i: k, value: left[i], note: { k: "setValue", v: left[i], i: k } });
          i++;
        } else {
          a[k] = right[j];
          moves.push({ t: "overwrite", i: k, value: right[j], note: { k: "setValue", v: right[j], i: k } });
          j++;
        }
        k++;
      }
      while (i < left.length) {
        a[k] = left[i];
        moves.push({ t: "overwrite", i: k, value: left[i], note: { k: "setValue", v: left[i], i: k } });
        i++;
        k++;
      }
      while (j < right.length) {
        a[k] = right[j];
        moves.push({ t: "overwrite", i: k, value: right[j], note: { k: "setValue", v: right[j], i: k } });
        j++;
        k++;
      }
    };

    sort(0, n);
    for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
