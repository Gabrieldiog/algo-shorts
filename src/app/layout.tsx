import type { Metadata } from "next";
import { Unbounded, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { I18nProvider } from "@/lib/i18n";
import { Header } from "@/components/Header";

const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Algo Shorts — Algoritmos que você controla",
  description:
    "Visualizações interativas de algoritmos, no estilo dos shorts virais, com áudio, narração e passo a passo.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt"
      suppressHydrationWarning
      className={`${unbounded.variable} ${sora.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-dvh">
        <ThemeProvider>
          <I18nProvider>
            <Header />
            <main>{children}</main>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
