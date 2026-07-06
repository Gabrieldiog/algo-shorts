"use client";

import { useI18n } from "@/lib/i18n";

// Selo pros sorts que sao piada (bogo, stalin, sleep, quantum bogo...). Cor
// fucsia pra destoar do azul do tema: bate o olho e ja se sabe que e zoeira.
export function MemeBadge({ className = "" }: { className?: string }) {
  const { d } = useI18n();
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border border-fuchsia-400/40 bg-fuchsia-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-fuchsia-300 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
      {d.home.meme}
    </span>
  );
}
