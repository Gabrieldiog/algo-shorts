import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Gnome sort: anda pra frente; se o par estiver fora de ordem, troca e recua um
// passo, senão avança. Simples como um jardineiro de jardim de gnomos.
export const gnome: SortAlgorithm = {
  slug: "gnome",
  category: "sort",
  stable: true,
  accent: "#f472b6",
  complexity: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];

    let i = 0;
    while (i < n) {
      if (i === 0) {
        i++;
        continue;
      }
      moves.push({ t: "compare", i: i - 1, j: i, note: { k: "compare", a: a[i - 1], b: a[i] } });
      if (a[i - 1] <= a[i]) {
        i++;
      } else {
        moves.push({ t: "swap", i: i - 1, j: i, note: { k: "swap", a: a[i - 1], b: a[i] } });
        const t = a[i - 1];
        a[i - 1] = a[i];
        a[i] = t;
        i--;
      }
    }

    for (let k = 0; k < n; k++) moves.push({ t: "markSorted", i: k });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
