"use client";

import { useI18n } from "@/lib/i18n";

interface Props {
  playing: boolean;
  atStart: boolean;
  atEnd: boolean;
  speed: number;
  size: number;
  soundOn: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onShuffle: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onSpeed: (v: number) => void;
  onSize: (v: number) => void;
  onToggleSound: () => void;
}

export function Controls(p: Props) {
  const { d } = useI18n();
  return (
    <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-1.5">
        <IconButton label={d.player.shuffle} onClick={p.onShuffle}>
          <path d="M16 3h5v5M4 20l17-17M21 16v5h-5M15 15l6 6M4 4l5 5" />
        </IconButton>
        <IconButton label={d.player.back} onClick={p.onStepBack} disabled={p.atStart}>
          <path d="M19 20L9 12l10-8v16zM5 19V5" />
        </IconButton>
        <button
          type="button"
          onClick={p.onPlayPause}
          aria-label={p.playing ? d.player.pause : d.player.play}
          className="glow-primary grid h-12 w-12 place-items-center rounded-full bg-primary text-white transition-transform hover:scale-105"
        >
          {p.playing ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
        <IconButton label={d.player.forward} onClick={p.onStepForward} disabled={p.atEnd}>
          <path d="M5 4l10 8-10 8V4zM19 5v14" />
        </IconButton>
        <IconButton label={d.player.reset} onClick={p.onReset}>
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />
        </IconButton>
      </div>

      <div className="flex w-full flex-wrap items-center justify-between gap-x-5 gap-y-3 sm:w-auto sm:justify-start">
        <Slider label={d.player.speed} value={p.speed} min={0} max={100} onChange={p.onSpeed} />
        <Slider label={d.player.size} value={p.size} min={8} max={80} onChange={p.onSize} />
        <button
          type="button"
          onClick={p.onToggleSound}
          aria-pressed={p.soundOn}
          title={d.player.sound}
          className={`grid h-9 w-9 place-items-center rounded-lg border transition-colors ${
            p.soundOn ? "border-primary/50 text-primary" : "border-line/70 text-muted hover:text-ink"
          }`}
        >
          {p.soundOn ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" /></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6" /></svg>
          )}
        </button>
      </div>
    </div>
  );
}

function IconButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid h-9 w-9 place-items-center rounded-lg border border-line/70 bg-surface/60 text-ink/80 transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-35 disabled:hover:border-line/70 disabled:hover:text-ink/80"
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  );
}

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-muted">
      <span className="w-16 shrink-0 uppercase tracking-wide">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-28 cursor-pointer accent-primary sm:w-32"
      />
    </label>
  );
}
