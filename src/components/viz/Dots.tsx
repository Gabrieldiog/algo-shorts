import type { Frame } from "@/lib/engine/types";
import { markColor } from "./state";

// Dispersão: x é o índice, y é o valor. Ordenado, os pontos formam a diagonal.
export function Dots({ frame, max }: { frame: Frame; max: number }) {
  const n = frame.array.length;
  const comparing = new Set(frame.comparing);
  const swapping = new Set(frame.swapping);
  const size = Math.max(4, Math.min(12, 460 / n));

  return (
    <div className="relative h-full w-full">
      {frame.array.map((v, i) => {
        const x = n > 1 ? (i / (n - 1)) * 100 : 50;
        const y = (1 - v / max) * 100;
        const { color, active } = markColor(frame, i, comparing, swapping);
        return (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              background: color,
              boxShadow: active ? `0 0 10px 1px ${color}` : undefined,
              transition: "left 120ms linear, top 120ms linear, background 120ms linear",
            }}
          />
        );
      })}
    </div>
  );
}
