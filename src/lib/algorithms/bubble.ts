import type { Move, SortAlgorithm } from "@/lib/engine/types";

// Bubble sort: compara vizinhos e troca quando estão fora de ordem. A cada
// passada o maior elemento "borbulha" pro fim — daí o nome. Ineficiente, mas é
// o "hello world" da visualização: dá pra ler o algoritmo inteiro com os olhos.
export const bubble: SortAlgorithm = {
  slug: "bubble",
  category: "sort",
  stable: true,
  accent: "var(--color-primary)",
  complexity: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },

  generate(input) {
    const a = input.slice();
    const n = a.length;
    const moves: Move[] = [{ t: "note", note: { k: "start", n } }];

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      moves.push({ t: "note", note: { k: "pass", n: i + 1 } });
      for (let j = 0; j < n - 1 - i; j++) {
        moves.push({ t: "compare", i: j, j: j + 1, note: { k: "compare", a: a[j], b: a[j + 1] } });
        if (a[j] > a[j + 1]) {
          moves.push({ t: "swap", i: j, j: j + 1, note: { k: "swap", a: a[j], b: a[j + 1] } });
          const t = a[j];
          a[j] = a[j + 1];
          a[j + 1] = t;
          swapped = true;
        } else {
          moves.push({ t: "note", note: { k: "noswap", a: a[j], b: a[j + 1] } });
        }
      }
      // o maior da rodada travou no fim
      moves.push({ t: "markSorted", i: n - 1 - i, note: { k: "markSorted", v: a[n - 1 - i] } });
      if (!swapped) break; // nenhuma troca = já está ordenado
    }

    // varredura verde final: acende tudo da esquerda pra direita (o clímax)
    for (let i = 0; i < n; i++) moves.push({ t: "markSorted", i });
    moves.push({ t: "note", note: { k: "done" } });
    return moves;
  },
};
