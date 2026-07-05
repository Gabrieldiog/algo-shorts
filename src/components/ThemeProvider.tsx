"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// next-themes injeta o script que aplica a classe antes do paint (sem flash) e
// persiste a escolha. attribute="class" casa com o .dark do CSS. Aqui o padrão
// é o escuro — a estética neon dos shorts nasce no breu; o claro é opção.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="algo-shorts-tema"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
