import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Timsort (o de verdade, usado em Python e Java): insertion sort em pedaços
// pequenos ("runs") e depois merge dos runs, dobrando o tamanho a cada rodada.
export const timsort: SortAlgorithm = {
  slug: "timsort",
  category: "sort",
  stable: true,
  accent: "#2dd4bf",
  complexity: { best: "O(n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];
    const RUN = 16;

    const insertion = (lo: number, hi: number) => {
      for (let i = lo + 1; i <= hi; i++) {
        let j = i;
        while (j > lo) {
          moves.push({ t: "compare", i: j - 1, j, note: { k: "compare", a: a[j - 1], b: a[j] } });
          if (a[j - 1] > a[j]) {
            moves.push({ t: "swap", i: j - 1, j, note: { k: "swap", a: a[j - 1], b: a[j] } });
            const t = a[j - 1];
            a[j - 1] = a[j];
            a[j] = t;
            j--;
          } else break;
        }
      }
    };

    const merge = (lo: number, mid: number, hi: number) => {
      moves.push({ t: "range", from: lo, to: hi });
      const left = a.slice(lo, mid + 1);
      const right = a.slice(mid + 1, hi + 1);
      let i = 0;
      let j = 0;
      let k = lo;
      const put = (v: number) => {
        a[k] = v;
        moves.push({ t: "overwrite", i: k, value: v, note: { k: "setValue", v, i: k } });
        k++;
      };
      while (i < left.length && j < right.length) (left[i] <= right[j] ? put(left[i++]) : put(right[j++]));
      while (i < left.length) put(left[i++]);
      while (j < right.length) put(right[j++]);
    };

    for (let lo = 0; lo < n; lo += RUN) insertion(lo, Math.min(lo + RUN - 1, n - 1));
    for (let width = RUN; width < n; width *= 2) {
      for (let lo = 0; lo < n; lo += 2 * width) {
        const mid = Math.min(lo + width - 1, n - 1);
        const hi = Math.min(lo + 2 * width - 1, n - 1);
        if (mid < hi) merge(lo, mid, hi);
      }
    }

    for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
