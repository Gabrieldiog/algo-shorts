import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Pigeonhole sort: um escaninho pra cada valor possível. Joga cada elemento no
// seu escaninho e depois esvazia os escaninhos em ordem. Primo do counting.
export const pigeonhole: SortAlgorithm = {
  slug: "pigeonhole",
  category: "sort",
  stable: true,
  accent: "#f0abfc",
  complexity: { best: "O(n+k)", avg: "O(n+k)", worst: "O(n+k)", space: "O(k)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];

    let min = Infinity;
    let max = -Infinity;
    for (const v of a) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
    const holes = new Array(max - min + 1).fill(0);

    for (let i = 0; i < n; i++) {
      moves.push({ t: "cursor", i, note: { k: "look", v: a[i] } });
      holes[a[i] - min]++;
    }

    let out = 0;
    for (let h = 0; h < holes.length; h++) {
      for (let c = 0; c < holes[h]; c++) {
        a[out] = h + min;
        moves.push({ t: "overwrite", i: out, value: h + min, note: { k: "setValue", v: h + min, i: out } });
        out++;
      }
    }

    for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
