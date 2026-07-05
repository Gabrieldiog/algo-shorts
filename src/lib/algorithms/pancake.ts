import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Pancake sort: a única operação permitida é virar um prefixo do array, como
// virar o topo de uma pilha de panquecas. Traz o maior pro topo e vira pro fim.
export const pancake: SortAlgorithm = {
  slug: "pancake",
  category: "sort",
  stable: false,
  accent: "#fb923c",
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
    const flip = (k: number) => {
      moves.push({ t: "note", note: { k: "flip", n: k + 1 } });
      let i = 0;
      let j = k;
      while (i < j) {
        moves.push({ t: "swap", i, j, note: { k: "swap", a: a[i], b: a[j] } });
        swap(i, j);
        i++;
        j--;
      }
    };

    for (let size = n; size > 1; size--) {
      let maxIdx = 0;
      for (let i = 1; i < size; i++) {
        moves.push({ t: "compare", i: maxIdx, j: i, note: { k: "compare", a: a[maxIdx], b: a[i] } });
        if (a[i] > a[maxIdx]) maxIdx = i;
      }
      if (maxIdx !== size - 1) {
        if (maxIdx !== 0) flip(maxIdx);
        flip(size - 1);
      }
      moves.push({ t: "markSorted", i: size - 1, note: { k: "markSorted", v: a[size - 1] } });
    }

    for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
