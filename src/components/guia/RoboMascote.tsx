"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, useAnimationFrame } from "framer-motion";

export type Expr = "feliz" | "neutro" | "surpreso";

// Boca por morph nativo do `d`: os tres paths tem a MESMA estrutura (M + um C),
// entao o Motion so interpola os numeros.
const BOCA: Record<Expr, string> = {
  neutro: "M89 112 C 93 114, 107 114, 111 112",
  feliz: "M86 108 C 93 123, 107 123, 114 108",
  surpreso: "M91 111 C 94 121, 106 121, 109 111",
};

const EASE_MIRROR = { repeat: Infinity, repeatType: "mirror", ease: "easeInOut" } as const;

export function RoboMascote({ expr = "feliz", waving = false, onPoke }: { expr?: Expr; waving?: boolean; onPoke?: () => void }) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<SVGGElement>(null);
  const [blink, setBlink] = useState(false);

  // olhos seguem o cursor, com mola pra ficar sedoso.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const irisX = useSpring(useTransform(px, [-1, 1], [-4, 4]), { stiffness: 140, damping: 16 });
  const irisY = useSpring(useTransform(py, [-1, 1], [-3, 3]), { stiffness: 140, damping: 16 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      px.set(Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width * 1.6))));
      py.set(Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height * 1.6))));
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, px, py]);

  // float: senoides de periodos nao-multiplos, sem re-render.
  useAnimationFrame((t) => {
    const g = floatRef.current;
    if (!g) return;
    if (reduce) {
      g.style.transform = "";
      return;
    }
    const bob = Math.sin(t / 1000) * 4.5;
    const sway = Math.sin(t / 1500) * 3;
    g.style.transform = `translate(${sway}px, ${bob}px)`;
  });

  // piscar em paralelo, intervalo aleatorio.
  useEffect(() => {
    if (reduce) return;
    let alive = true;
    let to: ReturnType<typeof setTimeout>;
    const loop = () => {
      to = setTimeout(() => {
        if (!alive) return;
        setBlink(true);
        setTimeout(() => alive && setBlink(false), 110);
        loop();
      }, 2400 + Math.random() * 3600);
    };
    loop();
    return () => {
      alive = false;
      clearTimeout(to);
    };
  }, [reduce]);

  const waveArm = waving ? { rotate: [0, -118, -96, -118, -96, -118, 0] } : { rotate: 0 };
  const waveTrans = waving
    ? { duration: 1.7, times: [0, 0.16, 0.32, 0.5, 0.66, 0.84, 1], ease: "easeInOut" as const }
    : { type: "spring" as const, stiffness: 120, damping: 14 };

  const happy = expr === "feliz";

  return (
    <div ref={wrapRef} className="relative w-full select-none">
      <motion.button
        type="button"
        onClick={onPoke}
        aria-label="Bit"
        className="block w-full cursor-pointer bg-transparent"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <svg viewBox="0 0 200 260" className="mx-auto w-full max-w-[320px]" style={{ filter: "drop-shadow(0 8px 14px rgba(20,40,80,0.45))" }} role="img" aria-hidden>
          <defs>
            <linearGradient id="botBody" x1="0" y1="0" x2="0.25" y2="1">
              <stop offset="0" stopColor="#8FD3FF" />
              <stop offset="0.55" stopColor="#3AA0F0" />
              <stop offset="1" stopColor="#1E6FCB" />
            </linearGradient>
            <radialGradient id="botDome" cx="0.5" cy="0.5" r="0.62" fx="0.34" fy="0.28">
              <stop offset="0" stopColor="#EAF2FF" />
              <stop offset="0.5" stopColor="#3AA0F0" />
              <stop offset="0.88" stopColor="#17457F" />
              <stop offset="1" stopColor="#2E7AD0" />
            </radialGradient>
            <linearGradient id="botLimb" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0" stopColor="#6FBAF7" />
              <stop offset="1" stopColor="#2A6EC9" />
            </linearGradient>
            <radialGradient id="botChao">
              <stop offset="0" stopColor="#000000" stopOpacity="0.4" />
              <stop offset="0.7" stopColor="#000000" stopOpacity="0.13" />
              <stop offset="1" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="botHalo">
              <stop offset="0" stopColor="#22E6FF" stopOpacity="0.2" />
              <stop offset="1" stopColor="#22E6FF" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="botSheen">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.92" />
              <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.22" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="botGloss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.06" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="botGlass" x1="0" y1="0" x2="0.2" y2="1">
              <stop offset="0" stopColor="#0E1730" />
              <stop offset="1" stopColor="#05070E" />
            </linearGradient>
            <radialGradient id="botEye" cx="0.5" cy="0.5" r="0.6" fx="0.36" fy="0.32">
              <stop offset="0" stopColor="#EAFCFF" />
              <stop offset="0.6" stopColor="#BEEBFF" />
              <stop offset="1" stopColor="#7EC6EC" />
            </radialGradient>
            <radialGradient id="botIris" cx="0.5" cy="0.5" r="0.6" fx="0.36" fy="0.3">
              <stop offset="0" stopColor="#8CF8FF" />
              <stop offset="0.55" stopColor="#29C7F5" />
              <stop offset="1" stopColor="#1670C8" />
            </radialGradient>
            <radialGradient id="botCore" cx="0.5" cy="0.5" r="0.6" fx="0.38" fy="0.32">
              <stop offset="0" stopColor="#9CFAFF" />
              <stop offset="0.55" stopColor="#22E6FF" />
              <stop offset="1" stopColor="#1580C0" />
            </radialGradient>
          </defs>

          {/* halo de presenca + sombra de chao (ficam parados) */}
          <ellipse cx="100" cy="128" rx="104" ry="112" fill="url(#botHalo)" />
          <ellipse cx="102" cy="247" rx="60" ry="10" fill="url(#botChao)" />

          <g ref={floatRef} style={{ transformBox: "fill-box" }}>
            <motion.g animate={reduce ? undefined : { rotate: [-1.8, 1.8] }} transition={{ duration: 5.4, ...EASE_MIRROR }} style={{ originX: 0.5, originY: 0.62 }}>
              {/* braco esquerdo (atras do corpo) */}
              <g>
                <rect x="42" y="150" width="19" height="42" rx="9.5" fill="url(#botLimb)" stroke="#16345E" strokeWidth="1.5" />
                <circle cx="51.5" cy="192" r="11" fill="url(#botLimb)" stroke="#16345E" strokeWidth="1.5" />
                <ellipse cx="49" cy="160" rx="4.5" ry="7" fill="url(#botSheen)" />
              </g>

              {/* braco direito: acena, pivo no ombro; mao em overlapping action */}
              <motion.g animate={waveArm} transition={waveTrans} style={{ originX: 0.5, originY: 0.06 }}>
                <rect x="139" y="150" width="19" height="42" rx="9.5" fill="url(#botLimb)" stroke="#16345E" strokeWidth="1.5" />
                <motion.g animate={waving ? { rotate: [0, 16, -12, 16, 0] } : { rotate: 0 }} transition={waving ? { duration: 0.55, repeat: 2, ease: "easeInOut" } : { duration: 0.3 }} style={{ originX: 0.5, originY: 0.12 }}>
                  <circle cx="148.5" cy="192" r="11" fill="url(#botLimb)" stroke="#16345E" strokeWidth="1.5" />
                </motion.g>
              </motion.g>

              {/* respiracao: corpo inteiro infla de leve, origem nos pes */}
              <motion.g animate={reduce ? undefined : { scaleY: [1, 1.028], scaleX: [1, 1.012] }} transition={{ duration: 3.6, ...EASE_MIRROR }} style={{ originX: 0.5, originY: 1 }}>
                {/* pes */}
                <rect x="70" y="222" width="24" height="15" rx="7.5" fill="url(#botLimb)" stroke="#16345E" strokeWidth="1.5" />
                <rect x="106" y="222" width="24" height="15" rx="7.5" fill="url(#botLimb)" stroke="#16345E" strokeWidth="1.5" />

                {/* corpo (blob) */}
                <rect x="52" y="130" width="96" height="102" rx="44" fill="url(#botBody)" stroke="#16345E" strokeWidth="2" />
                {/* oclusao na fresta cabeca-corpo */}
                <rect x="60" y="130" width="80" height="14" rx="7" fill="#0A1A33" opacity="0.18" />
                {/* gloss no topo do corpo */}
                <ellipse cx="100" cy="150" rx="40" ry="20" fill="url(#botGloss)" />
                {/* sheen especular topo-esquerda */}
                <ellipse cx="78" cy="152" rx="20" ry="12" fill="url(#botSheen)" transform="rotate(-18 78 152)" />
                {/* core emissivo do peito */}
                <circle cx="100" cy="182" r="13" fill="#0A1A33" opacity="0.55" />
                <circle cx="100" cy="182" r="10" fill="url(#botCore)" style={{ filter: "drop-shadow(0 0 7px #22E6FF)" }} />
                <circle cx="97" cy="179" r="2.4" fill="#ffffff" opacity="0.85" />
                {/* rim light frio na borda baixo-direita do corpo */}
                <path d="M143 168 A 44 44 0 0 1 122 224" fill="none" stroke="#7FDFFF" strokeWidth="2.4" strokeLinecap="round" opacity="0.5" />

                {/* antena (tortinha = vida), pivo na base */}
                <motion.g animate={reduce ? undefined : { rotate: [-6, 6] }} transition={{ duration: 1.75, ...EASE_MIRROR }} style={{ originX: 0.5, originY: 1 }}>
                  <path d="M100 30 Q 106 18 110 9" fill="none" stroke="#7FB6F5" strokeWidth="3.4" strokeLinecap="round" />
                  <motion.circle cx="111" cy="7" r="7" fill="url(#botCore)" style={{ filter: "drop-shadow(0 0 7px #22E6FF)" }} animate={reduce ? undefined : { opacity: [0.7, 1, 0.7] }} transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }} />
                  <circle cx="108.5" cy="4.5" r="1.8" fill="#ffffff" opacity="0.9" />
                </motion.g>

                {/* cabeca (domo redondo) */}
                <rect x="42" y="26" width="116" height="112" rx="46" fill="url(#botDome)" stroke="#16345E" strokeWidth="2" />
                {/* sheen especular topo-esquerda da cabeca */}
                <ellipse cx="80" cy="55" rx="26" ry="15" fill="url(#botSheen)" transform="rotate(-16 80 55)" />
                {/* rim light frio baixo-direita */}
                <path d="M150 74 A 58 58 0 0 1 120 132" fill="none" stroke="#7FDFFF" strokeWidth="2.6" strokeLinecap="round" opacity="0.55" />

                {/* rosto: tela de vidro */}
                <rect x="60" y="72" width="80" height="52" rx="22" fill="url(#botGlass)" stroke="#0a1428" strokeWidth="1.5" />
                {/* glow emissivo atras das features */}
                <ellipse cx="100" cy="98" rx="40" ry="26" fill="#2FE6FF" opacity="0.14" />
                {/* reflexo no topo do vidro */}
                <path d="M64 78 Q 100 70 136 78 L 136 88 Q 100 82 64 90 Z" fill="#ffffff" opacity="0.06" />

                {/* sobrancelhas */}
                <motion.g animate={{ y: expr === "surpreso" ? -4 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 16 }}>
                  <rect x="72" y="80" width="18" height="4" rx="2" fill="#8CC6FF" opacity="0.85" transform="rotate(-4 81 82)" />
                  <rect x="110" y="80" width="18" height="4" rx="2" fill="#8CC6FF" opacity="0.85" transform="rotate(4 119 82)" />
                </motion.g>

                {/* olhos: soquete + lente + iris ciano + 2 catchlights */}
                <g style={{ filter: "drop-shadow(0 0 5px rgba(46,230,255,0.85))" }}>
                  <motion.g animate={{ scaleY: blink ? 0.1 : 1 }} transition={{ duration: 0.1, ease: "easeOut" }} style={{ originX: 0.5, originY: 0.5 }}>
                    <circle cx="82" cy="98" r="15" fill="#10141f" />
                    <circle cx="82" cy="98" r="13" fill="url(#botEye)" />
                    <motion.circle cx="82" cy="98" r="7.5" fill="url(#botIris)" style={{ x: irisX, y: irisY }} />
                    <circle cx="78" cy="94" r="3.4" fill="#ffffff" opacity="0.95" />
                    <circle cx="86" cy="102" r="1.7" fill="#ffffff" opacity="0.5" />
                  </motion.g>
                  <motion.g animate={{ scaleY: blink ? 0.1 : 1 }} transition={{ duration: 0.1, ease: "easeOut" }} style={{ originX: 0.5, originY: 0.5 }}>
                    <circle cx="118" cy="98" r="15" fill="#10141f" />
                    <circle cx="118" cy="98" r="13" fill="url(#botEye)" />
                    <motion.circle cx="118" cy="98" r="7.5" fill="url(#botIris)" style={{ x: irisX, y: irisY }} />
                    <circle cx="114" cy="94" r="3.4" fill="#ffffff" opacity="0.95" />
                    <circle cx="122" cy="102" r="1.7" fill="#ffffff" opacity="0.5" />
                  </motion.g>
                </g>

                {/* bochechas (so quando feliz) */}
                <motion.g animate={{ opacity: happy ? 0.6 : 0 }} transition={{ duration: 0.3 }}>
                  <circle cx="58" cy="112" r="7.5" fill="#ff8fbf" />
                  <circle cx="142" cy="112" r="7.5" fill="#ff8fbf" />
                </motion.g>

                {/* boca */}
                <motion.path d={BOCA[expr]} animate={{ d: BOCA[expr] }} transition={{ type: "spring", stiffness: 120, damping: 18 }} fill="none" stroke="#8CF8FF" strokeWidth="5" strokeLinecap="round" />
              </motion.g>
            </motion.g>
          </g>
        </svg>
      </motion.button>
    </div>
  );
}
