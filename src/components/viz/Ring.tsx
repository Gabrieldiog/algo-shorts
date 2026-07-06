import type { Frame } from "@/lib/engine/types";
import { markColor } from "./state";

// Anel: cada elemento é um raio saindo do centro; o índice vira o ângulo e o
// valor vira o comprimento. Ordenado, forma uma espiral limpa.
export function Ring({ frame, max }: { frame: Frame; max: number }) {
  const n = frame.array.length;
  const comparing = new Set(frame.comparing);
  const swapping = new Set(frame.swapping);
  const size = 340;
  const c = size / 2;
  const inner = size * 0.13;
  const outer = size * 0.47;
  const width = Math.max(1.5, (2 * Math.PI * outer) / n / 1.6);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full max-h-full w-auto" style={{ maxWidth: "100%" }}>
      {frame.array.map((v, i) => {
        const ang = (i / n) * 2 * Math.PI - Math.PI / 2;
        const r = inner + (v / max) * (outer - inner);
        const x2 = c + Math.cos(ang) * r;
        const y2 = c + Math.sin(ang) * r;
        const { color, active } = markColor(frame, i, comparing, swapping);
        return (
          <line
            key={i}
            x1={c}
            y1={c}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={width}
            strokeLinecap="round"
            style={{ filter: active ? `drop-shadow(0 0 4px ${color})` : undefined }}
          />
        );
      })}
    </svg>
  );
}
