import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Miracle sort (piada): checa se já está ordenado e, se não estiver, não faz
// nada — só espera um milagre. Spoiler: o milagre não vem.
export const miracle: SortAlgorithm = {
  slug: "miracle",
  category: "sort",
  stable: true,
  accent: "#e879f9",
  complexity: { best: "O(n)", avg: "O(∞)", worst: "O(∞)", space: "O(1)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];

    for (let pass = 0; pass < 2; pass++) {
      let sorted = true;
      for (let i = 0; i + 1 < n; i++) {
        moves.push({ t: "compare", i, j: i + 1, note: { k: "compare", a: a[i], b: a[i + 1] } });
        if (a[i] > a[i + 1]) sorted = false;
      }
      if (sorted) {
        for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
        moves.push({ t: "note", note: { k: "done" } });
        return moves;
      }
      moves.push({ t: "note", note: { k: "miracle" } });
    }

    moves.push({ t: "note", note: { k: "miracle" } });
    return moves;
  },
};
