"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { getSortAlgorithm, rosterEntry } from "@/lib/algorithms";
import { applyMove, buildFrame, initialFrame } from "@/lib/engine/player";
import type { Frame, Move } from "@/lib/engine/types";
import { Bars } from "@/components/viz/Bars";
import { Rainbow } from "@/components/viz/Rainbow";
import { Dots } from "@/components/viz/Dots";
import { Ring } from "@/components/viz/Ring";
import { Controls } from "./Controls";
import { Character, type Mood } from "./Character";
import { useSounds } from "./useSounds";

const VIZ = { bars: Bars, rainbow: Rainbow, dots: Dots, circle: Ring } as const;
type VizMode = keyof typeof VIZ;
const MODES: VizMode[] = ["bars", "rainbow", "dots", "circle"];

export function Visualizer({ slug }: { slug: string }) {
  const { d, say } = useI18n();
  const entry = rosterEntry(slug);
  const algo = getSortAlgorithm(slug);
  const text = entry ? d.algos[slug] : undefined;

  const [size, setSize] = useState(24);
  const [mode, setMode] = useState<VizMode>("bars");
  const [input, setInput] = useState<number[] | null>(null);
  const [speed, setSpeed] = useState(55);
  const [soundOn, setSoundOn] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState<Frame>(() => initialFrame([]));
  const [step, setStep] = useState(0);

  const { tone, ensure } = useSounds(soundOn);

  useEffect(() => {
    setInput(shuffled(size));
    // só na montagem: o array nasce no cliente pra não quebrar a hidratação
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moves = useMemo(() => (algo && input ? algo.generate(input) : []), [algo, input]);
  const max = input && input.length ? input.length : 1;

  const frameRef = useRef(frame);
  const stepRef = useRef(step);
  const movesRef = useRef(moves);
  useEffect(() => {
    movesRef.current = moves;
  }, [moves]);

  useEffect(() => {
    const f = initialFrame(input ?? []);
    frameRef.current = f;
    stepRef.current = 0;
    setFrame(f);
    setStep(0);
    setPlaying(false);
  }, [input]);

  const advance = useCallback(
    (count: number) => {
      const mv = movesRef.current;
      let i = stepRef.current;
      let f = frameRef.current;
      if (i >= mv.length) {
        setPlaying(false);
        return;
      }
      let last: Move | null = null;
      const end = Math.min(mv.length, i + count);
      while (i < end) {
        f = applyMove(f, mv[i]);
        last = mv[i];
        i++;
      }
      frameRef.current = f;
      stepRef.current = i;
      setFrame(f);
      setStep(i);
      if (last && soundOn) soundFor(last, f, max, tone);
      if (i >= mv.length) setPlaying(false);
    },
    [soundOn, tone, max],
  );

  const seek = useCallback(
    (k: number) => {
      const clamped = Math.max(0, Math.min(k, movesRef.current.length));
      const f = buildFrame(input ?? [], movesRef.current, clamped);
      frameRef.current = f;
      stepRef.current = clamped;
      setFrame(f);
      setStep(clamped);
    },
    [input],
  );

  useEffect(() => {
    if (!playing) return;
    const { interval, steps } = pace(speed);
    const id = setInterval(() => advance(steps), interval);
    return () => clearInterval(id);
  }, [playing, speed, advance]);

  const atEnd = moves.length > 0 && step >= moves.length;
  const atStart = step === 0;

  const onPlayPause = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    ensure();
    if (stepRef.current >= movesRef.current.length) seek(0);
    setPlaying(true);
  };
  const onReset = () => {
    setPlaying(false);
    seek(0);
  };
  const onShuffle = () => {
    setPlaying(false);
    setInput(shuffled(size));
  };
  const onSize = (v: number) => {
    setSize(v);
    setPlaying(false);
    setInput(shuffled(v));
  };

  if (!algo || !entry || !text) {
    return <ComingSoon slug={slug} />;
  }

  const mood: Mood = atEnd ? "done" : frame.swapping.length ? "swap" : frame.comparing.length ? "compare" : "idle";
  const line = frame.note ? say(frame.note) : d.character.intro;
  const Viz = VIZ[mode];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div className="flex items-center justify-between gap-4 py-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
          {d.nav.back}
        </Link>
        {atEnd && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-full border border-sorted/40 bg-sorted/10 px-3 py-1 text-xs font-semibold text-sorted"
          >
            {d.player.finished}
          </motion.span>
        )}
      </div>

      <header className="mb-5">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{text.name}</h1>
        <p className="mt-1.5 max-w-2xl text-muted">{text.tagline}</p>
      </header>

      <div className="mb-2 flex items-center justify-end gap-1">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
              mode === m ? "bg-primary/15 text-primary" : "text-muted hover:text-ink"
            }`}
          >
            {d.modes[m]}
          </button>
        ))}
      </div>
      <div className="card relative flex h-[300px] items-stretch justify-center p-4 sm:h-[380px]">
        {input ? <Viz frame={frame} max={max} /> : <div className="h-full w-full animate-pulse rounded-lg bg-surface-2/40" />}
      </div>

      <input
        type="range"
        min={0}
        max={Math.max(moves.length, 1)}
        value={step}
        onChange={(e) => {
          setPlaying(false);
          seek(Number(e.target.value));
        }}
        className="mt-3 h-1.5 w-full cursor-pointer accent-primary"
        aria-label={d.player.step}
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
        <Character text={line} mood={mood} />
        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          <Stat label={d.player.comparisons} value={frame.stats.comparisons} />
          <Stat label={d.player.swaps} value={frame.stats.swaps} />
          {frame.stats.writes > 0 && <Stat label={d.player.writes} value={frame.stats.writes} />}
        </div>
      </div>

      <div className="mt-4">
        <Controls
          playing={playing}
          atStart={atStart}
          atEnd={atEnd}
          speed={speed}
          size={size}
          soundOn={soundOn}
          onPlayPause={onPlayPause}
          onReset={onReset}
          onShuffle={onShuffle}
          onStepBack={() => {
            setPlaying(false);
            seek(step - 1);
          }}
          onStepForward={() => {
            setPlaying(false);
            advance(1);
          }}
          onSpeed={setSpeed}
          onSize={onSize}
          onToggleSound={() => setSoundOn((s) => !s)}
        />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-4 font-display text-lg font-bold">{d.player.complexity}</h2>
          <div className="grid grid-cols-2 gap-3">
            <BigO label={d.player.best} value={entry.complexity.best} />
            <BigO label={d.player.avg} value={entry.complexity.avg} highlight />
            <BigO label={d.player.worst} value={entry.complexity.worst} />
            <BigO label={d.player.space} value={entry.complexity.space} />
          </div>
          {entry.stable !== undefined && (
            <p className="mt-4 text-sm text-muted">
              {d.player.stability}: <span className="text-ink">{entry.stable ? d.home.stable : d.home.unstable}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {text.how && (
            <div className="card p-5">
              <h2 className="mb-2 font-display text-lg font-bold">{d.player.howTitle}</h2>
              <p className="text-sm leading-relaxed text-muted">{text.how}</p>
            </div>
          )}
          {text.curiosity && (
            <div className="card border-accent/30 p-5">
              <h2 className="mb-2 font-display text-lg font-bold text-accent">{d.player.curiosity}</h2>
              <p className="text-sm leading-relaxed text-muted">{text.curiosity}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span className="rounded-md bg-surface-2/70 px-2 py-1">
      <span className="text-ink">{value}</span> <span className="text-[10px] uppercase tracking-wide">{label}</span>
    </span>
  );
}

function BigO({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${highlight ? "border-primary/40 bg-primary/5" : "border-line/60"}`}>
      <div className="text-[11px] uppercase tracking-wide text-muted">{label}</div>
      <div className={`mt-0.5 font-mono text-lg font-semibold ${highlight ? "text-primary" : "text-ink"}`}>{value}</div>
    </div>
  );
}

function ComingSoon({ slug }: { slug: string }) {
  const { d } = useI18n();
  const entry = rosterEntry(slug);
  const text = entry ? d.algos[slug] : undefined;
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
        {d.nav.back}
      </Link>
      <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted">{d.home.soon}</span>
      <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight">{text?.name ?? slug}</h1>
      {text?.tagline && <p className="mt-3 text-muted">{text.tagline}</p>}
    </div>
  );
}

function shuffled(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

function pace(speed: number): { interval: number; steps: number } {
  const sps = 3 + Math.round(Math.pow(speed / 100, 2.2) * 600);
  if (sps <= 55) return { interval: Math.round(1000 / sps), steps: 1 };
  return { interval: 18, steps: Math.max(1, Math.round(sps / 55)) };
}

function soundFor(move: Move, frame: Frame, max: number, tone: (v: number, max: number, o?: { type?: OscillatorType; dur?: number; vol?: number }) => void) {
  let idx: number | null = null;
  if (move.t === "compare") idx = move.j;
  else if (move.t === "swap" || move.t === "overwrite" || move.t === "markSorted" || move.t === "cursor" || move.t === "found") idx = move.i;
  if (idx == null) return;
  const v = frame.array[idx];
  if (v == null) return;
  tone(v, max, { dur: move.t === "markSorted" ? 0.05 : 0.085, vol: move.t === "markSorted" ? 0.05 : 0.045 });
}
