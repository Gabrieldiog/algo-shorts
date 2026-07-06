"use client";

// Select nativo (acessível) com uma casca bonita: seta própria, foco em azul.
export function Select({
  value,
  onChange,
  label,
  children,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative inline-flex ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="w-full appearance-none rounded-xl border border-line/70 bg-surface/80 py-2 pl-3.5 pr-9 text-sm font-semibold text-ink outline-none transition-colors hover:border-primary/50 focus:border-primary/70 focus:ring-2 focus:ring-primary/25"
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}
