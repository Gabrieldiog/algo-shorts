import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Bitonic sort: uma rede de ordenação feita de comparações fixas, pensada pra
// rodar em paralelo (GPU). Esta versão lida com qualquer tamanho, não só potência de 2.
export const bitonic: SortAlgorithm = {
  slug: "bitonic",
  category: "sort",
  stable: false,
  accent: "#38bdf8",
  complexity: { best: "O(n log²n)", avg: "O(n log²n)", worst: "O(n log²n)", space: "O(1)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];
    const swap = (x: number, y: number) => {
      const t = a[x];
      a[x] = a[y];
      a[y] = t;
    };
    const compareExchange = (i: number, j: number, dir: boolean) => {
      moves.push({ t: "compare", i, j, note: { k: "compare", a: a[i], b: a[j] } });
      if (a[i] > a[j] === dir) {
        moves.push({ t: "swap", i, j, note: { k: "swap", a: a[i], b: a[j] } });
        swap(i, j);
      }
    };
    const powBelow = (m: number) => {
      let k = 1;
      while (k < m) k <<= 1;
      return k >> 1;
    };
    const merge = (lo: number, cnt: number, dir: boolean) => {
      if (cnt <= 1) return;
      const m = powBelow(cnt);
      for (let i = lo; i < lo + cnt - m; i++) compareExchange(i, i + m, dir);
      merge(lo, m, dir);
      merge(lo + m, cnt - m, dir);
    };
    const sort = (lo: number, cnt: number, dir: boolean) => {
      if (cnt <= 1) return;
      const m = Math.floor(cnt / 2);
      sort(lo, m, !dir);
      sort(lo + m, cnt - m, dir);
      merge(lo, cnt, dir);
    };

    sort(0, n, true);
    for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
