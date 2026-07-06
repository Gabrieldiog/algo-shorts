import type { Frame } from "@/lib/engine/types";

// Mesmas barras, mas a cor codifica o valor (matiz). Ordenar vira um degradê:
// dá pra "ver" a ordenação acontecer pela cor, não só pela altura.
export function Rainbow({ frame, max }: { frame: Frame; max: number }) {
  const comparing = new Set(frame.comparing);
  const swapping = new Set(frame.swapping);

  return (
    <div className="flex h-full w-full items-end justify-center gap-[2px]">
      {frame.array.map((v, i) => {
        const active = swapping.has(i) || comparing.has(i);
        const hue = (v / max) * 285;
        const light = frame.sorted.has(i) ? 62 : 54;
        return (
          <div
            key={i}
            className="min-w-0 flex-1 rounded-t-[3px]"
            style={{
              height: `${(v / max) * 100}%`,
              background: `hsl(${hue} 88% ${light}%)`,
              boxShadow: active ? "0 0 14px 1px #fff" : undefined,
              outline: active ? "2px solid rgba(255,255,255,0.9)" : undefined,
              transition: "height 90ms linear, box-shadow 90ms linear",
            }}
          />
        );
      })}
    </div>
  );
}
