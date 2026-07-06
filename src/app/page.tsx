"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, rosterByCategory, type RosterEntry } from "@/lib/algorithms";
import { MemeBadge } from "@/components/ui/MemeBadge";
import { MascoteGuia } from "@/components/guia/MascoteGuia";

export default function Home() {
  const { d } = useI18n();

  return (
    <div className="mx-auto max-w-6xl overflow-x-hidden px-4 pb-24 sm:px-6">
      <section className="relative grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1fr_minmax(0,380px)]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {d.home.kicker}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-[1.9rem] font-extrabold leading-[1] tracking-tight break-words sm:text-6xl lg:text-7xl"
          >
            {d.home.titleA}
            <br />
            <span className="text-glow bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {d.home.titleB}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-xl text-lg text-muted"
          >
            {d.home.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8"
          >
            <Link
              href="/a/bubble"
              className="glow-primary inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              {d.home.startCta}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 22 }}
          className="justify-self-center lg:justify-self-end"
        >
          <MascoteGuia />
        </motion.div>
      </section>

      <div className="flex flex-col gap-16">
        {CATEGORIES.map((cat) => (
          <section key={cat}>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold tracking-tight">{d.categories[cat].label}</h2>
              <p className="mt-1 max-w-lg text-sm text-muted">{d.categories[cat].blurb}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rosterByCategory(cat).map((entry, i) => (
                <AlgoCard key={entry.slug} entry={entry} index={i} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-20 border-t border-line/60 pt-8 text-sm text-muted">{d.home.footer}</footer>
    </div>
  );
}

function AlgoCard({ entry, index }: { entry: RosterEntry; index: number }) {
  const { d } = useI18n();
  const text = d.algos[entry.slug];
  const heights = barHeights(entry.slug);

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index * 0.04, 0.3) }}
      className={`card group relative h-full overflow-hidden p-5 transition-all duration-300 ${
        entry.ready ? "hover:-translate-y-1" : "opacity-60"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-25 blur-2xl transition-opacity duration-300 group-hover:opacity-45"
        style={{ background: `radial-gradient(60% 100% at 50% 0%, ${entry.accent}, transparent 70%)` }}
      />
      <div className="relative flex h-12 items-end gap-[3px] pb-3" aria-hidden>
        {heights.map((h, i) => (
          <span
            key={i}
            className="min-w-0 flex-1 rounded-t-sm"
            style={{ height: h * 0.32 + "px", background: entry.accent, opacity: 0.5 + (h / 100) * 0.5 }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-lg font-bold tracking-tight">{text.name}</h3>
        {entry.meme ? (
          <MemeBadge />
        ) : (
          !entry.ready && (
            <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
              {d.home.soon}
            </span>
          )
        )}
      </div>
      <p className="mt-1.5 text-sm text-muted">{text.tagline}</p>
      <div className="mt-4 flex items-center gap-2 font-mono text-xs">
        <span className="rounded-md bg-surface-2/70 px-2 py-1 text-ink/70">{entry.complexity.avg}</span>
        {entry.stable !== undefined && (
          <span className="text-muted">{entry.stable ? d.home.stable : d.home.unstable}</span>
        )}
      </div>
    </motion.div>
  );

  if (!entry.ready) return inner;
  return (
    <Link href={`/a/${entry.slug}`} className="block h-full focus:outline-none">
      {inner}
    </Link>
  );
}

function barHeights(slug: string, n = 9): number[] {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) h = Math.imul(h ^ slug.charCodeAt(i), 16777619) >>> 0;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    h = (Math.imul(h, 1103515245) + 12345) >>> 0;
    out.push(28 + (h % 72));
  }
  return out;
}
