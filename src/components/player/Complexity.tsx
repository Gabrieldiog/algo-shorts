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

// Tamanhos de lista pra dar escala: mostra quantos passos, mais ou menos, pra
// cada um. E o que faz o O(...) virar numero: quadratico com 1000 itens = 1
// milhao de passos; log com 1000 = uns 10. Ai a diferenca vira concreta.
const SIZES = [10, 100, 1000];
const LOCALE_TAG: Record<string, string> = { pt: "pt-BR", en: "en-US", es: "es-ES" };

function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) {
    r *= i;
    if (!isFinite(r)) return Infinity;
  }
  return r;
}

function opsFor(tier: Tier, n: number, rawAvg: string): number {
  if (rawAvg.includes("∞")) return Infinity;
  switch (tier) {
    case "constant":
      return 1;
    case "log":
      return Math.max(1, Math.ceil(Math.log2(n)));
    case "linear":
      return n;
    case "linearithmic":
      return Math.round(n * Math.log2(n));
    case "quadratic":
      return n * n;
    case "explosive":
      return factorial(n);
  }
}

function fmtOps(v: number, locale: string): string {
  if (!isFinite(v)) return "∞";
  if (v < 100000) return Math.round(v).toLocaleString(LOCALE_TAG[locale] ?? "pt-BR");
  return `10^${Math.floor(Math.log10(v))}`;
}

export function ComplexityCard({ complexity, stable }: { complexity: Complexity; stable?: boolean }) {
  const { d, locale } = useI18n();
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

      <div className="mt-4 rounded-lg border border-line/50 bg-surface-2/30 p-3">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">{d.player.growthTitle}</span>
          <span className="font-mono text-[11px] text-muted">{complexity.avg}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {SIZES.map((n) => (
            <div key={n} className="rounded-md bg-surface/50 py-2">
              <div className="text-[11px] text-muted">{n.toLocaleString(LOCALE_TAG[locale] ?? "pt-BR")} {d.player.items}</div>
              <div className="mt-0.5 font-mono text-base font-bold text-ink">{fmtOps(opsFor(avgTier, n, complexity.avg), locale)}</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-muted">{d.player.growthNote}</p>
      </div>

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
