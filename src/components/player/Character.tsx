"use client";

import { AnimatePresence, motion } from "framer-motion";

export type Mood = "idle" | "compare" | "swap" | "done";

export function Character({ text, mood }: { text: string; mood: Mood }) {
  return (
    <div className="flex items-start gap-3">
      <motion.div
        animate={mood === "swap" ? { rotate: [0, -8, 8, 0] } : { rotate: 0 }}
        transition={{ duration: 0.35 }}
        className="shrink-0"
      >
        <Mascot mood={mood} />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="card relative min-h-11 px-4 py-2.5 text-sm leading-snug"
        >
          <span className="absolute -left-1.5 top-3.5 h-3 w-3 rotate-45 border-b border-l border-line bg-surface/90" />
          {text}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Mascot({ mood }: { mood: Mood }) {
  const eye = mood === "done" ? "M -2 0 Q 0 -3 2 0" : "M 0 -2.4 L 0 2.4";
  const glow = mood === "idle" ? "var(--color-primary)" : mood === "swap" ? "var(--color-swap)" : mood === "done" ? "var(--color-sorted)" : "var(--color-compare)";
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none" aria-hidden style={{ filter: `drop-shadow(0 0 8px ${glow})` }}>
      <line x1="23" y1="6" x2="23" y2="12" stroke={glow} strokeWidth="2" strokeLinecap="round" />
      <circle cx="23" cy="5" r="2.4" fill={glow} />
      <rect x="8" y="12" width="30" height="26" rx="9" fill="var(--color-surface-2)" stroke={glow} strokeWidth="2" />
      <g stroke={glow} strokeWidth="2.4" strokeLinecap="round" transform="translate(17 24)">
        <path d={eye} />
      </g>
      <g stroke={glow} strokeWidth="2.4" strokeLinecap="round" transform="translate(29 24)">
        <path d={eye} />
      </g>
      <path
        d={mood === "done" ? "M 18 31 Q 23 35 28 31" : mood === "swap" ? "M 19 32 L 27 32" : "M 20 31.5 Q 23 33.5 26 31.5"}
        stroke={glow}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
