import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Bogo sort: embaralha o array e torce pra ter caído ordenado. Repete. Aqui tem
// um teto de tentativas (senão nunca acaba) — batendo o teto, ele desiste e
// ordena de verdade, admitindo a derrota.
export const bogo: SortAlgorithm = {
  slug: "bogo",
  category: "sort",
  stable: false,
  accent: "#ff6b6b",
  complexity: { best: "O(n)", avg: "O(n·n!)", worst: "∞", space: "O(1)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];
    const swap = (x: number, y: number) => {
      const t = a[x];
      a[x] = a[y];
      a[y] = t;
    };
    const checkSorted = (): boolean => {
      for (let i = 0; i + 1 < n; i++) {
        moves.push({ t: "compare", i, j: i + 1, note: { k: "compare", a: a[i], b: a[i + 1] } });
        if (a[i] > a[i + 1]) return false;
      }
      return true;
    };

    const cap = 40;
    let attempts = 0;
    let sorted = checkSorted();
    while (!sorted && attempts < cap) {
      attempts++;
      moves.push({ t: "note", note: { k: "shuffle" } });
      for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        if (j !== i) {
          moves.push({ t: "swap", i, j, note: { k: "swap", a: a[i], b: a[j] } });
          swap(i, j);
        }
      }
      sorted = checkSorted();
    }

    if (!sorted) {
      moves.push({ t: "note", note: { k: "giveUp" } });
      const s = a.slice().sort((x, y) => x - y);
      for (let i = 0; i < n; i++) {
        if (a[i] !== s[i]) {
          a[i] = s[i];
          moves.push({ t: "overwrite", i, value: s[i], note: { k: "setValue", v: s[i], i } });
        }
      }
    }

    for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
