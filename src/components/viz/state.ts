import type { Frame } from "@/lib/engine/types";

// cor de um índice pelo seu estado no frame, reaproveitada pelos modos que não
// são barras (pontos e anel). Transitórios primeiro; ordenado depois.
export function markColor(
  frame: Frame,
  i: number,
  comparing: Set<number>,
  swapping: Set<number>,
): { color: string; active: boolean } {
  if (frame.removed.has(i)) return { color: "color-mix(in srgb, var(--color-muted) 30%, transparent)", active: false };
  if (swapping.has(i)) return { color: "var(--color-swap)", active: true };
  if (comparing.has(i)) return { color: "var(--color-compare)", active: true };
  if (frame.sorted.has(i)) return { color: "var(--color-sorted)", active: false };
  if (frame.found === i) return { color: "var(--color-sorted)", active: true };
  if (frame.pivot === i) return { color: "var(--color-pivot)", active: true };
  if (frame.cursor === i) return { color: "var(--color-cursor)", active: true };
  return { color: "var(--color-primary)", active: false };
}
