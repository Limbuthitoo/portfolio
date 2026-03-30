"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Project } from "@/types";
import MagneticButton from "@/components/common/MagneticButton";

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

export default function UIUXDetailClient({ project, nextProject, currentIndex }: Props) {
  const accent = ACCENT_DATA[currentIndex % ACCENT_DATA.length];

  return (
    <div>
      {/* ─── HERO — Full-bleed immersive ─── */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${project.thumbnail})` }}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
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

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 lg:px-24 pb-12 md:pb-16 z-10">
          <motion.div
            className="flex items-center gap-2 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border" style={{ color: accent.color, borderColor: `rgba(${accent.rgb},0.3)`, background: `rgba(${accent.rgb},0.08)` }}>
              Case Study
            </span>
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border border-white/10 text-white/50 bg-white/5">
              UI/UX Design
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

      {/* ─── META BAR ─── */}
      <RevealSection>
        <div className="px-6 md:px-16 lg:px-24 py-8 max-w-[1400px] mx-auto">
          <div className="flex flex-wrap gap-8 md:gap-14">
            <InfoItem label="Role" value={project.role} accent={accent} />
            {project.timeline && <InfoItem label="Timeline" value={project.timeline} accent={accent} />}
            {project.team && <InfoItem label="Team" value={project.team} accent={accent} />}
            <InfoItem label="Year" value={project.year} accent={accent} />
          </div>

          {/* Tech strip */}
          {project.technologies.length > 0 && (
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-[var(--border)] overflow-x-auto">
              <span className="text-[9px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase shrink-0">Tools</span>
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
          )}
        </div>
      </RevealSection>

      {/* ─── 01 — What I Owned ─── */}
      {project.responsibilities && project.responsibilities.length > 0 && (
        <RevealSection>
          <div className="px-6 md:px-16 lg:px-24 py-12 md:py-16 max-w-[1400px] mx-auto">
            <SectionLabel text="What I Owned" accent={accent} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {project.responsibilities.map((r, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--border-hover)] transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                >
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: accent.color }} />
                  <span className="text-[13px] text-[var(--fg-2)] leading-relaxed">{r}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </RevealSection>
      )}

      {/* ─── 02 — The Challenge ─── */}
      <RevealSection>
        <div className="px-6 md:px-16 lg:px-24 py-12 md:py-16 max-w-[1400px] mx-auto">
          <SectionLabel text="The Challenge" accent={accent} />
          <p className="text-lg md:text-2xl lg:text-3xl font-medium leading-[1.6] text-[var(--fg-2)] max-w-4xl">
            {project.problem}
          </p>
        </div>
      </RevealSection>

      {/* ─── First image — Full-bleed ─── */}
      {project.images.length > 0 && (
        <ParallaxImage src={project.images[0]} />
      )}

      {/* ─── 03 — User Research ─── */}
      {project.research && (
        <RevealSection>
          <div className="px-6 md:px-16 lg:px-24 py-12 md:py-16 max-w-[1400px] mx-auto">
            <SectionLabel text="User Research" accent={accent} />
            {project.research.summary && (
              <p className="text-[15px] md:text-base leading-[1.9] text-[var(--fg-2)] max-w-3xl mb-8">
                {project.research.summary}
              </p>
            )}
            {project.research.quotes && project.research.quotes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.research.quotes.map((q, i) => (
                  <motion.div
                    key={i}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--border-hover)] transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                  >
                    <blockquote className="text-[14px] italic leading-[1.8] text-[var(--fg-2)] mb-3">
                      &ldquo;{q.text}&rdquo;
                    </blockquote>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-[0.15em] uppercase" style={{ color: accent.color }}>
                        {q.source}
                      </span>
                      <span className="text-[10px] text-[var(--fg-3)]">→ {q.insight}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </RevealSection>
      )}

      {/* ─── 04 — Who I Designed For ─── */}
      {project.personas && project.personas.length > 0 && (
        <RevealSection>
          <div className="px-6 md:px-16 lg:px-24 py-12 md:py-16 max-w-[1400px] mx-auto">
            <SectionLabel text="Who I Designed For" accent={accent} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {project.personas.map((p, i) => (
                <motion.div
                  key={i}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--border-hover)] transition-all duration-300"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold" style={{ background: `rgba(${ACCENT_DATA[i % ACCENT_DATA.length].rgb},0.12)`, color: ACCENT_DATA[i % ACCENT_DATA.length].color }}>
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-semibold text-[var(--fg)]">{p.name}</h4>
                      <span className="text-[9px] font-mono uppercase tracking-[0.15em]" style={{ color: accent.color }}>{p.type}</span>
                    </div>
                  </div>
                  <p className="text-[12px] text-[var(--fg-3)] leading-relaxed">{p.needs}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </RevealSection>
      )}

      {/* ─── 05 — The Approach ─── */}
      <RevealSection>
        <div className="px-6 md:px-16 lg:px-24 py-12 md:py-16 max-w-[1400px] mx-auto">
          <SectionLabel text="The Approach" accent={accent} />
          <p className="text-lg md:text-2xl lg:text-3xl font-medium leading-[1.6] text-[var(--fg-2)] max-w-4xl">
            {project.solution}
          </p>
        </div>
      </RevealSection>

      {/* ─── Second image — Full-bleed ─── */}
      {project.images.length > 1 && (
        <ParallaxImage src={project.images[1]} />
      )}

      {/* ─── 06 — Key Design Decisions ─── */}
      {project.designDecisions && project.designDecisions.length > 0 && (
        <RevealSection>
          <div className="px-6 md:px-16 lg:px-24 py-12 md:py-16 max-w-[1400px] mx-auto">
            <SectionLabel text="Key Design Decisions" accent={accent} />
            <div className="space-y-4">
              {project.designDecisions.map((d, i) => (
                <motion.div
                  key={i}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 hover:border-[var(--border-hover)] transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                >
                  <h4 className="text-[15px] font-semibold text-[var(--fg)] mb-3">{d.question}</h4>
                  <p className="text-[14px] leading-[1.8] text-[var(--fg-2)]">{d.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </RevealSection>
      )}

      {/* ─── 07 — Interface Design / Key Screens ─── */}
      {project.keyScreens && project.keyScreens.length > 0 && (
        <div className="px-6 md:px-16 lg:px-24 py-12 md:py-16 max-w-[1400px] mx-auto">
          <RevealSection>
            <SectionLabel text="Interface Design" accent={accent} />
          </RevealSection>
          <div className="space-y-10">
            {project.keyScreens.map((screen, i) => (
              <RevealSection key={i}>
                <div className="rounded-2xl border border-[var(--border)] overflow-hidden hover:border-[var(--border-hover)] transition-all duration-300">
                  {screen.image && (
                    <div className="relative aspect-[16/9] overflow-hidden group/img">
                      <motion.div
                        className="absolute inset-0 bg-cover bg-top"
                        style={{ backgroundImage: `url(${screen.image})` }}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
                      />
                    </div>
                  )}
                  <div className="p-6 md:p-8 bg-[var(--surface)]">
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="text-[11px] font-mono tracking-[0.15em]" style={{ color: accent.color }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h4 className="text-[16px] font-semibold text-[var(--fg)]">{screen.title}</h4>
                    </div>
                    {screen.subtitle && (
                      <span className="text-[12px] text-[var(--fg-3)] block mb-3">{screen.subtitle}</span>
                    )}
                    <p className="text-[14px] leading-[1.8] text-[var(--fg-2)] mb-4">{screen.description}</p>
                    {screen.decisions.length > 0 && (
                      <div>
                        <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-[var(--fg-3)] block mb-2">Key Decisions</span>
                        <div className="flex flex-wrap gap-2">
                          {screen.decisions.map((dec, j) => (
                            <span key={j} className="text-[11px] px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--fg-2)]">
                              {dec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      )}

      {/* ─── Remaining images gallery ─── */}
      {project.images.length > 2 && (
        <RevealSection>
          <div className="px-4 md:px-8 lg:px-16 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.images.slice(2).map((img, i) => (
                <motion.div
                  key={i}
                  className="relative aspect-[16/9] rounded-2xl overflow-hidden group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                >
                  <motion.div
                    className="absolute inset-0 bg-cover bg-top"
                    style={{ backgroundImage: `url(${img})` }}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                </motion.div>
              ))}
            </div>
          </div>
        </RevealSection>
      )}

      {/* ─── 08 — Impact & Outcome ─── */}
      <RevealSection>
        <div className="px-6 md:px-16 lg:px-24 py-16 md:py-24 max-w-[1400px] mx-auto">
          <SectionLabel text="Impact & Outcome" accent={accent} />
          {project.outcome ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
              {project.outcome.title && (
                <h4 className="text-xl md:text-2xl font-bold mb-3" style={{ color: accent.color }}>
                  {project.outcome.title}
                </h4>
              )}
              {project.outcome.description && (
                <p className="text-[15px] leading-[1.8] text-[var(--fg-2)] mb-5">{project.outcome.description}</p>
              )}
              {project.outcome.highlights && project.outcome.highlights.length > 0 && (
                <div className="space-y-3">
                  {project.outcome.highlights.map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: accent.color }} />
                      <span className="text-[14px] text-[var(--fg-2)] leading-relaxed">{h}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-lg md:text-2xl font-medium leading-[1.6] text-[var(--fg)] max-w-3xl">
              {project.impact}
            </p>
          )}
        </div>
      </RevealSection>

      {/* ─── 09 — What I Learned ─── */}
      {project.learnings && project.learnings.length > 0 && (
        <RevealSection>
          <div className="px-6 md:px-16 lg:px-24 py-12 md:py-16 max-w-[1400px] mx-auto">
            <SectionLabel text="What I Learned" accent={accent} />
            <div className="space-y-5">
              {project.learnings.map((l, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                >
                  <span className="text-[12px] font-mono shrink-0 mt-0.5" style={{ color: accent.color }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[15px] leading-[1.8] text-[var(--fg-2)]">{l}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </RevealSection>
      )}

      {/* ─── CTA ─── */}
      <RevealSection>
        <div className="px-6 md:px-16 lg:px-24 py-12 max-w-[1400px] mx-auto">
          <div className="flex flex-wrap items-center gap-4">
            {project.liveUrl && (
              <MagneticButton strength={0.3}>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[12px] font-mono tracking-wider uppercase px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]"
                  style={{ background: accent.color, color: "var(--bg)" }}
                  data-cursor="Visit"
                >
                  View Live ↗
                </a>
              </MagneticButton>
            )}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );
}
