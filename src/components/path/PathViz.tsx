"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { getPathAlgorithm, rosterEntry } from "@/lib/algorithms";
import { applyPathStep, cellKey, emptyPathFrame, type GridSpec, type PathFrame } from "@/lib/pathfinding/grid";
import { Character, type Mood } from "@/components/player/Character";

const ROWS = 15;
const COLS = 29;
const START: [number, number] = [7, 4];
const END: [number, number] = [7, COLS - 5];
const START_K = cellKey(START[0], START[1]);
const END_K = cellKey(END[0], END[1]);

function randomWalls(): Set<string> {
  const w = new Set<string>();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (Math.random() < 0.24) w.add(cellKey(r, c));
    }
  }
  w.delete(START_K);
  w.delete(END_K);
  return w;
}

function pace(speed: number): { interval: number; steps: number } {
  const sps = 6 + Math.round(Math.pow(speed / 100, 2) * 500);
  if (sps <= 55) return { interval: Math.round(1000 / sps), steps: 1 };
  return { interval: 18, steps: Math.max(1, Math.round(sps / 55)) };
}

export function PathViz({ slug }: { slug: string }) {
  const { d } = useI18n();
  const entry = rosterEntry(slug);
  const algo = getPathAlgorithm(slug);
  const text = entry ? d.algos[slug] : undefined;

  const [walls, setWalls] = useState<Set<string>>(() => new Set());
  const [ready, setReady] = useState(false);
  const [speed, setSpeed] = useState(58);
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState<PathFrame>(() => emptyPathFrame());
  const [step, setStep] = useState(0);

  useEffect(() => {
    setWalls(randomWalls());
    setReady(true);
  }, []);

  const grid: GridSpec = useMemo(() => ({ rows: ROWS, cols: COLS, walls, start: START, end: END }), [walls]);
  const steps = useMemo(() => (algo && ready ? algo.generate(grid) : []), [algo, grid, ready]);

  const frameRef = useRef(frame);
  const stepRef = useRef(0);
  const stepsRef = useRef(steps);
  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);
  useEffect(() => {
    const f = emptyPathFrame();
    frameRef.current = f;
    stepRef.current = 0;
    setFrame(f);
    setStep(0);
    setPlaying(false);
  }, [steps]);

  const advance = useCallback((count: number) => {
    const st = stepsRef.current;
    let i = stepRef.current;
    if (i >= st.length) {
      setPlaying(false);
      return;
    }
    let f = frameRef.current;
    const end = Math.min(st.length, i + count);
    while (i < end) {
      f = applyPathStep(f, st[i]);
      i++;
    }
    frameRef.current = f;
    stepRef.current = i;
    setFrame(f);
    setStep(i);
    if (i >= st.length) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const { interval, steps: n } = pace(speed);
    const id = setInterval(() => advance(n), interval);
    return () => clearInterval(id);
  }, [playing, speed, advance]);

  const atEnd = steps.length > 0 && step >= steps.length;

  const reset = () => {
    setPlaying(false);
    const f = emptyPathFrame();
    frameRef.current = f;
    stepRef.current = 0;
    setFrame(f);
    setStep(0);
  };
  const play = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (stepRef.current >= stepsRef.current.length) reset();
    setPlaying(true);
  };
  const newMaze = () => {
    setPlaying(false);
    setWalls(randomWalls());
  };
  const clearWalls = () => {
    setPlaying(false);
    setWalls(new Set());
  };

  // desenho de paredes
  const drawing = useRef<boolean | null>(null);
  const paint = (r: number, c: number, add: boolean) => {
    const k = cellKey(r, c);
    if (k === START_K || k === END_K) return;
    setWalls((prev) => {
      if (prev.has(k) === add) return prev;
      const n = new Set(prev);
      if (add) n.add(k);
      else n.delete(k);
      return n;
    });
  };
  const onDown = (r: number, c: number) => {
    const k = cellKey(r, c);
    if (k === START_K || k === END_K) return;
    drawing.current = !walls.has(k);
    paint(r, c, drawing.current);
  };
  const onEnter = (r: number, c: number) => {
    if (drawing.current === null) return;
    paint(r, c, drawing.current);
  };
  useEffect(() => {
    const up = () => {
      drawing.current = null;
    };
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, []);

  if (!algo || !entry || !text) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">{text?.name ?? slug}</h1>
      </div>
    );
  }

  const status = atEnd
    ? frame.reached
      ? d.path.found(frame.pathLen)
      : d.path.noPath
    : frame.visitedCount > 0
      ? d.path.exploring
      : d.character.intro;
  const mood: Mood = atEnd ? (frame.reached ? "done" : "idle") : frame.visitedCount > 0 ? "compare" : "idle";

  return (
    <div className="mx-auto max-w-6xl overflow-x-hidden px-4 pb-24 sm:px-6">
      <div className="flex items-center justify-between gap-4 py-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
          {d.nav.back}
        </Link>
        {atEnd && (
          <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`rounded-full border px-3 py-1 text-xs font-semibold ${frame.reached ? "border-sorted/40 bg-sorted/10 text-sorted" : "border-erro/40 bg-erro/10 text-erro"}`}>
            {frame.reached ? d.player.finished : d.path.noPath}
          </motion.span>
        )}
      </div>

      <header className="mb-4">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{text.name}</h1>
        <p className="mt-1.5 max-w-2xl text-muted">{text.tagline}</p>
      </header>

      <div className="card p-3 sm:p-4">
        <div className="grid w-full touch-none select-none gap-[2px]" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
          {Array.from({ length: ROWS * COLS }, (_, idx) => {
            const r = Math.floor(idx / COLS);
            const c = idx % COLS;
            const k = cellKey(r, c);
            return (
              <div
                key={k}
                onPointerDown={() => onDown(r, c)}
                onPointerEnter={() => onEnter(r, c)}
                className={`aspect-square rounded-[3px] transition-colors duration-150 ${cellClass(k, frame, walls)}`}
              />
            );
          })}
        </div>
        <p className="mt-3 text-center text-xs text-muted">{d.path.drawHint}</p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
        <Character text={status} mood={mood} />
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
          <span className="rounded-md bg-surface-2/70 px-2 py-1"><span className="text-ink">{frame.visitedCount}</span> {d.path.visited}</span>
          {frame.reached && <span className="rounded-md bg-surface-2/70 px-2 py-1"><span className="text-ink">{frame.pathLen}</span> {d.path.pathLen}</span>}
        </div>
      </div>

      <div className="card mt-4 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <button type="button" onClick={play} className="glow-primary grid h-11 w-11 place-items-center rounded-full bg-primary text-white transition-transform hover:scale-105">
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          <PathBtn onClick={reset}>{d.player.reset}</PathBtn>
          <PathBtn onClick={newMaze}>{d.path.newMaze}</PathBtn>
          <PathBtn onClick={clearWalls}>{d.path.clearWalls}</PathBtn>
        </div>
        <label className="flex items-center gap-2 text-xs font-medium text-muted">
          <span className="uppercase tracking-wide">{d.player.speed}</span>
          <input type="range" min={0} max={100} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="h-1.5 w-32 cursor-pointer accent-primary sm:w-40" />
        </label>
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

function cellClass(k: string, frame: PathFrame, walls: Set<string>): string {
  if (k === START_K) return "bg-sorted";
  if (k === END_K) return "bg-swap";
  if (walls.has(k)) return "bg-ink/75";
  if (frame.path.has(k)) return "bg-compare";
  if (frame.visited.has(k)) return "bg-primary/45";
  if (frame.frontier.has(k)) return "bg-accent/35";
  return "bg-surface-2/60";
}

function PathBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="rounded-lg border border-line/70 bg-surface/60 px-3 py-2 text-sm font-medium text-ink/80 transition-colors hover:border-primary/50 hover:text-primary">
      {children}
    </button>
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
