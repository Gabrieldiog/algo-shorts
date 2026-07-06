"use client";

import type { Complexity } from "@/lib/engine/types";
import { useI18n } from "@/lib/i18n";

// O que a notacao O(...) quer dizer em ritmo de crescimento. Classificamos a
// string num "tier" pra explicar em palavras, sem o leitor precisar decorar
// Big-O. A ordem de checagem importa: do mais grave pro mais leve.
export type Tier = "constant" | "log" | "linear" | "linearithmic" | "quadratic" | "explosive";

export function tierOf(raw: string): Tier {
  const t = raw.replace(/\s/g, "").toLowerCase();
  if (t.includes("∞") || t.includes("!")) return "explosive";
  if (/(^|[^/])2\^/.test(t)) return "explosive"; // 2^n (mas nao n²/2^p)
  if (t.includes("n²") || t.includes("n^2") || t.includes("n^1.5")) return "quadratic";
  if (t.includes("log")) {
    if (/n.?log/.test(t) || /e.?log/.test(t) || t.includes("log²")) return "linearithmic";
    return "log";
  }
  if (t === "o(1)") return "constant";
  return "linear";
}

const TIER_TONE: Record<Tier, string> = {
  constant: "bg-sorted",
  log: "bg-sorted",
  linear: "bg-primary",
  linearithmic: "bg-accent",
  quadratic: "bg-amber-400",
  explosive: "bg-erro",
};

export function ComplexityCard({ complexity, stable }: { complexity: Complexity; stable?: boolean }) {
  const { d } = useI18n();
  const avgTier = tierOf(complexity.avg);
  const spaceTier = tierOf(complexity.space);

  return (
    <div className="card p-5">
      <h2 className="font-display text-lg font-bold">{d.player.complexity}</h2>
      <p className="mb-4 mt-1 text-xs leading-relaxed text-muted">{d.player.complexityIntro}</p>
      <div className="grid grid-cols-2 gap-3">
        <Cell label={d.player.best} value={complexity.best} />
        <Cell label={d.player.avg} value={complexity.avg} highlight />
        <Cell label={d.player.worst} value={complexity.worst} />
        <Cell label={d.player.space} value={complexity.space} />
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <Meaning term={d.player.inTime} tier={avgTier} text={d.complexityTiers[avgTier].time} />
        <Meaning term={d.player.inMemory} tier={spaceTier} text={d.complexityTiers[spaceTier].space} />
      </dl>

      {stable !== undefined && (
        <p className="mt-4 border-t border-line/50 pt-3 text-sm text-muted">
          {d.player.stability}: <span className="text-ink">{stable ? d.home.stable : d.home.unstable}</span>
        </p>
      )}
    </div>
  );
}

function Cell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  const { d } = useI18n();
  const tier = tierOf(value);
  return (
    <div className={`rounded-lg border p-3 ${highlight ? "border-primary/40 bg-primary/5" : "border-line/60"}`}>
      <div className="text-[11px] uppercase tracking-wide text-muted">{label}</div>
      <div className={`mt-0.5 font-mono text-lg font-semibold ${highlight ? "text-primary" : "text-ink"}`}>{value}</div>
      <div className="mt-1 flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${TIER_TONE[tier]}`} />
        <span className="text-[11px] text-muted">{d.complexityTiers[tier].name}</span>
      </div>
    </div>
  );
}

function Meaning({ term, tier, text }: { term: string; tier: Tier; text: string }) {
  return (
    <div className="flex gap-2">
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TIER_TONE[tier]}`} />
      <p className="leading-relaxed text-muted">
        <span className="font-semibold text-ink">{term}:</span> {text}
      </p>
    </div>
  );
}
