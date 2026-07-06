"use client";

import { useI18n } from "@/lib/i18n";

// Quanto do array ainda esta fora do lugar: sao esses que o proximo salto
// quantico teria que acertar de uma vez. m! e o total de arranjos possiveis
// deles, entao a chance de cair certo (universo sobrevive) e 1/m!.
function outOfPlace(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  let m = 0;
  for (let i = 0; i < arr.length; i++) if (arr[i] !== sorted[i]) m++;
  return m;
}

function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

// texto curto pro numero de arranjos: cheio se pequeno, senao ordem de 10.
function shortBig(x: number): string {
  if (x < 1e6) return Math.round(x).toString();
  return `10^${Math.floor(Math.log10(x))}`;
}

export function QuantumOdds({ array }: { array: number[] }) {
  const { d } = useI18n();
  if (array.length === 0) return null;

  const m = outOfPlace(array);
  const arrangements = factorial(m);
  const digits = arrangements < 10 ? 1 : Math.floor(Math.log10(arrangements)) + 1;
  const pct = m <= 1 ? 100 : 100 / arrangements;
  const pctLabel = m === 0 ? "100%" : pct >= 0.01 ? `${pct >= 10 ? pct.toFixed(0) : pct.toFixed(2)}%` : "≈ 0%";
  const flavor = m <= 1 ? d.quantum.safe : digits <= 6 ? d.quantum.flavor.hope : digits <= 16 ? d.quantum.flavor.lottery : d.quantum.flavor.cosmic;

  return (
    <div className="card border-accent/40 bg-accent/[0.06] p-5">
      <h2 className="font-display text-lg font-bold text-accent">{d.quantum.title}</h2>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-4xl font-extrabold tracking-tight text-ink">{pctLabel}</span>
        {m > 1 && <span className="font-mono text-sm text-muted">{d.quantum.odds(shortBig(arrangements))}</span>}
      </div>
      <p className="mt-2 text-sm font-medium text-ink/80">{flavor}</p>
      <p className="mt-3 border-t border-line/40 pt-3 text-xs leading-relaxed text-muted">{d.quantum.note}</p>
    </div>
  );
}
