import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Sleep sort (piada): cada elemento "dorme" um tempo proporcional ao seu valor
// e acorda na saída. Os menores acordam primeiro, então saem já em ordem.
export const sleep: SortAlgorithm = {
  slug: "sleep",
  category: "sort",
  stable: false,
  accent: "#818cf8",
  complexity: { best: "O(n)", avg: "O(n + max)", worst: "O(n + max)", space: "O(n)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];

    const order = a.slice().sort((x, y) => x - y);
    for (let i = 0; i < n; i++) {
      a[i] = order[i];
      moves.push({ t: "overwrite", i, value: order[i], note: { k: "wake", v: order[i] } });
    }

    for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
