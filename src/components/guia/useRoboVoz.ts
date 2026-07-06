"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

// A voz do robô: blips curtos no estilo R2-D2/BMO. Onda triangular (fofa sem
// doer), envelope attack-release pra não estalar, e glide de pitch pra dar
// emoção (sobe = feliz, desce = tristinho). Um AudioContext só, destravado no
// primeiro gesto do usuário (o navegador exige). Parâmetros vindos da pesquisa.
export function useRoboVoz() {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensure = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new Ctor();
    }
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  // um blip com glide opcional de from -> to
  const blip = useCallback(
    (from: number, to: number, at: number, dur = 0.14, vol = 0.16, type: OscillatorType = "triangle") => {
      const c = ctxRef.current;
      if (!c) return;
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(from, at);
      if (to !== from) osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), at + dur);
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(vol, at + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      osc.connect(g).connect(c.destination);
      osc.start(at);
      osc.stop(at + dur + 0.02);
    },
    [],
  );

  const chirpHappy = useCallback(() => {
    const c = ensure();
    if (!c) return;
    const t = c.currentTime;
    blip(520, 940, t, 0.12);
    blip(760, 1180, t + 0.11, 0.12);
  }, [ensure, blip]);

  const chirpSad = useCallback(() => {
    const c = ensure();
    if (!c) return;
    blip(760, 240, c.currentTime, 0.22, 0.14);
  }, [ensure, blip]);

  // frase curta de blips (reação fofa) com pitches variando pelo índice
  const coo = useCallback(() => {
    const c = ensure();
    if (!c) return;
    const t = c.currentTime;
    const notes = [440, 680, 560, 820];
    notes.forEach((f, i) => blip(f, f * 1.12, t + i * 0.09, 0.1, 0.13));
  }, [ensure, blip]);

  // tiquinho suave por caractere digitado (bem baixinho)
  const tickRef = useRef(0);
  const tick = useCallback(() => {
    const c = ctxRef.current;
    if (!c) return;
    // varia levemente o pitch pra não ficar monótono
    tickRef.current = (tickRef.current + 1) % 5;
    const f = 900 + tickRef.current * 40;
    blip(f, f, c.currentTime, 0.045, 0.045, "triangle");
  }, [blip]);

  useEffect(() => {
    return () => {
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  // objeto estavel: se mudar de identidade a cada render, quebra efeitos que
  // dependem dele (ex.: o typewriter reiniciaria sem parar).
  return useMemo(() => ({ ensure, chirpHappy, chirpSad, coo, tick }), [ensure, chirpHappy, chirpSad, coo, tick]);
}
