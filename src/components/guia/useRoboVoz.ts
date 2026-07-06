"use client";

import { useCallback, useEffect, useRef } from "react";

// Voz de robozinho fofo: um bip curtinho por caractere (estilo Animal Crossing /
// Undertale). Square com lowpass pra soar arredondado, um leve gliss pra parecer
// que ele está "falando". Parâmetros vão ser afinados com a pesquisa.
export function useRoboVoz(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensure = useCallback(() => {
    if (!ctxRef.current) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new Ctor();
    }
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const blip = useCallback(
    (ch: string) => {
      if (!enabled) return;
      if (!/[a-z0-9áéíóúãõâêôàçñ]/i.test(ch)) return; // pula espaços e pontuação
      const ctx = ensure();
      const t = ctx.currentTime;
      const lower = ch.toLowerCase();
      const isVowel = "aeiouáéíóúãõâêô".includes(lower);
      const base = isVowel ? 320 : 405;
      const freq = base + ((lower.charCodeAt(0) * 7) % 95);

      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 1500;
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.linearRampToValueAtTime(freq * 1.06, t + 0.05);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.03, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      osc.connect(g).connect(lp).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.07);
    },
    [enabled, ensure],
  );

  useEffect(() => {
    return () => {
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  return { blip, ensure };
}
