"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Project } from "@/types";
import MagneticButton from "@/components/common/MagneticButton";
import TiltCard from "@/components/common/TiltCard";

const ACCENT_DATA = [
  { color: "var(--cyan)", rgb: "0,240,255" },
  { color: "var(--violet)", rgb: "139,92,246" },
  { color: "var(--rose)", rgb: "244,63,94" },
  { color: "var(--amber)", rgb: "245,158,11" },
  { color: "var(--emerald)", rgb: "16,185,129" },
];

interface Props {
  project: Project;
  nextProject: Project;
  currentIndex: number;
}

export default function ProjectDetailClient({ project, nextProject, currentIndex }: Props) {
  const accent = ACCENT_DATA[currentIndex % ACCENT_DATA.length];
  const impactMetrics = extractMetrics(project.impact);
  const heroRef = useRef(null);

  return (
    <div>
      {/* ─── HERO — Full-bleed immersive ─── */}
      <section ref={heroRef} className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        {/* Background image with parallax feel */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${project.thumbnail})` }}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(180deg, rgba(3,3,8,0.2) 0%, rgba(3,3,8,0.4) 40%, rgba(3,3,8,0.85) 75%, var(--bg) 100%)`,
        }} />

        {/* Back button */}
        <motion.div
          className="absolute top-6 left-6 z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/30 backdrop-blur-md text-[12px] font-mono text-white/70 hover:text-white hover:border-white/25 transition-all"
            data-cursor="Back"
          >
            ← Back
          </Link>
        </motion.div>

        {/* Hero text at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 lg:px-24 pb-12 md:pb-16 z-10">
          <motion.div
            className="flex items-center gap-2 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: accent.color, boxShadow: `0 0 10px rgba(${accent.rgb},0.6)` }}
            />
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase" style={{ color: accent.color }}>
              {project.category}
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] text-white mb-4"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {project.title}
            </motion.h1>
          </div>

          <motion.p
            className="text-sm md:text-lg text-white/60 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {project.description}
          </motion.p>
        </div>
      </section>

      {/* ─── META BAR — Sticky info strip ─── */}
      <RevealSection>
        <div className="px-6 md:px-16 lg:px-24 py-8 max-w-[1400px] mx-auto">
          <div className="flex flex-wrap gap-8 md:gap-14">
            <InfoItem label="Role" value={project.role} accent={accent} />
            <InfoItem label="Year" value={project.year} accent={accent} />
            <InfoItem label="Category" value={project.category} accent={accent} />
            {project.liveUrl && (
              <div>
                <span className="text-[9px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase block mb-1.5">Live</span>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] font-medium transition-colors"
                  style={{ color: accent.color }}
                  data-cursor="Visit"
                >
                  View Site ↗
                </a>
              </div>
            )}
          </div>

          {/* Tech strip */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-[var(--border)] overflow-x-auto">
            <span className="text-[9px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase shrink-0">Built with</span>
            <div className="flex gap-2 flex-wrap">
              {project.technologies.map((tech, i) => (
                <motion.span
                  key={tech}
                  className="text-[11px] font-mono px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--fg-2)] hover:border-[var(--border-hover)] hover:text-[var(--fg)] transition-colors"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ─── OVERVIEW — Big text section ─── */}
      <RevealSection>
        <div className="px-6 md:px-16 lg:px-24 py-16 md:py-24 max-w-[1400px] mx-auto">
          <SectionLabel text="Overview" accent={accent} />
          <p className="text-lg md:text-2xl lg:text-3xl font-medium leading-[1.6] text-[var(--fg-2)] max-w-4xl">
            {project.longDescription}
          </p>
        </div>
      </RevealSection>

      {/* ─── IMAGE SHOWCASE 1 — Full-bleed ─── */}
      {project.images.length > 0 && (
        <ParallaxImage src={project.images[0]} />
      )}

      {/* ─── CHALLENGE & APPROACH — Two columns ─── */}
      <div className="px-6 md:px-16 lg:px-24 py-16 md:py-24 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          <RevealSection>
            <SectionLabel text="The Challenge" accent={accent} />
            <p className="text-[15px] md:text-base leading-[1.9] text-[var(--fg-2)]">
              {project.problem}
            </p>
          </RevealSection>
          <RevealSection>
            <SectionLabel text="The Approach" accent={accent} />
            <p className="text-[15px] md:text-base leading-[1.9] text-[var(--fg-2)]">
              {project.solution}
            </p>
          </RevealSection>
        </div>
      </div>

      {/* ─── IMAGE SHOWCASE 2 — Full-bleed ─── */}
      {project.images.length > 1 && (
        <ParallaxImage src={project.images[1]} />
      )}

      {/* ─── IMPACT — Big stats ─── */}
      <RevealSection>
        <div className="px-6 md:px-16 lg:px-24 py-16 md:py-24 max-w-[1400px] mx-auto">
          <SectionLabel text="Impact & Results" accent={accent} />
          {impactMetrics.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-8">
              {impactMetrics.map((metric, i) => (
                <CounterCard key={i} metric={metric} index={i} accent={accent} />
              ))}
            </div>
          ) : (
            <p className="text-lg md:text-2xl font-medium leading-[1.6] text-[var(--fg)] max-w-3xl">
              {project.impact}
            </p>
          )}
        </div>
      </RevealSection>

      {/* ─── CTA ─── */}
      {project.liveUrl && (
        <RevealSection>
          <div className="px-6 md:px-16 lg:px-24 py-12 max-w-[1400px] mx-auto">
            <div className="flex flex-wrap items-center gap-4">
              <MagneticButton strength={0.3}>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[12px] font-mono tracking-wider uppercase px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]"
                  style={{ background: accent.color, color: "var(--bg)" }}
                  data-cursor="Visit"
                >
                  Visit Live Site ↗
                </a>
              </MagneticButton>
              <MagneticButton strength={0.3}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-[12px] font-mono tracking-wider uppercase px-8 py-4 rounded-full border border-[var(--border)] text-[var(--fg-2)] hover:border-[var(--border-hover)] hover:text-[var(--fg)] transition-all"
                  data-cursor="Go"
                >
                  Discuss a project
                </Link>
              </MagneticButton>
            </div>
          </div>
        </RevealSection>
      )}

      {/* ─── NEXT PROJECT — Full-width teaser ─── */}
      <section className="relative mt-8">
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
        <Link href={`/work/${nextProject.slug}`} data-cursor="Next" className="block group">
          <div className="px-6 md:px-16 lg:px-24 py-16 md:py-24 max-w-[1400px] mx-auto">
            <RevealSection>
              <div className="flex items-end justify-between gap-8">
                <div>
                  <span className="text-[10px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase block mb-4">
                    Next Project
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight group-hover:text-[var(--cyan)] transition-colors duration-500">
                    {nextProject.title}
                  </h2>
                  <p className="text-[13px] text-[var(--fg-3)] mt-3 font-mono">{nextProject.category} · {nextProject.year}</p>
                </div>
                <motion.div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--fg-3)] group-hover:border-[var(--cyan)] group-hover:text-[var(--cyan)] transition-all duration-500 shrink-0"
                  whileHover={{ scale: 1.1, x: 8 }}
                >
                  <span className="text-2xl">→</span>
                </motion.div>
              </div>
            </RevealSection>
          </div>
        </Link>
      </section>
    </div>
  );
}

/* ─── Sub-components ─── */

function InfoItem({ label, value, accent }: { label: string; value: string; accent: { color: string } }) {
  return (
    <div>
      <span className="text-[9px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase block mb-1.5">{label}</span>
      <span className="text-[14px] font-medium text-[var(--fg)]">{value}</span>
    </div>
  );
}

function SectionLabel({ text, accent }: { text: string; accent: { color: string; rgb: string } }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="w-2 h-2 rounded-full"
        style={{ background: accent.color, boxShadow: `0 0 8px rgba(${accent.rgb},0.5)` }}
      />
      <span className="text-[11px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">
        {text}
      </span>
      <div className="flex-1 h-px bg-[var(--border)]" />
    </div>
  );
}

/** Scroll-triggered reveal wrapper */
function RevealSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
    >
      {children}
    </motion.div>
  );
}

/** Full-bleed parallax image section */
function ParallaxImage({ src }: { src: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="relative w-full overflow-hidden my-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
    >
      <div className="mx-4 md:mx-8 lg:mx-16">
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden group">
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${src})` }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          />
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );
}

/** Animated counter stat card */
function CounterCard({ metric, index, accent }: { metric: { value: string; label: string }; index: number; accent: { color: string; rgb: string } }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
    >
      <TiltCard className="h-full" tiltStrength={6}>
      <div className="rounded-[var(--card-radius)] border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 text-center hover:border-[var(--border-hover)] transition-all duration-300 group h-full">
      <motion.p
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2"
        style={{ color: accent.color, textShadow: `0 0 30px rgba(${accent.rgb},0.2)` }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 + index * 0.1, type: "spring", stiffness: 200 }}
      >
        {metric.value}
      </motion.p>
      <p className="text-[12px] font-mono text-[var(--fg-3)] tracking-[0.15em] uppercase leading-tight">
        {metric.label}
      </p>
      </div>
      </TiltCard>
    </motion.div>
  );
}

/** Extract numeric metrics from impact text */
function extractMetrics(impact: string): { value: string; label: string }[] {
  const patterns = /(\d+[%+Kk]?\+?)\s+(.+?)(?:,|\.|\band\b|$)/gi;
  const results: { value: string; label: string }[] = [];
  let match;
  while ((match = patterns.exec(impact)) !== null) {
    const value = match[1];
    let label = match[2].trim();
    label = label.replace(/^(?:in|of|by|across|the)\s+/i, "").trim();
    if (label.length > 0 && label.length < 50) {
      results.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
    }
  }
  return results.slice(0, 3);
}
