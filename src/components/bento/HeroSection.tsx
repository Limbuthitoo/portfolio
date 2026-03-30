"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { SiteConfig } from "@/types";
import { useRotatingText } from "@/lib/hooks";
import MagneticButton from "@/components/common/MagneticButton";

const DEFAULT_ROLES = [
  "Design Engineer",
  "Frontend Developer",
  "UI/UX Designer",
  "Creative Technologist",
];

/* ─── Cinematic stagger sequence ─── */
const heroSequence = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const heroChild = (delay = 0) => ({
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
  },
});

export default function HeroSection({ siteConfig }: { siteConfig?: SiteConfig }) {
  const roles = siteConfig?.roles?.length ? siteConfig.roles : DEFAULT_ROLES;
  const { index: roleIdx } = useRotatingText(roles);
  const displayName = siteConfig?.name || "Bijay Subbalimbu";
  const [firstName, ...rest] = displayName.split(" ");
  const lastName = rest.join(" ");
  const tagline = siteConfig?.title || "Creative Frontend Developer";
  const availability = siteConfig?.availability || "Available for work";

  /* Reveal curtain */
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const imgX = useTransform(smoothX, (v) => v * 20);
  const imgY = useTransform(smoothY, (v) => v * 20);
  const imgRotateY = useTransform(smoothX, (v) => v * 8);
  const imgRotateX = useTransform(smoothY, (v) => -v * 8);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <div className="relative px-4 md:px-6 lg:px-8 pt-6 pb-2">
      <div
        ref={containerRef}
        className="relative max-w-[1440px] mx-auto"
        onMouseMove={handleMouseMove}
      >
        {/* Background effects */}
        <div className="absolute inset-0" aria-hidden={true}>
          {/* Concentric radial circles — right side (hidden on mobile) */}
          <div className="hidden md:block">
            {[280, 380, 500, 640].map((size, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  right: `${-size * 0.05}px`,
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: `1px solid rgba(139,92,246,${0.12 - i * 0.025})`,
                }}
              />
            ))}
          </div>

          {/* Purple ambient glow */}
          <div
            className="absolute hidden md:block"
            style={{
              width: 600,
              height: 600,
              right: "-5%",
              top: "50%",
              transform: "translateY(-50%)",
              background:
                "radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.05) 40%, transparent 70%)",
            }}
          />

          {/* Subtle mobile glow */}
          <div
            className="absolute md:hidden"
            style={{
              width: 300,
              height: 300,
              right: "-20%",
              top: "20%",
              background:
                "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
            }}
          />

          {/* Subtle top-left cyan glow */}
          <div
            className="absolute"
            style={{
              width: 400,
              height: 400,
              left: "0%",
              top: "-10%",
              background:
                "radial-gradient(circle, rgba(0,240,255,0.04) 0%, transparent 70%)",
            }}
          />

          {/* Fine grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(139,92,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.4) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Main layout — left text + right image */}
        <motion.div
          className="relative z-10 flex flex-col md:flex-row items-start md:items-stretch"
          variants={heroSequence}
          initial="hidden"
          animate={revealed ? "show" : "hidden"}
        >

          {/* Left content */}
          <div className="flex-1 px-5 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-14 md:py-20 lg:py-24 w-full md:max-w-2xl">
            {/* Status badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--violet)]/20 bg-[var(--violet)]/5 mb-8"
              variants={heroChild(0)}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--emerald)] animate-pulse" />
              <span className="text-[12px] font-medium text-[var(--fg-2)] tracking-wide">
                {availability}
              </span>
            </motion.div>

            {/* Name — split letter reveal */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-6xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[0.95] mb-4 sm:mb-6 overflow-hidden"
              variants={heroChild(0)}
            >
              <span className="block overflow-hidden">
                {firstName.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ y: "120%", rotateX: -40 }}
                    animate={revealed ? { y: "0%", rotateX: 0 } : {}}
                    transition={{
                      duration: 0.8,
                      delay: 0.2 + i * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
              <span className="block overflow-hidden">
                {lastName.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    className="inline-block bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, var(--violet) 0%, var(--cyan) 100%)",
                    }}
                    initial={{ y: "120%", rotateX: -40 }}
                    animate={revealed ? { y: "0%", rotateX: 0 } : {}}
                    transition={{
                      duration: 0.8,
                      delay: 0.35 + i * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            {/* Description — line reveal */}
            <motion.p
              className="text-sm md:text-base text-[var(--fg-2)] max-w-md leading-relaxed mb-8"
              variants={heroChild(0.15)}
            >
              {tagline}
            </motion.p>

            {/* Rotating role */}
            <motion.div
              className="h-6 mb-8"
              variants={heroChild(0.2)}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={roleIdx}
                  className="inline-flex items-center gap-2 text-xs md:text-sm font-mono"
                  style={{ color: "var(--violet)" }}
                  initial={{ y: 12, opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -12, opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span
                    className="w-3 h-px bg-[var(--violet)]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  />
                  {roles[roleIdx]}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex items-center gap-3 mb-8 sm:mb-14"
              variants={heroChild(0.3)}
            >
              <MagneticButton strength={0.4}>
                <Link
                  href="/work"
                  className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl bg-[var(--violet)] text-white text-sm font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300"
                  data-cursor="Go"
                >
                  Explore
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.4}>
                <Link
                  href="/contact"
                  className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-medium text-[var(--fg)] hover:border-[var(--border-hover)] transition-colors"
                  data-cursor="Go"
                >
                  Contact
                </Link>
              </MagneticButton>
            </motion.div>
          </div>

          {/* Right side — coded UI/UX illustration */}
          <div className="hidden md:flex flex-1 items-center justify-center relative py-10" style={{ perspective: "1000px" }}>
            <motion.div
              className="relative w-full max-w-[550px]"
              style={{
                x: imgX,
                y: imgY,
                rotateY: imgRotateY,
                rotateX: imgRotateX,
              }}
              initial={{ opacity: 0, scale: 0.7, x: 60, filter: "blur(12px)" }}
              animate={revealed ? { opacity: 1, scale: 1, x: 0, filter: "blur(0px)" } : {}}
              transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Glow behind */}
              <div
                className="absolute inset-0 -z-10 blur-3xl opacity-40"
                style={{
                  background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, rgba(0,240,255,0.1) 50%, transparent 80%)",
                  transform: "scale(1.4)",
                }}
              />

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <HeroIllustration />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Coded UI/UX Illustration ─── */
function HeroIllustration() {
  const glass = "backdrop-blur-xl border border-white/[0.12] shadow-xl";

  return (
    <div className="relative w-full aspect-square select-none pointer-events-none">

      {/* ── Star Rating — top center ── */}
      <motion.div
        className={`absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-1 px-4 py-2 rounded-full ${glass}`}
        style={{ background: "rgba(139,92,246,0.15)" }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      >
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </motion.div>

      {/* ── Profile Avatar — top right ── */}
      <motion.div
        className="absolute top-4 right-[6%] w-14 h-14 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, var(--violet), var(--rose), var(--amber), var(--violet))",
          padding: 2,
        }}
        animate={{ y: [0, -5, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <div className="w-full h-full rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
          <svg className="w-6 h-6 text-[var(--violet)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
          </svg>
        </div>
      </motion.div>

      {/* ── Circular Progress — left side ── */}
      <motion.div
        className={`absolute left-0 top-[22%] w-20 h-24 rounded-2xl p-3 ${glass}`}
        style={{ background: "rgba(139,92,246,0.1)" }}
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      >
        <div className="relative w-14 h-14 mx-auto">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 42 42">
            <circle cx="21" cy="21" r="18" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="3" />
            <circle cx="21" cy="21" r="18" fill="none" stroke="url(#prog-grad)" strokeWidth="3" strokeDasharray="73.5 113" strokeLinecap="round" />
            <defs>
              <linearGradient id="prog-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--rose)" />
                <stop offset="100%" stopColor="var(--violet)" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-[var(--fg)]">65%</span>
        </div>
        <div className="mt-1.5 h-1.5 rounded-full bg-[var(--cyan)]/30 overflow-hidden">
          <div className="h-full w-3/4 rounded-full bg-[var(--cyan)]" />
        </div>
      </motion.div>

      {/* ── Main Browser Window — center ── */}
      <div
        className={`absolute top-[12%] left-[14%] right-[12%] rounded-2xl overflow-hidden ${glass}`}
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        {/* Browser bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.08]">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
            <div className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
            <div className="w-2 h-2 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 mx-3">
            <div className="flex items-center gap-2 rounded-lg bg-white/[0.06] border border-white/[0.08] px-3 py-1.5">
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.08]" />
              <svg className="w-3 h-3 text-[var(--fg-3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-4">
          {/* Title */}
          <div className="text-center mb-4">
            <span
              className="text-2xl lg:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, var(--violet) 0%, var(--cyan) 100%)" }}
            >
              UI / UX
            </span>
          </div>

          {/* Three card grid */}
          <div className="grid grid-cols-3 gap-2">
            {[
              "linear-gradient(135deg, #f97316, #ec4899)",
              "linear-gradient(135deg, #8B5CF6, #3B82F6)",
              "linear-gradient(135deg, #06B6D4, #10B981)",
            ].map((bg, i) => (
              <div key={i} className="rounded-lg border border-white/[0.08] bg-white/[0.04] overflow-hidden">
                <div className="aspect-[4/3] rounded-t-md m-1.5" style={{ background: bg, opacity: 0.7 }} />
                <div className="px-1.5 pb-2 space-y-1">
                  <div className="h-1 w-10 rounded-full bg-white/[0.1]" />
                  <div className="h-1 w-7 rounded-full bg-white/[0.06]" />
                </div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, var(--violet), var(--cyan))" }}
              initial={{ width: "0%" }}
              animate={{ width: "72%" }}
              transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* ── Image Gallery Card — right side ── */}
      <motion.div
        className={`absolute right-[5%] top-[40%] w-28 rounded-xl overflow-hidden ${glass}`}
        style={{ background: "rgba(139,92,246,0.1)" }}
        animate={{ y: [0, -6, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        <div className="p-2">
          <div className="aspect-[4/3] rounded-lg mb-2" style={{ background: "linear-gradient(135deg, var(--amber), var(--violet))", opacity: 0.5 }}>
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5" />
              </svg>
            </div>
          </div>
          <div className="space-y-1 px-0.5">
            <div className="h-1 w-full rounded-full bg-white/[0.1]" />
            <div className="h-1 w-2/3 rounded-full bg-white/[0.06]" />
          </div>
        </div>
      </motion.div>

      {/* ── Toggle Switches — bottom right ── */}
      <motion.div
        className="absolute bottom-[15%] right-[10%] flex flex-col gap-2"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
      >
        <div className="w-10 h-5 rounded-full bg-[var(--cyan)]/30 border border-[var(--cyan)]/20 flex items-center px-0.5">
          <div className="w-4 h-4 rounded-full bg-[var(--cyan)] ml-auto shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
        </div>
        <div className="w-10 h-5 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center px-0.5">
          <div className="w-4 h-4 rounded-full" style={{ background: "conic-gradient(var(--rose), var(--amber), var(--rose))" }} />
        </div>
      </motion.div>

      {/* ── Slider — left bottom ── */}
      <motion.div
        className="absolute left-[6%] bottom-[20%] flex flex-col items-center gap-1"
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
      >
        <div className="w-1 h-24 rounded-full bg-white/[0.08] relative">
          <div className="absolute bottom-0 w-1 h-14 rounded-full" style={{ background: "linear-gradient(to top, var(--amber), var(--violet))" }} />
          <div className="absolute bottom-[55%] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white/40 bg-[var(--bg-elevated)]" />
        </div>
      </motion.div>

      {/* ── Floating dots ── */}
      <motion.div
        className="absolute top-[35%] left-[10%] w-3 h-3 rounded-full bg-[var(--emerald)]"
        style={{ opacity: 0.5, boxShadow: "0 0 10px rgba(16,185,129,0.5)" }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[30%] left-[22%] w-2 h-2 rounded-full bg-[var(--violet)]"
        style={{ opacity: 0.4, boxShadow: "0 0 8px rgba(139,92,246,0.4)" }}
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div
        className="absolute top-[18%] right-[25%] w-2 h-2 rounded-full bg-[var(--cyan)]"
        style={{ opacity: 0.3, boxShadow: "0 0 8px rgba(0,240,255,0.3)" }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3.3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />
    </div>
  );
}
