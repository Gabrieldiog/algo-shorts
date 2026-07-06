"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Frame, SortAlgorithm } from "@/lib/engine/types";
import { applyMove, initialFrame } from "@/lib/engine/player";

export interface Racer {
  frame: Frame;
  step: number;
  total: number;
  done: boolean;
  advance: (count: number) => void;
  reset: () => void;
}

// Um corredor: gera a trilha de passos do seu algoritmo e anda sob comando de um
// loop externo (o Race avança os dois no mesmo ritmo).
export function useRacer(algo: SortAlgorithm | undefined, input: number[] | null): Racer {
  const moves = useMemo(() => (algo && input ? algo.generate(input) : []), [algo, input]);
  const [frame, setFrame] = useState<Frame>(() => initialFrame([]));
  const [step, setStep] = useState(0);
  const frameRef = useRef(frame);
  const stepRef = useRef(0);
  const movesRef = useRef(moves);

  useEffect(() => {
    movesRef.current = moves;
  }, [moves]);

  const reset = useCallback(() => {
    const f = initialFrame(input ?? []);
    frameRef.current = f;
    stepRef.current = 0;
    setFrame(f);
    setStep(0);
  }, [input]);

  useEffect(() => {
    reset();
  }, [reset, moves]);

  const advance = useCallback((count: number) => {
    const mv = movesRef.current;
    let i = stepRef.current;
    if (i >= mv.length) return;
    let f = frameRef.current;
    const end = Math.min(mv.length, i + count);
    while (i < end) {
      f = applyMove(f, mv[i]);
      i++;
    }
    frameRef.current = f;
    stepRef.current = i;
    setFrame(f);
    setStep(i);
  }, []);

  return { frame, step, total: moves.length, done: moves.length > 0 && step >= moves.length, advance, reset };
}
