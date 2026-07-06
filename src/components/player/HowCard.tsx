"use client";

import { useI18n } from "@/lib/i18n";

// "Como funciona": o paragrafo continua, e embaixo entra um passo a passo
// numerado pra deixar o mecanismo escaneavel. Reusado por sort e pathfinding.
export function HowCard({ how, steps }: { how?: string; steps?: string[] }) {
  const { d } = useI18n();
  if (!how) return null;

  return (
    <div className="card p-5">
      <h2 className="mb-2 font-display text-lg font-bold">{d.player.howTitle}</h2>
      <p className="text-sm leading-relaxed text-muted">{how}</p>
      {steps && steps.length > 0 && (
        <ol className="mt-4 space-y-2.5">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
