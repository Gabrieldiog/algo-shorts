"use client";

import { useCallback, useEffect, useRef } from "react";

// Áudio-assinatura: cada valor vira um tom (grave embaixo, agudo em cima). A
// faixa 120-1212 Hz e a onda triangular vêm do "Sound of Sorting" (Timo
// Bingmann), a origem dos vídeos virais: larga o bastante, sem doer no ouvido.
// O AudioContext só nasce num gesto do usuário (o play), respeitando o autoplay.
export function useSounds(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensure = useCallback(() => {
    if (!ctxRef.current) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new Ctor();
    }
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const tone = useCallback(
    (value: number, max: number, opts?: { type?: OscillatorType; dur?: number; vol?: number }) => {
      if (!enabled) return;
      const ctx = ensure();
      const freq = 120 + (value / max) * 1092;
      const dur = opts?.dur ?? 0.085;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = opts?.type ?? "triangle";
      osc.frequency.value = freq;
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(opts?.vol ?? 0.05, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    },
    [enabled, ensure],
  );

  useEffect(() => {
    return () => {
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  return { tone, ensure };
}
