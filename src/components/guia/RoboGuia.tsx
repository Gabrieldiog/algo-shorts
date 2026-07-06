"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useRoboVoz } from "./useRoboVoz";

const CHAR_MS = 34;

export function RoboGuia() {
  const { d, locale } = useI18n();
  const balloons = d.guia.balloons;
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(0);
  const [voz, setVoz] = useState(true);
  const { blip, ensure } = useRoboVoz(voz);

  const full = balloons[idx] ?? "";
  const done = shown >= full.length;

  // reidioma ou troca de balão: reinicia a digitação
  useEffect(() => {
    setShown(0);
  }, [idx, locale]);

  // clamp quando o idioma muda o número de balões
  useEffect(() => {
    if (idx > balloons.length - 1) setIdx(0);
  }, [balloons.length, idx]);

  // máquina de escrever
  useEffect(() => {
    if (shown >= full.length) return;
    const id = setTimeout(() => {
      if (voz && shown % 2 === 0) blip(full[shown] ?? "");
      setShown((s) => s + 1);
    }, CHAR_MS);
    return () => clearTimeout(id);
  }, [shown, full, voz, blip]);

  const advance = () => {
    ensure();
    if (!done) {
      setShown(full.length);
      return;
    }
    setIdx((i) => (i + 1) % balloons.length);
  };

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <div className="relative w-full">
        <button
          type="button"
          onClick={advance}
          className="card block w-full cursor-pointer px-5 py-4 text-left transition-colors hover:border-primary/50"
        >
          <div className="min-h-[4.25rem] text-[0.95rem] leading-relaxed text-ink">
            <AnimatePresence mode="wait">
              <motion.span
                key={idx + locale}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
              >
                {full.slice(0, shown)}
                {!done && <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-primary align-middle" />}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {balloons.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${i === idx ? "w-4 bg-primary" : "w-1.5 bg-line"}`}
                />
              ))}
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
              {done ? (idx === balloons.length - 1 ? d.guia.replay : d.guia.next) : d.guia.skip}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </button>
        <span className="absolute -bottom-1.5 left-10 h-3 w-3 rotate-45 border-b border-r border-line bg-surface/90" />
      </div>

      <div className="flex items-center gap-3">
        <Robo talking={!done} />
        <div className="flex flex-col items-start gap-1">
          <span className="font-display text-sm font-bold">{d.guia.name}</span>
          <button
            type="button"
            onClick={() => {
              ensure();
              setVoz((v) => !v);
            }}
            className={`inline-flex items-center gap-1 text-xs transition-colors ${voz ? "text-primary" : "text-muted hover:text-ink"}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {voz ? <path d="M11 5 6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 0 1 0 7" /> : <path d="M11 5 6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6" />}
            </svg>
            {d.player.sound}
          </button>
        </div>
      </div>
    </div>
  );
}

function Robo({ talking }: { talking: boolean }) {
  const [blink, setBlink] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    const loop = () => {
      const wait = 2200 + Math.floor((Date.now() % 2000));
      timer.current = setTimeout(() => {
        if (!alive) return;
        setBlink(true);
        setTimeout(() => alive && setBlink(false), 130);
        loop();
      }, wait);
    };
    loop();
    return () => {
      alive = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <motion.svg
      width="112"
      height="120"
      viewBox="0 0 112 120"
      fill="none"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ filter: "drop-shadow(0 6px 14px color-mix(in srgb, var(--color-primary) 40%, transparent))" }}
      aria-hidden
    >
      {/* antena */}
      <line x1="56" y1="16" x2="56" y2="6" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
      <motion.circle cx="56" cy="5" r="4" fill="var(--color-accent)" animate={talking ? { scale: [1, 1.5, 1], opacity: [1, 0.6, 1] } : { scale: 1 }} transition={{ duration: 0.4, repeat: talking ? Infinity : 0 }} />
      {/* cabeça */}
      <rect x="18" y="16" width="76" height="60" rx="20" fill="var(--color-surface-2)" stroke="var(--color-primary)" strokeWidth="3" />
      {/* bochechas */}
      <circle cx="30" cy="56" r="5" fill="color-mix(in srgb, var(--color-swap) 45%, transparent)" />
      <circle cx="82" cy="56" r="5" fill="color-mix(in srgb, var(--color-swap) 45%, transparent)" />
      {/* olhos */}
      <g fill="var(--color-primary)">
        <motion.ellipse cx="42" cy="42" rx="7" ry={blink ? 1 : 8} />
        <motion.ellipse cx="70" cy="42" rx="7" ry={blink ? 1 : 8} />
      </g>
      {!blink && (
        <g fill="#fff" opacity="0.9">
          <circle cx="44.5" cy="39.5" r="2.2" />
          <circle cx="72.5" cy="39.5" r="2.2" />
        </g>
      )}
      {/* boca */}
      <motion.rect
        x="47"
        width="18"
        rx="3"
        fill="var(--color-primary)"
        animate={talking ? { height: [4, 10, 5, 9, 4], y: [60, 57, 60, 58, 60] } : { height: 4, y: 60 }}
        transition={{ duration: 0.35, repeat: talking ? Infinity : 0 }}
      />
      {/* corpo */}
      <rect x="30" y="80" width="52" height="34" rx="14" fill="var(--color-surface-2)" stroke="var(--color-primary)" strokeWidth="3" />
      <circle cx="56" cy="97" r="6" fill="var(--color-accent)" opacity="0.9" />
      {/* bracinhos */}
      <rect x="14" y="86" width="8" height="20" rx="4" fill="var(--color-surface-2)" stroke="var(--color-primary)" strokeWidth="2.5" />
      <rect x="90" y="86" width="8" height="20" rx="4" fill="var(--color-surface-2)" stroke="var(--color-primary)" strokeWidth="2.5" />
    </motion.svg>
  );
}
