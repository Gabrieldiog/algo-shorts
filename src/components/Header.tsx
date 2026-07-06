"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { ThemeToggle } from "./ThemeToggle";
import { LangToggle } from "./LangToggle";

export function Header() {
  const { d } = useI18n();
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <BarsMark />
          <span className="font-display text-lg font-bold tracking-tight">{d.nav.brand}</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/corrida"
            className="mr-1 hidden rounded-lg px-3 py-1.5 text-sm font-semibold text-muted transition-colors hover:text-primary sm:inline-block"
          >
            {d.race.cta}
          </Link>
          <LangToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function BarsMark() {
  const heights = [10, 17, 7, 14];
  return (
    <span className="flex h-8 w-8 items-end justify-center gap-[3px] rounded-lg bg-primary/12 p-1.5 ring-1 ring-primary/30">
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-primary transition-all duration-300 group-hover:bg-accent"
          style={{ height: h }}
        />
      ))}
    </span>
  );
}
