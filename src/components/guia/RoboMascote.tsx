"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, useAnimationFrame } from "framer-motion";

export type Expr = "feliz" | "neutro" | "surpreso";

// Boca por morph nativo do `d`: os tres paths tem a MESMA estrutura (M + um C),
// entao o Motion interpola so os numeros. Se mudasse a contagem de comandos ele
// cortaria seco (pesquisa).
const BOCA: Record<Expr, string> = {
  neutro: "M99 101 C 103 103, 117 103, 121 101",
  feliz: "M97 99 C 103 113, 117 113, 123 99",
  surpreso: "M101 100 C 104 112, 116 112, 119 100",
};

const EASE_MIRROR = { repeat: Infinity, repeatType: "mirror", ease: "easeInOut" } as const;

export function RoboMascote({ expr = "feliz", waving = false, onPoke }: { expr?: Expr; waving?: boolean; onPoke?: () => void }) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<SVGGElement>(null);
  const [blink, setBlink] = useState(false);

  // olhos seguem o cursor: pouca amplitude, com mola pra ficar sedoso.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const irisX = useSpring(useTransform(px, [-1, 1], [-3.4, 3.4]), { stiffness: 140, damping: 16 });
  const irisY = useSpring(useTransform(py, [-1, 1], [-2.4, 2.4]), { stiffness: 140, damping: 16 });

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

  // deriva/float: tres senoides de periodos nao-multiplos, sem re-render.
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

  // piscar em paralelo, com intervalo aleatorio (fora dos variants de emocao).
  useEffect(() => {
    if (reduce) return;
    let alive = true;
    let to: ReturnType<typeof setTimeout>;
    const loop = () => {
      const wait = 2400 + Math.random() * 3600;
      to = setTimeout(() => {
        if (!alive) return;
        setBlink(true);
        setTimeout(() => alive && setBlink(false), 100);
        loop();
      }, wait);
    };
    loop();
    return () => {
      alive = false;
      clearTimeout(to);
    };
  }, [reduce]);

  const waveArm = waving
    ? { rotate: [0, -118, -96, -118, -96, -118, 0] }
    : { rotate: 0 };
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
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <svg viewBox="0 0 220 262" className="mx-auto w-full max-w-[260px]" style={{ filter: "drop-shadow(0 10px 22px rgba(91,127,255,0.30))" }} role="img" aria-hidden>
          <defs>
            <linearGradient id="botBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7d97ff" />
              <stop offset="1" stopColor="#4b66ef" />
            </linearGradient>
            <linearGradient id="botLimb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5f7bf5" />
              <stop offset="1" stopColor="#4157d8" />
            </linearGradient>
          </defs>

          {/* sombra no chao (fica parada) */}
          <ellipse cx="110" cy="248" rx="46" ry="7" fill="#0a0e1c" opacity="0.45" />

          <g ref={floatRef} style={{ transformBox: "fill-box" }}>
            <motion.g animate={reduce ? undefined : { rotate: [-2, 2] }} transition={{ duration: 5.4, ...EASE_MIRROR }} style={{ originX: 0.5, originY: 0.62 }}>
              {/* braco esquerdo (atras do corpo) */}
              <rect x="60" y="132" width="13" height="46" rx="6.5" fill="url(#botLimb)" />
              <circle cx="66.5" cy="178" r="8" fill="url(#botLimb)" />

              {/* braco direito: acena, pivo no ombro; mao em overlapping action */}
              <motion.g animate={waveArm} transition={waveTrans} style={{ originX: 0.5, originY: 0.07 }}>
                <rect x="147" y="132" width="13" height="46" rx="6.5" fill="url(#botLimb)" />
                <motion.g animate={waving ? { rotate: [0, 16, -12, 16, 0] } : { rotate: 0 }} transition={waving ? { duration: 0.55, repeat: 2, ease: "easeInOut" } : { duration: 0.3 }} style={{ originX: 0.5, originY: 0.15 }}>
                  <circle cx="153.5" cy="178" r="8.5" fill="url(#botLimb)" />
                </motion.g>
              </motion.g>

              {/* respiracao: corpo inteiro infla de leve, origem nos pes */}
              <motion.g animate={reduce ? undefined : { scaleY: [1, 1.03], scaleX: [1, 1.015] }} transition={{ duration: 3.6, ...EASE_MIRROR }} style={{ originX: 0.5, originY: 1 }}>
                {/* pes */}
                <rect x="86" y="196" width="21" height="15" rx="7" fill="url(#botLimb)" />
                <rect x="113" y="196" width="21" height="15" rx="7" fill="url(#botLimb)" />

                {/* corpo */}
                <rect x="76" y="116" width="68" height="88" rx="28" fill="url(#botBody)" />
                <rect x="90" y="138" width="40" height="32" rx="11" fill="#0c1226" opacity="0.9" />
                <circle cx="100" cy="154" r="3" fill="#3ef08a" />
                <circle cx="110" cy="154" r="3" fill="#2ee6ff" />
                <circle cx="120" cy="154" r="3" fill="#ffc84d" />

                {/* pescoco */}
                <rect x="101" y="106" width="18" height="14" rx="6" fill="url(#botLimb)" />

                {/* antena: bob na base, bolinha brilhando */}
                <motion.g animate={reduce ? undefined : { rotate: [-6, 6] }} transition={{ duration: 1.7, ...EASE_MIRROR }} style={{ originX: 0.5, originY: 1 }}>
                  <rect x="108.5" y="40" width="3" height="18" rx="1.5" fill="#8aa0ff" />
                  <motion.circle cx="110" cy="37" r="6" fill="#2ee6ff" style={{ filter: "drop-shadow(0 0 6px #2ee6ff)" }} animate={reduce ? undefined : { opacity: [0.65, 1, 0.65] }} transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }} />
                </motion.g>

                {/* cabeca */}
                <rect x="74" y="56" width="72" height="58" rx="26" fill="url(#botBody)" />
                <rect x="83" y="66" width="54" height="41" rx="17" fill="#0c1226" />

                {/* sobrancelhas */}
                <motion.g animate={{ y: expr === "surpreso" ? -4 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 16 }}>
                  <rect x="92" y="73" width="14" height="3.4" rx="1.7" fill="#8aa0ff" opacity="0.9" />
                  <rect x="114" y="73" width="14" height="3.4" rx="1.7" fill="#8aa0ff" opacity="0.9" />
                </motion.g>

                {/* olhos: base ciano com glow, iris seguindo o cursor, brilho */}
                <g style={{ filter: "drop-shadow(0 0 5px rgba(46,230,255,0.9))" }}>
                  <motion.g animate={{ scaleY: blink ? 0.12 : 1 }} transition={{ duration: 0.09, ease: "easeOut" }} style={{ originX: 0.5, originY: 0.5 }}>
                    <circle cx="99" cy="88" r="9.5" fill="#8bf3ff" />
                    <motion.circle cx="99" cy="88" r="4.4" fill="#12224e" style={{ x: irisX, y: irisY }} />
                    <circle cx="96.5" cy="85.5" r="1.7" fill="#ffffff" />
                  </motion.g>
                  <motion.g animate={{ scaleY: blink ? 0.12 : 1 }} transition={{ duration: 0.09, ease: "easeOut" }} style={{ originX: 0.5, originY: 0.5 }}>
                    <circle cx="121" cy="88" r="9.5" fill="#8bf3ff" />
                    <motion.circle cx="121" cy="88" r="4.4" fill="#12224e" style={{ x: irisX, y: irisY }} />
                    <circle cx="118.5" cy="85.5" r="1.7" fill="#ffffff" />
                  </motion.g>
                </g>

                {/* bochechas (so quando feliz) */}
                <motion.g animate={{ opacity: happy ? 0.55 : 0 }} transition={{ duration: 0.3 }}>
                  <circle cx="88" cy="99" r="4.5" fill="#ff8fbf" />
                  <circle cx="132" cy="99" r="4.5" fill="#ff8fbf" />
                </motion.g>

                {/* boca */}
                <motion.path d={BOCA[expr]} animate={{ d: BOCA[expr] }} transition={{ type: "spring", stiffness: 120, damping: 18 }} fill="none" stroke="#9fd0ff" strokeWidth="4.5" strokeLinecap="round" />
              </motion.g>
            </motion.g>
          </g>
        </svg>
      </motion.button>
    </div>
  );
}
