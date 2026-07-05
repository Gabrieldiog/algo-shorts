"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Note } from "@/lib/engine/types";
import { DEFAULT_LOCALE, type Dict, type Locale, LOCALES, narrate } from "./config";
import { pt } from "./pt";
import { en } from "./en";
import { es } from "./es";

const DICTS: Record<Locale, Dict> = { pt, en, es };
const STORAGE_KEY = "algo-shorts-idioma";

interface I18nValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  d: Dict;
  say: (note: Note) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // idioma vem do servidor como pt e sincroniza com o salvo no cliente depois
  // do mount, pra não quebrar a hidratação
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && (LOCALES as readonly string[]).includes(saved)) setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const d = DICTS[locale];
  const say = useCallback((note: Note) => narrate(note, d), [d]);

  return <I18nContext.Provider value={{ locale, setLocale, d, say }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n precisa do I18nProvider");
  return ctx;
}
