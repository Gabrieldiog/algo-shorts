import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Cycle sort: minimiza escritas. Pra cada posição, conta quantos elementos são
// menores pra achar o destino final e escreve o valor direto lá, seguindo os
// ciclos da permutação. Assume valores distintos (é sempre o caso aqui).
export const cycle: SortAlgorithm = {
  slug: "cycle",
  category: "sort",
  stable: false,
  accent: "#c084fc",
  complexity: { best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];

    for (let cs = 0; cs < n - 1; cs++) {
      let item = a[cs];
      moves.push({ t: "cursor", i: cs });
      let pos = cs;
      for (let i = cs + 1; i < n; i++) {
        moves.push({ t: "compare", i, j: cs, note: { k: "compare", a: a[i], b: item } });
        if (a[i] < item) pos++;
      }
      if (pos === cs) continue;

      let tmp = a[pos];
      a[pos] = item;
      item = tmp;
      moves.push({ t: "overwrite", i: pos, value: a[pos], note: { k: "setValue", v: a[pos], i: pos } });

      while (pos !== cs) {
        pos = cs;
        for (let i = cs + 1; i < n; i++) {
          moves.push({ t: "compare", i, j: cs, note: { k: "compare", a: a[i], b: item } });
          if (a[i] < item) pos++;
        }
        tmp = a[pos];
        a[pos] = item;
        item = tmp;
        moves.push({ t: "overwrite", i: pos, value: a[pos], note: { k: "setValue", v: a[pos], i: pos } });
      }
    }

    for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
