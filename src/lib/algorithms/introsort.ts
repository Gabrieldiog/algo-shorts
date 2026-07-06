import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Introsort (usado no std::sort do C++): começa como quicksort, cai pra
// heapsort se a recursão fica funda demais e usa insertion nos pedaços pequenos.
export const introsort: SortAlgorithm = {
  slug: "introsort",
  category: "sort",
  stable: false,
  accent: "#f97316",
  complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(log n)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];
    const swap = (x: number, y: number) => {
      const t = a[x];
      a[x] = a[y];
      a[y] = t;
    };
    const SMALL = 16;
    const maxDepth = 2 * Math.floor(Math.log2(Math.max(2, n)));

    const insertion = (lo: number, hi: number) => {
      for (let i = lo + 1; i <= hi; i++) {
        let j = i;
        while (j > lo) {
          moves.push({ t: "compare", i: j - 1, j, note: { k: "compare", a: a[j - 1], b: a[j] } });
          if (a[j - 1] > a[j]) {
            moves.push({ t: "swap", i: j - 1, j, note: { k: "swap", a: a[j - 1], b: a[j] } });
            swap(j - 1, j);
            j--;
          } else break;
        }
      }
    };

    const siftDown = (lo: number, start: number, hi: number) => {
      let root = start;
      while (true) {
        let largest = root;
        const l = lo + 2 * (root - lo) + 1;
        const r = l + 1;
        if (l <= hi) {
          moves.push({ t: "compare", i: largest, j: l, note: { k: "compare", a: a[largest], b: a[l] } });
          if (a[l] > a[largest]) largest = l;
        }
        if (r <= hi) {
          moves.push({ t: "compare", i: largest, j: r, note: { k: "compare", a: a[largest], b: a[r] } });
          if (a[r] > a[largest]) largest = r;
        }
        if (largest === root) break;
        moves.push({ t: "swap", i: root, j: largest, note: { k: "swap", a: a[root], b: a[largest] } });
        swap(root, largest);
        root = largest;
      }
    };

    const heapsort = (lo: number, hi: number) => {
      const size = hi - lo + 1;
      for (let i = lo + Math.floor(size / 2) - 1; i >= lo; i--) siftDown(lo, i, hi);
      for (let end = hi; end > lo; end--) {
        moves.push({ t: "swap", i: lo, j: end, note: { k: "swap", a: a[lo], b: a[end] } });
        swap(lo, end);
        siftDown(lo, lo, end - 1);
      }
    };

    const partition = (lo: number, hi: number): number => {
      const pivot = a[hi];
      moves.push({ t: "pivot", i: hi, note: { k: "pivot", v: pivot } });
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

    const run = (lo: number, hi: number, depth: number) => {
      if (lo >= hi) return;
      if (hi - lo + 1 <= SMALL) {
        insertion(lo, hi);
        return;
      }
      if (depth === 0) {
        heapsort(lo, hi);
        return;
      }
      const p = partition(lo, hi);
      run(lo, p - 1, depth - 1);
      run(p + 1, hi, depth - 1);
    };

    run(0, n - 1, maxDepth);
    for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
