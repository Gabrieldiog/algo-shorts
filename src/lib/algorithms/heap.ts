import type { Move, SortAlgorithm } from "@/lib/engine/types";

export const heap: SortAlgorithm = {
  slug: "heap",
  category: "sort",
  stable: false,
  accent: "#ffc84d",
  complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];

    const swap = (x: number, y: number) => {
      const t = a[x];
      a[x] = a[y];
      a[y] = t;
    };

    const siftDown = (start: number, size: number) => {
      let root = start;
      while (true) {
        let largest = root;
        const l = 2 * root + 1;
        const r = 2 * root + 2;
        if (l < size) {
          moves.push({ t: "compare", i: largest, j: l, note: { k: "compare", a: a[largest], b: a[l] } });
          if (a[l] > a[largest]) largest = l;
        }
        if (r < size) {
          moves.push({ t: "compare", i: largest, j: r, note: { k: "compare", a: a[largest], b: a[r] } });
          if (a[r] > a[largest]) largest = r;
        }
        if (largest === root) break;
        moves.push({ t: "swap", i: root, j: largest, note: { k: "swap", a: a[largest], b: a[root] } });
        swap(root, largest);
        root = largest;
      }
    };

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(i, n);
    for (let end = n - 1; end > 0; end--) {
      moves.push({ t: "swap", i: 0, j: end, note: { k: "swap", a: a[0], b: a[end] } });
      swap(0, end);
      moves.push({ t: "markSorted", i: end, note: { k: "markSorted", v: a[end] } });
      siftDown(0, end);
    }

    for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
