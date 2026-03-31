"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  { text: "SYSTEM: INITIALIZING CORE MODULES", delay: 0 },
  { text: "NETWORK: ESTABLISHING SECURE CONNECTION", delay: 200 },
  { text: "GRAPHICS: RENDERING ENGINE ONLINE", delay: 400 },
  { text: "AUTH: IDENTITY VERIFIED — GUEST ACCESS GRANTED", delay: 600 },
  { text: "UI: LOADING INTERFACE COMPONENTS", delay: 800 },
  { text: "STATUS: ALL SYSTEMS OPERATIONAL", delay: 1000 },
];

const HEX_COORDS = [
  { x: "15%", y: "20%", size: 40, delay: 0.2 },
  { x: "80%", y: "15%", size: 30, delay: 0.5 },
  { x: "10%", y: "75%", size: 35, delay: 0.3 },
  { x: "85%", y: "70%", size: 25, delay: 0.7 },
  { x: "50%", y: "10%", size: 20, delay: 0.4 },
  { x: "45%", y: "85%", size: 28, delay: 0.6 },
];

function HexShape({ x, y, size, delay }: { x: string; y: string; size: number; delay: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 0.15, scale: 1, rotate: [0, 60] }}
      transition={{ delay, duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon
          points="50,2 95,25 95,75 50,98 5,75 5,25"
          fill="none"
          stroke="var(--cyan)"
          strokeWidth="1.5"
          opacity="0.5"
        />
      </svg>
    </motion.div>
  );
}

function CrosshairCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const base = "absolute w-8 h-8 pointer-events-none";
  const pos = {
    tl: "top-6 left-6",
    tr: "top-6 right-6",
    bl: "bottom-6 left-6",
    br: "bottom-6 right-6",
  }[position];
  const borderDir = {
    tl: "border-t border-l",
    tr: "border-t border-r",
    bl: "border-b border-l",
    br: "border-b border-r",
  }[position];

  return (
    <motion.div
      className={`${base} ${pos} ${borderDir} border-[var(--cyan)]/40`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    />
  );
}

// Module-level flag: only show HUD once per full page load (survives remounts but not refresh)
let hudShownThisLoad = false;

export default function HudIntro({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showHud, setShowHud] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<"boot" | "loading" | "done">("boot");
  const [bootProgress, setBootProgress] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadLabel, setLoadLabel] = useState("INITIALIZING CORE");

  useEffect(() => {
    if (hudShownThisLoad) {
      setShowHud(false);
    } else {
      setShowHud(true);
    }
    router.prefetch("/");
  }, [router]);

  // Boot sequence
  useEffect(() => {
    if (!showHud) return;

    // Progress bar
    const progressInterval = setInterval(() => {
      setBootProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return p + 2;
      });
    }, 30);

    // Boot lines
    BOOT_LINES.forEach((_, i) => {
      setTimeout(() => setVisibleLines((v) => Math.max(v, i + 1)), BOOT_LINES[i].delay + 300);
    });

    return () => clearInterval(progressInterval);
  }, [showHud]);

  const handleStart = useCallback(() => {
    setPhase("loading");
  }, []);

  // Loading phase — animate percentage 0→100
  useEffect(() => {
    if (phase !== "loading") return;

    const LABELS = [
      { at: 0, text: "INITIALIZING CORE" },
      { at: 15, text: "LOADING ASSETS" },
      { at: 35, text: "RENDERING INTERFACE" },
      { at: 55, text: "COMPILING SHADERS" },
      { at: 75, text: "ESTABLISHING CONNECTION" },
      { at: 90, text: "FINALIZING" },
    ];

    let frame: number;
    let current = 0;
    const speed = 0.8;

    const tick = () => {
      current += speed + Math.random() * 0.5;
      if (current >= 100) current = 100;
      setLoadProgress(Math.floor(current));

      const label = LABELS.filter((l) => l.at <= current).pop();
      if (label) setLoadLabel(label.text);

      if (current < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          hudShownThisLoad = true;
          if (pathname !== "/") router.replace("/");
          setPhase("done");
        }, 600);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  // Not yet determined
  if (showHud === null) return null;

  // Already seen or done loading
  if (!showHud || phase === "done") return <>{children}</>;

  return (
    <>
      <AnimatePresence mode="wait">
        {phase === "loading" ? (
          /* ════════════════════════════════════════════
             PHASE 2 — FULL-SCREEN PERCENTAGE LOADER
             ════════════════════════════════════════════ */
          <motion.div
            key="loader"
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden hud-intro"
            style={{ background: "var(--bg)", cursor: "default" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Background grid */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(to right, var(--cyan) 1px, transparent 1px),
                  linear-gradient(to bottom, var(--cyan) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />

            {/* Radial vignette */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at center, transparent 20%, var(--bg) 80%)" }} />

            {/* Center content */}
            <div className="relative z-10 flex flex-col items-center">

              {/* ── Circular progress ring ── */}
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 mb-8">
                {/* Outer track */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="var(--border)" strokeWidth="1" opacity="0.3" />
                  {/* Progress arc */}
                  <circle
                    cx="100" cy="100" r="90"
                    fill="none"
                    stroke="url(#progressGrad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 90}`}
                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - loadProgress / 100)}`}
                    style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
                  />
                  {/* Inner ring */}
                  <circle
                    cx="100" cy="100" r="78"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="0.5"
                    opacity="0.2"
                    strokeDasharray="4 8"
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--cyan)" />
                      <stop offset="100%" stopColor="var(--violet)" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Rotating outer dashes */}
                <div
                  className="absolute inset-0"
                  style={{ animation: "spin 8s linear infinite" }}
                >
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle
                      cx="100" cy="100" r="96"
                      fill="none"
                      stroke="var(--cyan)"
                      strokeWidth="0.5"
                      opacity="0.2"
                      strokeDasharray="2 14"
                    />
                  </svg>
                </div>

                {/* Orbiting dot */}
                <div
                  className="absolute inset-0"
                  style={{
                    animation: "spin 3s linear infinite",
                  }}
                >
                  <div
                    className="absolute w-2 h-2 rounded-full left-1/2 -translate-x-1/2 -top-1"
                    style={{
                      background: "var(--cyan)",
                      boxShadow: "0 0 12px var(--cyan), 0 0 24px var(--cyan)",
                    }}
                  />
                </div>

                {/* Center percentage */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    className="text-5xl sm:text-7xl font-bold font-mono tabular-nums"
                    style={{
                      background: "linear-gradient(135deg, var(--cyan), var(--violet))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textShadow: "none",
                    }}
                  >
                    {loadProgress}
                  </motion.span>
                  <span className="text-[10px] font-mono tracking-[0.3em] text-[var(--fg-3)] uppercase">
                    percent
                  </span>
                </div>

                {/* Glow behind ring */}
                <div
                  className="absolute inset-4 rounded-full pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, rgba(0,240,255,${0.03 + loadProgress * 0.001}), transparent 70%)`,
                    filter: "blur(20px)",
                  }}
                />
              </div>

              {/* Status label */}
              <motion.div
                className="flex items-center gap-2 mb-3"
                key={loadLabel}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="w-1 h-1 rounded-full"
                  style={{
                    background: "var(--cyan)",
                    boxShadow: "0 0 6px var(--cyan)",
                    animation: "loading-pulse 1s ease-in-out infinite",
                  }}
                />
                <span className="text-[9px] font-mono tracking-[0.25em] uppercase" style={{ color: "var(--cyan)" }}>
                  {loadLabel}
                </span>
              </motion.div>

              {/* Horizontal progress bar */}
              <div className="w-48 sm:w-64 h-[2px] bg-[var(--border)]/30 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, var(--cyan), var(--violet))",
                    width: `${loadProgress}%`,
                    transition: "width 0.1s ease-out",
                    boxShadow: "0 0 8px var(--cyan)",
                  }}
                />
              </div>

              {/* HEX data readout */}
              <div className="flex items-center gap-4 opacity-30">
                <span className="text-[7px] font-mono text-[var(--fg-3)] tracking-wider">
                  0x{loadProgress.toString(16).toUpperCase().padStart(2, "0")}FF
                </span>
                <span className="text-[7px] font-mono text-[var(--fg-3)] tracking-wider">
                  MEM: {(loadProgress * 0.48).toFixed(0)}MB
                </span>
                <span className="text-[7px] font-mono text-[var(--fg-3)] tracking-wider">
                  THR: {Math.min(loadProgress, 8)}
                </span>
              </div>
            </div>

            {/* Corner decorations */}
            <CrosshairCorner position="tl" />
            <CrosshairCorner position="tr" />
            <CrosshairCorner position="bl" />
            <CrosshairCorner position="br" />
          </motion.div>
        ) : (
          /* ════════════════════════════════════════════
             PHASE 1 — BOOT SEQUENCE HUD
             ════════════════════════════════════════════ */
          <motion.div
            key="boot"
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden hud-intro"
            style={{ background: "var(--bg)", cursor: "default" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Background grid */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `
                  linear-gradient(to right, var(--cyan) 1px, transparent 1px),
                  linear-gradient(to bottom, var(--cyan) 1px, transparent 1px)
                `,
                backgroundSize: "50px 50px",
              }}
            />

            {/* Scanline */}
            <motion.div
              className="absolute inset-x-0 h-px pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, var(--cyan), transparent)", opacity: 0.15 }}
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Floating hexagons */}
            {HEX_COORDS.map((h, i) => (
              <HexShape key={i} {...h} />
            ))}

            {/* Crosshair corners */}
            <CrosshairCorner position="tl" />
            <CrosshairCorner position="tr" />
            <CrosshairCorner position="bl" />
            <CrosshairCorner position="br" />

            {/* Radial gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(circle at center, transparent 30%, var(--bg) 80%)",
              }}
            />

            {/* ── Center HUD ── */}
            <motion.div
              className="relative z-10 flex flex-col items-center max-w-lg w-full px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Top label */}
              <motion.div
                className="flex items-center gap-2 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" style={{ boxShadow: "0 0 8px var(--cyan)" }} />
                <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-[var(--cyan)]">
                  BIJAY.OS v2.0
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" style={{ boxShadow: "0 0 8px var(--cyan)" }} />
              </motion.div>

              {/* Main title */}
              <motion.h1
                className="text-3xl sm:text-5xl font-bold tracking-tight text-center mb-2"
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <span style={{ color: "var(--fg)" }}>SYSTEM </span>
                <span
                  style={{
                    background: "linear-gradient(135deg, var(--cyan), var(--violet))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  READY
                </span>
              </motion.h1>

              <motion.p
                className="text-[11px] font-mono text-[var(--fg-3)] tracking-[0.15em] uppercase mb-5 sm:mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                Creative Portfolio Interface
              </motion.p>

              {/* Boot progress bar */}
              <motion.div
                className="w-full max-w-xs mb-4 sm:mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[8px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">
                    Boot Sequence
                  </span>
                  <span className="text-[8px] font-mono" style={{ color: "var(--cyan)" }}>
                    {bootProgress}%
                  </span>
                </div>
                <div className="h-[2px] bg-[var(--border)] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg, var(--cyan), var(--violet))",
                      width: `${bootProgress}%`,
                    }}
                  />
                </div>
              </motion.div>

              {/* Boot log */}
              <motion.div
                className="w-full max-w-xs mb-5 sm:mb-8 h-20 sm:h-28 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="space-y-1">
                  {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-[7px] font-mono shrink-0 mt-px" style={{ color: i === visibleLines - 1 ? "var(--cyan)" : "var(--emerald)" }}>
                        {i === visibleLines - 1 && bootProgress < 100 ? "▶" : "✓"}
                      </span>
                      <span className="text-[7px] font-mono text-[var(--fg-3)] leading-tight">
                        {line.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* START button */}
              <motion.button
                onClick={handleStart}
                className="group relative px-8 sm:px-10 py-3 cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: bootProgress >= 100 ? 1 : 0.3, scale: bootProgress >= 100 ? 1 : 0.95 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
                disabled={bootProgress < 100}
                whileHover={bootProgress >= 100 ? { scale: 1.05 } : {}}
                whileTap={bootProgress >= 100 ? { scale: 0.95 } : {}}
              >
                {/* Button border — rotating gradient */}
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    padding: "1.5px",
                    background: "conic-gradient(from var(--angle, 0deg), transparent 30%, var(--cyan), var(--violet), transparent 70%)",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    animation: bootProgress >= 100 ? "rotate-gradient 3s linear infinite" : "none",
                  }}
                />
                {/* Button background */}
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: "rgba(0,240,255,0.05)",
                  }}
                />
                {/* Glow */}
                {bootProgress >= 100 && (
                  <div
                    className="absolute -inset-2 rounded-2xl pointer-events-none"
                    style={{
                      background: "radial-gradient(circle, rgba(0,240,255,0.1), transparent 70%)",
                      filter: "blur(12px)",
                      animation: "loading-pulse 2s ease-in-out infinite",
                    }}
                  />
                )}
                <span
                  className="relative text-[11px] sm:text-[12px] font-mono tracking-[0.3em] sm:tracking-[0.4em] uppercase font-bold"
                  style={{
                    color: bootProgress >= 100 ? "var(--cyan)" : "var(--fg-3)",
                  }}
                >
                  {bootProgress >= 100 ? "INITIALIZE" : "BOOTING..."}
                </span>
              </motion.button>

              {/* Bottom hint */}
              <motion.span
                className="text-[8px] font-mono text-[var(--fg-3)]/50 tracking-[0.2em] uppercase mt-4 h-4"
                initial={{ opacity: 0 }}
                animate={bootProgress >= 100 ? { opacity: [0, 0.5, 0] } : { opacity: 0 }}
                transition={bootProgress >= 100 ? { duration: 2, repeat: Infinity } : {}}
              >
                Press to enter
              </motion.span>
            </motion.div>

            {/* Bottom status bar */}
            <motion.div
              className="absolute bottom-4 left-6 right-6 flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-[7px] font-mono text-[var(--fg-3)] tracking-[0.15em]">
                SYS.UPTIME: 00:00:01
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[7px] font-mono text-[var(--fg-3)] tracking-[0.15em]">
                  LOCATION: KATHMANDU
                </span>
                <span className="text-[7px] font-mono tracking-[0.15em]" style={{ color: "var(--emerald)" }}>
                  ● ONLINE
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Children preload hidden underneath */}
      <div style={{ visibility: "hidden", position: "fixed", inset: 0, zIndex: -1 }}>
        {children}
      </div>
    </>
  );
}
