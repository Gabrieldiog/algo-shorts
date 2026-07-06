"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

export interface Line {
  step: number;
  text: string;
}

// O histórico das falas do personagem: cada passo narrado vira uma linha, pra
// pessoa acompanhar a lógica com calma. Rola sozinho pra última fala; a lista
// desenha só as mais recentes (o resto continua contado no total).
const MAX_RENDER = 200;

export function SpeechHistory({ lines }: { lines: Line[] }) {
  const { d } = useI18n();
  const [open, setOpen] = useState(true);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [lines.length, open]);

  const shown = lines.length > MAX_RENDER ? lines.slice(-MAX_RENDER) : lines;

  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-surface-2/30"
      >
        <span className="font-semibold text-ink">
          {d.player.history} <span className="font-mono text-xs text-muted">({lines.length})</span>
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div ref={boxRef} className="max-h-52 space-y-1.5 overflow-y-auto border-t border-line/50 px-4 py-3">
          {shown.length === 0 ? (
            <p className="text-xs text-muted">{d.player.historyEmpty}</p>
          ) : (
            shown.map((l, i) => (
              <div key={`${l.step}-${i}`} className={`flex gap-3 text-sm leading-snug ${i === shown.length - 1 ? "text-ink" : "text-muted"}`}>
                <span className="mt-px w-8 shrink-0 text-right font-mono text-[11px] text-muted/70">{l.step}</span>
                <span>{l.text}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
