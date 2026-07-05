import type { Frame } from "@/lib/engine/types";

export function Bars({ frame, max }: { frame: Frame; max: number }) {
  const comparing = new Set(frame.comparing);
  const swapping = new Set(frame.swapping);

  return (
    <div className="flex h-full w-full items-end justify-center gap-[2px]">
      {frame.array.map((v, i) => {
        const { background, glow } = barStyle(frame, i, comparing, swapping);
        return (
          <div
            key={i}
            className="min-w-0 flex-1 rounded-t-[3px]"
            style={{
              height: `${(v / max) * 100}%`,
              background,
              boxShadow: glow ? `0 0 14px -2px ${glow}` : undefined,
              transition: "height 90ms linear, background 90ms linear, box-shadow 90ms linear",
            }}
          />
        );
      })}
    </div>
  );
}

function barStyle(frame: Frame, i: number, comparing: Set<number>, swapping: Set<number>) {
  if (frame.sorted.has(i)) return solid("--color-sorted");
  if (swapping.has(i)) return solid("--color-swap");
  if (comparing.has(i)) return solid("--color-compare");
  if (frame.pivot === i) return solid("--color-pivot");
  if (frame.cursor === i) return solid("--color-cursor");
  if (frame.found === i) return solid("--color-sorted");
  return { background: "linear-gradient(180deg, var(--color-primary-2), var(--color-primary))", glow: null as string | null };
}

function solid(varName: string) {
  return { background: `var(${varName})`, glow: `var(${varName})` as string | null };
}
