import type { AlgoCategory, Note } from "@/lib/engine/types";

export const LOCALES = ["pt", "en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "pt";

export const LOCALE_LABEL: Record<Locale, string> = {
  pt: "PT",
  en: "EN",
  es: "ES",
};

export interface AlgoText {
  name: string;
  tagline: string;
  curiosity?: string;
  how?: string;
}

/** As falas do personagem, uma função por evento (a i18n vira a Note em texto). */
export interface Phrases {
  start: (n: number) => string;
  pass: (n: number) => string;
  compare: (a: number, b: number) => string;
  swap: (a: number, b: number) => string;
  noswap: (a: number, b: number) => string;
  setValue: (v: number, i: number) => string;
  markSorted: (v: number) => string;
  pivot: (v: number) => string;
  selectMin: (v: number) => string;
  insert: (v: number) => string;
  done: () => string;
  shuffle: () => string;
  giveUp: () => string;
  flip: (n: number) => string;
  eliminate: (v: number) => string;
  miracle: () => string;
  designed: () => string;
  universe: () => string;
  wake: (v: number) => string;
  searchStart: (target: number) => string;
  look: (v: number) => string;
  tooLow: (v: number, target: number) => string;
  tooHigh: (v: number, target: number) => string;
  found: (v: number, i: number) => string;
  notFound: (target: number) => string;
}

export interface Dict {
  meta: { title: string; tagline: string; description: string };
  nav: { brand: string; theme: string; lang: string; back: string };
  home: {
    kicker: string;
    titleA: string;
    titleB: string;
    subtitle: string;
    startCta: string;
    watch: string;
    soon: string;
    stable: string;
    unstable: string;
    footer: string;
  };
  categories: Record<AlgoCategory, { label: string; blurb: string }>;
  player: {
    play: string;
    pause: string;
    reset: string;
    shuffle: string;
    back: string;
    forward: string;
    speed: string;
    size: string;
    sound: string;
    mode: string;
    comparisons: string;
    swaps: string;
    writes: string;
    step: string;
    finished: string;
    complexity: string;
    curiosity: string;
    howTitle: string;
    best: string;
    avg: string;
    worst: string;
    space: string;
    stability: string;
    target: string;
  };
  modes: { bars: string; rainbow: string; dots: string; circle: string };
  race: {
    title: string;
    subtitle: string;
    versus: string;
    winner: string;
    tie: string;
    steps: string;
    run: string;
    reset: string;
    shuffle: string;
    cta: string;
  };
  character: { intro: string };
  path: {
    exploring: string;
    found: (n: number) => string;
    noPath: string;
    newMaze: string;
    clearWalls: string;
    drawHint: string;
    visited: string;
    pathLen: string;
    start: string;
    end: string;
    sizes: { sm: string; md: string; lg: string };
  };
  algos: Record<string, AlgoText>;
  phrases: Phrases;
}

/** Traduz uma Note estruturada na fala do personagem, no idioma do dicionário. */
export function narrate(note: Note, d: Dict): string {
  const p = d.phrases;
  switch (note.k) {
    case "start":
      return p.start(note.n);
    case "pass":
      return p.pass(note.n);
    case "compare":
      return p.compare(note.a, note.b);
    case "swap":
      return p.swap(note.a, note.b);
    case "noswap":
      return p.noswap(note.a, note.b);
    case "setValue":
      return p.setValue(note.v, note.i);
    case "markSorted":
      return p.markSorted(note.v);
    case "pivot":
      return p.pivot(note.v);
    case "selectMin":
      return p.selectMin(note.v);
    case "insert":
      return p.insert(note.v);
    case "done":
      return p.done();
    case "shuffle":
      return p.shuffle();
    case "giveUp":
      return p.giveUp();
    case "flip":
      return p.flip(note.n);
    case "eliminate":
      return p.eliminate(note.v);
    case "miracle":
      return p.miracle();
    case "designed":
      return p.designed();
    case "universe":
      return p.universe();
    case "wake":
      return p.wake(note.v);
    case "searchStart":
      return p.searchStart(note.target);
    case "look":
      return p.look(note.v);
    case "tooLow":
      return p.tooLow(note.v, note.target);
    case "tooHigh":
      return p.tooHigh(note.v, note.target);
    case "found":
      return p.found(note.v, note.i);
    case "notFound":
      return p.notFound(note.target);
  }
}
