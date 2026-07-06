"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { RoboMascote, type Expr } from "./RoboMascote";
import { useRoboVoz } from "./useRoboVoz";

export function MascoteGuia() {
  const { d } = useI18n();
  const reduce = useReducedMotion();
  const voz = useRoboVoz();
  const msgs = d.guia.messages;

  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [waving, setWaving] = useState(false);
  const [expr, setExpr] = useState<Expr>("feliz");

  const full = msgs[idx] ?? "";
  const typing = typed.length < full.length;

  const waveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseWave = useCallback(() => {
    setWaving(true);
    if (waveRef.current) clearTimeout(waveRef.current);
    waveRef.current = setTimeout(() => setWaving(false), 1750);
  }, []);

  // datilografia da fala atual; tiquinho suave a cada par de letras
  useEffect(() => {
    if (reduce) {
      setTyped(full);
      return;
    }
    setTyped("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i % 2 === 0) voz.tick();
      if (i >= full.length) clearInterval(id);
    }, 34);
    return () => clearInterval(id);
  }, [idx, full, reduce, voz]);

  // saudacao ao aparecer: acena (som so depois do 1o gesto do usuario)
  useEffect(() => {
    pulseWave();
    return () => {
      if (waveRef.current) clearTimeout(waveRef.current);
    };
  }, [pulseWave]);

  const advance = () => {
    voz.ensure();
    if (typing) {
      setTyped(full); // 1o clique enquanto digita: completa a fala
      return;
    }
    if (idx < msgs.length - 1) {
      setIdx(idx + 1);
      setExpr("feliz");
      pulseWave();
      voz.chirpHappy();
    } else {
      setIdx(0);
      voz.coo();
    }
  };

  const poke = () => {
    voz.ensure();
    setExpr("surpreso");
    voz.coo();
    pulseWave();
    setTimeout(() => setExpr("feliz"), 900);
  };

  const last = idx === msgs.length - 1;

  return (
    <div className="flex w-full flex-col items-center gap-1">
      {/* balao */}
      <div className="relative w-full max-w-sm">
        <motion.div
          key={idx}
          initial={reduce ? false : { opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="card relative p-4 sm:p-5"
        >
          <p className="min-h-[3.5em] text-[15px] leading-relaxed text-ink sm:text-base">
            {typed}
            {typing && <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] animate-pulse bg-primary align-middle" />}
          </p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5" aria-hidden>
              {msgs.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-4 bg-primary" : "w-1.5 bg-line"}`} />
              ))}
            </div>
            <button
              type="button"
              onClick={advance}
              className="glow-primary inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              {last && !typing ? d.guia.replay : d.guia.next}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                {last && !typing ? <path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.5 2.8L3 8" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
              </svg>
            </button>
          </div>

          {/* rabinho do balao apontando pro robo */}
          <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-line bg-surface" />
        </motion.div>
      </div>

      <RoboMascote expr={expr} waving={waving} onPoke={poke} />

      <AnimatePresence>
        <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-xs text-muted">
          {d.guia.hint}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
