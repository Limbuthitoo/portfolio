"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SiteConfig, Experience } from "@/types";

const CAPABILITIES = [
  {
    category: "Design",
    icon: "◆",
    color: "var(--rose)",
    rgb: "244,63,94",
    skills: ["UI/UX Design", "Graphic Design", "Motion Graphics", "Prototyping", "Design Systems", "Typography", "Brand Identity"],
  },
  {
    category: "Development",
    icon: "⟨/⟩",
    color: "var(--cyan)",
    rgb: "0,240,255",
    skills: ["React / Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js", "Node.js", "HTML / CSS"],
  },
  {
    category: "Tools",
    icon: "⚙",
    color: "var(--amber)",
    rgb: "245,158,11",
    skills: ["Figma", "After Effects", "Adobe Suite", "Blender", "VS Code", "Git", "Vercel"],
  },
];

const STATS = [
  { value: "12+", label: "Years Experience", color: "var(--cyan)", rgb: "0,240,255" },
  { value: "50+", label: "Projects Built", color: "var(--violet)", rgb: "139,92,246" },
  { value: "4", label: "Disciplines", color: "var(--rose)", rgb: "244,63,94" },
  { value: "∞", label: "Curiosity", color: "var(--amber)", rgb: "245,158,11" },
];

export default function AboutPageClient({
  siteConfig,
  experiences,
}: {
  siteConfig: SiteConfig;
  experiences: Experience[];
}) {
  return (
    <div className="px-4 md:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-[1200px] mx-auto">

        {/* ── Hero Section ── */}
        <section className="mb-16 md:mb-24">
          <motion.div
            className="flex items-center gap-2 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] animate-pulse" />
            <span className="text-[10px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">About</span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12 mb-8">
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] mb-4">
                Crafting at the
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, var(--violet) 0%, var(--cyan) 100%)" }}
                >
                  intersection
                </span>
                {" "}of
                <br />
                design & code.
              </h1>
            </motion.div>

            {/* UI/UX Illustration — right side */}
            <motion.div
              className="hidden md:block shrink-0"
              initial={{ opacity: 0, scale: 0.85, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <AboutIllustration />
            </motion.div>
          </div>

          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <p className="text-sm md:text-base text-[var(--fg-2)] leading-relaxed mb-4">
              I&apos;m a multidisciplinary creative with 12+ years at the intersection
              of design and technology. My journey began with graphic design, evolved through
              motion graphics and UI/UX, and now focuses on crafting exceptional frontend experiences.
            </p>
            <p className="text-sm md:text-base text-[var(--fg-2)] leading-relaxed">
              Every pixel I push and every line of code I write is in service of creating
              experiences that feel natural, intuitive, and inevitable.
            </p>
          </motion.div>

          {/* Role + Location */}
          <motion.div
            className="flex items-center gap-4 mt-6 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-mono text-[var(--violet)]">
              <span className="w-3 h-px bg-[var(--violet)]" />
              {siteConfig.role}
            </span>
            <span className="text-[var(--fg-3)]">·</span>
            <span className="text-xs font-mono text-[var(--fg-3)]">{siteConfig.location}</span>
          </motion.div>
        </section>

        {/* ── Stats ── */}
        <section className="mb-16 md:mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </section>

        {/* ── Capabilities ── */}
        <section className="mb-16 md:mb-24">
          <SectionLabel text="Capabilities" color="var(--violet)" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CAPABILITIES.map((cap, i) => (
              <CapabilityCard key={cap.category} cap={cap} index={i} />
            ))}
          </div>
        </section>

        {/* ── Experience ── */}
        <section>
          <SectionLabel text="Experience" color="var(--emerald)" />
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--border)] hidden md:block" />
            <div className="space-y-3">
              {experiences.map((exp, i) => (
                <ExpCard key={exp.id} experience={exp} index={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ── Section Label ── */
function SectionLabel({ text, color }: { text: string; color: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-3 mb-6"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.4 }}
    >
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      <span className="text-[10px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">{text}</span>
      <div className="flex-1 h-px bg-[var(--border)]" />
    </motion.div>
  );
}

/* ── Stat Card ── */
function StatCard({ stat, index }: { stat: typeof STATS[number]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center hover:border-[var(--border-hover)] transition-colors"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <span
        className="text-2xl md:text-3xl font-bold block mb-1"
        style={{ color: stat.color, textShadow: `0 0 20px rgba(${stat.rgb},0.25)` }}
      >
        {stat.value}
      </span>
      <span className="text-[10px] font-mono text-[var(--fg-3)] tracking-[0.12em] uppercase">
        {stat.label}
      </span>
    </motion.div>
  );
}

/* ── Capability Card ── */
function CapabilityCard({ cap, index }: { cap: typeof CAPABILITIES[number]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--border-hover)] transition-colors group"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <span className="text-sm" style={{ color: cap.color }}>{cap.icon}</span>
        <h3 className="text-xs font-mono tracking-[0.15em] uppercase" style={{ color: cap.color }}>
          {cap.category}
        </h3>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {cap.skills.map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 rounded-lg text-[11px] text-[var(--fg-2)] bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:text-[var(--fg)] transition-colors cursor-default"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Experience Card ── */
function ExpCard({ experience, index }: { experience: Experience; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const colors = ["var(--cyan)", "var(--violet)", "var(--rose)", "var(--amber)"];
  const accent = colors[index % colors.length];

  return (
    <motion.div
      ref={ref}
      className="group relative md:pl-8"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      {/* Timeline dot */}
      <div
        className="absolute left-0 top-5 w-[15px] h-[15px] rounded-full border-2 border-[var(--bg)] z-10 hidden md:block"
        style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
      />

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 md:p-5 hover:border-[var(--border-hover)] transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 mb-2">
          <span className="text-[10px] font-mono text-[var(--fg-3)] tracking-wider shrink-0 sm:w-24 sm:pt-0.5">
            {experience.period}
          </span>
          <div className="flex-1">
            <h4
              className="text-sm font-semibold leading-tight transition-colors"
              style={{ color: accent }}
            >
              {experience.role}
            </h4>
            <p className="text-[11px] font-mono text-[var(--fg-3)] mt-0.5">
              {experience.company}
            </p>
          </div>
        </div>
        <p className="text-[12px] md:text-[13px] text-[var(--fg-2)] leading-relaxed sm:pl-28">
          {experience.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ── About UI/UX Illustration ── */
function AboutIllustration() {
  const glass = "backdrop-blur-xl border border-white/[0.12] shadow-lg";

  return (
    <div className="relative w-[340px] lg:w-[400px] h-[380px] lg:h-[440px] select-none pointer-events-none">

      {/* ── Central Phone Mockup ── */}
      <motion.div
        className={`absolute left-[25%] top-[8%] w-[45%] h-[75%] rounded-3xl ${glass}`}
        style={{ background: "rgba(99,76,196,0.2)" }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <svg className="w-3.5 h-3.5 text-white/40" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <div className="flex gap-0.5">
            <div className="w-1 h-1 rounded-full bg-white/30" />
            <div className="w-1 h-1 rounded-full bg-white/30" />
            <div className="w-1 h-1 rounded-full bg-white/30" />
          </div>
        </div>

        {/* Content */}
        <div className="px-3 py-2 flex flex-col gap-2">
          {/* UI/UX text */}
          <div className="flex items-center justify-center py-3">
            <span
              className="text-lg lg:text-xl font-extrabold tracking-tight bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, var(--violet), var(--cyan))" }}
            >
              UI/UX
            </span>
          </div>
          {/* Content bars */}
          <div className="space-y-2">
            <div className="h-2 rounded-full bg-white/[0.1] w-full" />
            <div className="h-2 rounded-full bg-white/[0.08] w-4/5" />
            <div className="h-2 rounded-full bg-white/[0.06] w-3/5" />
            <div className="h-2 rounded-full bg-white/[0.05] w-4/5" />
            <div className="h-2 rounded-full bg-white/[0.04] w-2/3" />
          </div>
        </div>
      </motion.div>

      {/* ── Music Player Card — top left ── */}
      <motion.div
        className={`absolute left-0 top-[2%] w-[38%] rounded-xl ${glass}`}
        style={{ background: "linear-gradient(135deg, rgba(251,146,60,0.35), rgba(236,72,153,0.25))" }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      >
        <div className="p-2.5">
          {/* Three dots */}
          <div className="flex gap-0.5 mb-2">
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <div className="w-1 h-1 rounded-full bg-white/40" />
          </div>
          {/* Music note */}
          <div className="flex items-center justify-center py-2">
            <svg className="w-6 h-6 text-white/70" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
          {/* Play controls */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-2 h-2 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-2/5 rounded-full bg-[var(--amber)]" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Media Control Buttons — bottom left ── */}
      <motion.div
        className="absolute left-0 bottom-[12%] flex items-center gap-1.5"
        animate={{ y: [0, 3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <div className="w-8 h-8 rounded-xl bg-[var(--cyan)]/30 border border-[var(--cyan)]/20 flex items-center justify-center">
          <svg className="w-3 h-3 text-[var(--cyan)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
          </svg>
        </div>
        <div className="w-9 h-9 rounded-xl bg-[var(--rose)]/30 border border-[var(--rose)]/20 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-[var(--rose)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div className="w-8 h-8 rounded-xl bg-[var(--violet)]/30 border border-[var(--violet)]/20 flex items-center justify-center">
          <svg className="w-3 h-3 text-[var(--violet)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
          </svg>
        </div>
      </motion.div>

      {/* ── Search Bar — top right ── */}
      <motion.div
        className={`absolute right-0 top-0 w-[35%] rounded-full px-3 py-1.5 ${glass}`}
        style={{ background: "rgba(255,255,255,0.08)" }}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
      >
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-white/[0.1]" />
          <svg className="w-3 h-3 text-[var(--fg-3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
      </motion.div>

      {/* ── Profile Card — right side ── */}
      <motion.div
        className={`absolute right-0 top-[15%] w-[28%] rounded-xl ${glass}`}
        style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.35), rgba(236,72,153,0.2))" }}
        animate={{ y: [0, -5, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        <div className="p-2.5 flex flex-col items-center">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--amber)]/40 to-[var(--violet)]/40 border border-white/20 flex items-center justify-center mb-1.5">
            <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
            </svg>
          </div>
          {/* Content lines */}
          <div className="w-full space-y-1">
            <div className="h-1 w-4/5 mx-auto rounded-full bg-white/[0.12]" />
            <div className="h-1 w-3/5 mx-auto rounded-full bg-white/[0.08]" />
          </div>
        </div>
      </motion.div>

      {/* ── Contact List Card — bottom right ── */}
      <motion.div
        className={`absolute right-0 bottom-[8%] w-[42%] rounded-xl ${glass}`}
        style={{ background: "linear-gradient(135deg, rgba(244,63,94,0.2), rgba(251,146,60,0.15))" }}
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      >
        <div className="p-2.5 space-y-2">
          {[
            { color: "var(--cyan)", stars: 4 },
            { color: "var(--amber)", stars: 5 },
            { color: "var(--rose)", stars: 3 },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center"
                style={{ background: `color-mix(in srgb, ${item.color} 25%, transparent)`, border: `1px solid color-mix(in srgb, ${item.color} 15%, transparent)` }}
              >
                <svg className="w-2.5 h-2.5" style={{ color: item.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                </svg>
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="h-1 w-4/5 rounded-full bg-white/[0.1]" />
                <div className="h-1 w-3/5 rounded-full bg-white/[0.06]" />
              </div>
              <div className="flex gap-px shrink-0">
                {[...Array(5)].map((_, s) => (
                  <svg key={s} className={`w-2 h-2 ${s < item.stars ? "text-amber-400" : "text-white/10"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Glow behind ── */}
      <div
        className="absolute inset-0 -z-10 blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.4) 0%, rgba(0,240,255,0.1) 50%, transparent 80%)" }}
      />
    </div>
  );
}
