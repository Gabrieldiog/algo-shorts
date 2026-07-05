// O "player": funções puras que dobram a lista de Moves num Frame.
//
// Playback anda 1 passo por vez (aplica só o próximo Move — O(1) por tick).
// Scrub/reset reconstroem do início até o índice pedido — O(k), barato e sempre
// consistente. Só copiamos o array quando um Move realmente o altera.

import type { Frame, Move } from "./types";

export function initialFrame(array: number[]): Frame {
  return {
    array: array.slice(),
    comparing: [],
    swapping: [],
    cursor: null,
    pivot: null,
    range: null,
    sorted: new Set(),
    found: null,
    note: null,
    stats: { comparisons: 0, swaps: 0, writes: 0 },
  };
}

/** Aplica um Move e devolve o próximo Frame (sem mutar o anterior). */
export function applyMove(prev: Frame, move: Move): Frame {
  const mutatesArray = move.t === "swap" || move.t === "overwrite";
  const next: Frame = {
    array: mutatesArray ? prev.array.slice() : prev.array,
    comparing: [],
    swapping: [],
    cursor: prev.cursor,
    pivot: prev.pivot,
    range: prev.range,
    sorted: prev.sorted,
    found: prev.found,
    note: prev.note,
    stats: prev.stats,
  };

  switch (move.t) {
    case "compare":
      next.comparing = [move.i, move.j];
      next.stats = { ...prev.stats, comparisons: prev.stats.comparisons + 1 };
      break;
    case "swap": {
      const t = next.array[move.i];
      next.array[move.i] = next.array[move.j];
      next.array[move.j] = t;
      next.swapping = [move.i, move.j];
      next.stats = { ...prev.stats, swaps: prev.stats.swaps + 1 };
      break;
    }
    case "overwrite":
      next.array[move.i] = move.value;
      next.swapping = [move.i];
      next.stats = { ...prev.stats, writes: prev.stats.writes + 1 };
      break;
    case "markSorted":
      next.sorted = new Set(prev.sorted);
      next.sorted.add(move.i);
      break;
    case "pivot":
      next.pivot = move.i;
      break;
    case "cursor":
      next.cursor = move.i;
      break;
    case "range":
      next.range = [move.from, move.to];
      break;
    case "found":
      next.found = move.i;
      break;
    case "note":
      break;
  }

  if (move.note) next.note = move.note;
  return next;
}

/** Reconstrói o Frame após aplicar os primeiros `steps` moves. */
export function buildFrame(array: number[], moves: Move[], steps: number): Frame {
  let frame = initialFrame(array);
  const upto = Math.max(0, Math.min(steps, moves.length));
  for (let i = 0; i < upto; i++) frame = applyMove(frame, moves[i]);
  return frame;
}
