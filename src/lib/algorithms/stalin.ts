import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Stalin sort (piada): percorre a lista e elimina qualquer elemento fora de
// ordem em vez de reorganizar. No fim "está ordenado" — só que faltando gente.
export const stalin: SortAlgorithm = {
  slug: "stalin",
  category: "sort",
  stable: false,
  accent: "#ef4444",
  complexity: { best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(1)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];
    if (n === 0) {
      moves.push({ t: "note", note: { k: "done" } });
      return moves;
    }

    let lastKept = 0;
    moves.push({ t: "markSorted", i: 0 });
    for (let i = 1; i < n; i++) {
      moves.push({ t: "compare", i: lastKept, j: i, note: { k: "compare", a: a[lastKept], b: a[i] } });
      if (a[i] >= a[lastKept]) {
        moves.push({ t: "markSorted", i, note: { k: "markSorted", v: a[i] } });
        lastKept = i;
      } else {
        moves.push({ t: "remove", i, note: { k: "eliminate", v: a[i] } });
      }
    }
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
