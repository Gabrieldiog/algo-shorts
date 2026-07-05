import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Radix sort (LSD): ordena dígito por dígito, do menos ao mais significativo.
// Cada passada é uma distribuição estável por dígito; o array reordena e assenta.
export const radix: SortAlgorithm = {
  slug: "radix",
  category: "sort",
  stable: true,
  accent: "#34d399",
  complexity: { best: "O(nk)", avg: "O(nk)", worst: "O(nk)", space: "O(n+k)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];

    let max = 0;
    for (const v of a) if (v > max) max = v;

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      const output = new Array<number>(n);
      const count = new Array(10).fill(0);
      for (let i = 0; i < n; i++) {
        moves.push({ t: "cursor", i, note: { k: "look", v: a[i] } });
        count[Math.floor(a[i] / exp) % 10]++;
      }
      for (let d = 1; d < 10; d++) count[d] += count[d - 1];
      for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(a[i] / exp) % 10;
        output[--count[digit]] = a[i];
      }
      for (let i = 0; i < n; i++) {
        a[i] = output[i];
        moves.push({ t: "overwrite", i, value: a[i], note: { k: "setValue", v: a[i], i } });
      }
    }

    for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
