"use client";

import { useI18n } from "@/lib/i18n";
import { LOCALE_LABEL, LOCALES } from "@/lib/i18n/config";

export function LangToggle() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="flex items-center rounded-lg border border-line/70 bg-surface/60 p-0.5">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
            locale === l ? "bg-primary text-white" : "text-muted hover:text-ink"
          }`}
        >
          {LOCALE_LABEL[l]}
        </button>
      ))}
    </div>
  );
}
