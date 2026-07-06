"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { getSortAlgorithm, roster } from "@/lib/algorithms";
import { Bars } from "@/components/viz/Bars";
import { useRacer, type Racer } from "./useRacer";

const READY = roster.filter((r) => r.category === "sort" && r.ready).map((r) => r.slug);

type Winner = "left" | "right" | "tie" | null;

export function Race() {
  const { d } = useI18n();
  const [size, setSize] = useState(32);
  const [leftSlug, setLeftSlug] = useState("bubble");
  const [rightSlug, setRightSlug] = useState("quick");
  const [input, setInput] = useState<number[] | null>(null);
  const [speed, setSpeed] = useState(65);
  const [running, setRunning] = useState(false);
  const [winner, setWinner] = useState<Winner>(null);

  useEffect(() => {
    setInput(shuffled(size));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const left = useRacer(getSortAlgorithm(leftSlug), input);
  const right = useRacer(getSortAlgorithm(rightSlug), input);
  const max = input?.length ?? 1;

  const leftRef = useRef(left);
  const rightRef = useRef(right);
  leftRef.current = left;
  rightRef.current = right;

  useEffect(() => {
    if (!running) return;
    const { interval, steps } = pace(speed);
    const id = setInterval(() => {
      leftRef.current.advance(steps);
      rightRef.current.advance(steps);
    }, interval);
    return () => clearInterval(id);
  }, [running, speed]);

  useEffect(() => {
    if (winner) return;
    if (left.done && right.done) setWinner(left.total <= right.total ? (left.total === right.total ? "tie" : "left") : "right");
    else if (left.done) setWinner("left");
    else if (right.done) setWinner("right");
  }, [left.done, right.done, left.total, right.total, winner]);

  useEffect(() => {
    if (left.done && right.done) setRunning(false);
  }, [left.done, right.done]);

  const restart = () => {
    left.reset();
    right.reset();
    setWinner(null);
  };
  const onRun = () => {
    if (left.done && right.done) restart();
    setRunning(true);
  };
  const onReset = () => {
    setRunning(false);
    restart();
  };
  const onShuffle = () => {
    setRunning(false);
    setWinner(null);
    setInput(shuffled(size));
  };
  const onSize = (v: number) => {
    setRunning(false);
    setWinner(null);
    setSize(v);
    setInput(shuffled(v));
  };
  const pick = (side: "left" | "right", slug: string) => {
    setRunning(false);
    setWinner(null);
    if (side === "left") setLeftSlug(slug);
    else setRightSlug(slug);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div className="py-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
          {d.nav.back}
        </Link>
      </div>

      <header className="mb-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{d.race.title}</h1>
        <p className="mt-1.5 max-w-2xl text-muted">{d.race.subtitle}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel side="left" slug={leftSlug} onPick={(s) => pick("left", s)} racer={left} max={max} input={input} won={winner === "left"} tie={winner === "tie"} />
        <Panel side="right" slug={rightSlug} onPick={(s) => pick("right", s)} racer={right} max={max} input={input} won={winner === "right"} tie={winner === "tie"} />
      </div>

      <div className="card mt-4 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={running ? () => setRunning(false) : onRun}
            className="glow-primary rounded-xl bg-primary px-5 py-2.5 font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            {running ? d.player.pause : d.race.run}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-line/70 bg-surface/60 px-4 py-2.5 text-sm font-medium text-ink/80 transition-colors hover:border-primary/50 hover:text-primary"
          >
            {d.race.reset}
          </button>
          <button
            type="button"
            onClick={onShuffle}
            className="rounded-xl border border-line/70 bg-surface/60 px-4 py-2.5 text-sm font-medium text-ink/80 transition-colors hover:border-primary/50 hover:text-primary"
          >
            {d.race.shuffle}
          </button>
        </div>
        <label className="flex items-center gap-2 text-xs font-medium text-muted">
          <span className="uppercase tracking-wide">{d.player.speed}</span>
          <input type="range" min={0} max={100} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="h-1.5 w-32 cursor-pointer accent-primary" />
          <span className="ml-3 uppercase tracking-wide">{d.player.size}</span>
          <input type="range" min={8} max={80} value={size} onChange={(e) => onSize(Number(e.target.value))} className="h-1.5 w-32 cursor-pointer accent-primary" />
        </label>
      </div>
    </div>
  );
}

function Panel({
  side,
  slug,
  onPick,
  racer,
  max,
  input,
  won,
  tie,
}: {
  side: "left" | "right";
  slug: string;
  onPick: (slug: string) => void;
  racer: Racer;
  max: number;
  input: number[] | null;
  won: boolean;
  tie: boolean;
}) {
  const { d } = useI18n();
  return (
    <div className={`card relative overflow-hidden p-4 transition-shadow ${won ? "glow-primary" : ""}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <select
          value={slug}
          onChange={(e) => onPick(e.target.value)}
          aria-label={side}
          className="rounded-lg border border-line/70 bg-surface px-3 py-1.5 text-sm font-semibold text-ink outline-none focus:border-primary/60"
        >
          {READY.map((s) => (
            <option key={s} value={s}>
              {d.algos[s].name}
            </option>
          ))}
        </select>
        <span className="font-mono text-xs text-muted">
          <span className="text-ink">{racer.step}</span> {d.race.steps}
        </span>
      </div>
      <div className="relative flex h-[260px] items-end sm:h-[320px]">
        {input ? <Bars frame={racer.frame} max={max} /> : <div className="h-full w-full animate-pulse rounded-lg bg-surface-2/40" />}
        {(won || tie) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <span className="rounded-xl border border-primary/40 bg-bg/80 px-5 py-2 font-display text-xl font-bold text-primary backdrop-blur">
              {tie ? d.race.tie : d.race.winner}
            </span>
          </motion.div>
        )}
      </div>
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
