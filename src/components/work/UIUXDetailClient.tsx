"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Project } from "@/types";

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
    <div className="p-4 md:p-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--border)]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[11px] font-mono text-[var(--fg-3)]">~/work/{project.slug}</span>
          </div>
          <Link
            href="/work"
            className="text-[10px] font-mono text-[var(--fg-3)] hover:text-[var(--cyan)] transition-colors"
            data-cursor="Back"
          >
            ← Back
          </Link>
        </div>

        {/* Hero */}
        <div className="relative h-72 md:h-[28rem] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-top"
            style={{ backgroundImage: `url(${project.thumbnail})` }}
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom, var(--overlay-start) 0%, var(--overlay-mid) 40%, var(--overlay-solid) 100%)` }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase px-2.5 py-1 rounded-md border" style={{ color: accent.color, borderColor: `rgba(${accent.rgb},0.3)` }}>
                Case Study
              </span>
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase px-2.5 py-1 rounded-md border border-[var(--border)] text-[var(--fg-3)]">
                UI/UX Design
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3">{project.title}</h1>
            <p className="text-[14px] md:text-base text-[var(--fg-2)] max-w-2xl leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>

        {/* Project meta bar */}
        <div className="border-b border-[var(--border)] px-6 md:px-10 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <MetaItem label="Role" value={project.role} accent={accent} />
            {project.timeline && <MetaItem label="Timeline" value={project.timeline} accent={accent} />}
            {project.team && <MetaItem label="Team" value={project.team} accent={accent} />}
            <MetaItem label="Year" value={project.year} accent={accent} />
          </div>
        </div>

        <div className="px-6 md:px-10 py-8 md:py-12">

          {/* 01 — What I Owned */}
          {project.responsibilities && project.responsibilities.length > 0 && (
            <AnimatedSection delay={0}>
              <NumberedHeading number="01" text="What I Owned" accent={accent} />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {project.responsibilities.map((r, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: accent.color }} />
                    <span className="text-[13px] text-[var(--fg-2)] leading-relaxed">{r}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          )}

          {/* 02 — The Challenge */}
          <AnimatedSection delay={0.05}>
            <NumberedHeading number="02" text="The Challenge" accent={accent} />
            <div className="max-w-3xl">
              <p className="text-[15px] md:text-base leading-[1.9] text-[var(--fg-2)]">
                {project.problem}
              </p>
            </div>
          </AnimatedSection>

          {/* Technology / Tools context */}
          {project.technologies.length > 0 && (
            <AnimatedSection delay={0.07}>
              <div className="max-w-3xl rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6">
                <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-[var(--fg-3)] block mb-3">Tools & Technologies</span>
                <div className="flex gap-2 flex-wrap">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="text-[11px] font-mono px-3 py-1.5 rounded-md border border-[var(--border)] text-[var(--fg-2)]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* First image */}
          {project.images.length > 0 && (
            <AnimatedSection delay={0.08}>
              <div className="relative aspect-[16/9] rounded-xl border border-[var(--border)] overflow-hidden group/img">
                <div
                  className="absolute inset-0 bg-cover bg-top group-hover/img:scale-[1.02] transition-transform duration-700"
                  style={{ backgroundImage: `url(${project.images[0]})` }}
                />
              </div>
            </AnimatedSection>
          )}

          {/* 03 — User Research */}
          {project.research && (
            <AnimatedSection delay={0.1}>
              <NumberedHeading number="03" text="User Research" accent={accent} />
              {project.research.summary && (
                <p className="text-[15px] leading-[1.9] text-[var(--fg-2)] max-w-3xl mb-6">
                  {project.research.summary}
                </p>
              )}
              {project.research.quotes && project.research.quotes.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.research.quotes.map((q, i) => (
                    <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                      <blockquote className="text-[13px] italic leading-[1.8] text-[var(--fg-2)] mb-3">
                        &ldquo;{q.text}&rdquo;
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono tracking-[0.15em] uppercase" style={{ color: accent.color }}>
                          {q.source}
                        </span>
                        <span className="text-[10px] text-[var(--fg-3)]">→ {q.insight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AnimatedSection>
          )}

          {/* 04 — Who I Designed For (Personas) */}
          {project.personas && project.personas.length > 0 && (
            <AnimatedSection delay={0.12}>
              <NumberedHeading number="04" text="Who I Designed For" accent={accent} />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {project.personas.map((p, i) => (
                  <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: `rgba(${ACCENT_DATA[i % ACCENT_DATA.length].rgb},0.15)`, color: ACCENT_DATA[i % ACCENT_DATA.length].color }}>
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-[13px] font-semibold text-[var(--fg)]">{p.name}</h4>
                        <span className="text-[9px] font-mono uppercase tracking-[0.15em]" style={{ color: accent.color }}>{p.type}</span>
                      </div>
                    </div>
                    <p className="text-[12px] text-[var(--fg-3)] leading-relaxed">{p.needs}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          )}

          {/* 05 — The Approach / Solution */}
          <AnimatedSection delay={0.14}>
            <NumberedHeading number="05" text="The Approach" accent={accent} />
            <div className="max-w-3xl">
              <p className="text-[15px] md:text-base leading-[1.9] text-[var(--fg-2)]">
                {project.solution}
              </p>
            </div>
          </AnimatedSection>

          {/* Second image */}
          {project.images.length > 1 && (
            <AnimatedSection delay={0.15}>
              <div className="relative aspect-[16/9] rounded-xl border border-[var(--border)] overflow-hidden group/img">
                <div
                  className="absolute inset-0 bg-cover bg-top group-hover/img:scale-[1.02] transition-transform duration-700"
                  style={{ backgroundImage: `url(${project.images[1]})` }}
                />
              </div>
            </AnimatedSection>
          )}

          {/* 06 — Key Design Decisions */}
          {project.designDecisions && project.designDecisions.length > 0 && (
            <AnimatedSection delay={0.17}>
              <NumberedHeading number="06" text="Key Design Decisions" accent={accent} />
              <div className="space-y-4">
                {project.designDecisions.map((d, i) => (
                  <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6">
                    <h4 className="text-[14px] font-semibold text-[var(--fg)] mb-3">{d.question}</h4>
                    <p className="text-[13px] leading-[1.8] text-[var(--fg-2)]">{d.answer}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          )}

          {/* 07 — Interface Design / Key Screens */}
          {project.keyScreens && project.keyScreens.length > 0 && (
            <AnimatedSection delay={0.19}>
              <NumberedHeading number="07" text="Interface Design" accent={accent} />
              <div className="space-y-8">
                {project.keyScreens.map((screen, i) => (
                  <div key={i} className="rounded-xl border border-[var(--border)] overflow-hidden">
                    {screen.image && (
                      <div className="relative aspect-[16/9] overflow-hidden group/img">
                        <div
                          className="absolute inset-0 bg-cover bg-top group-hover/img:scale-[1.02] transition-transform duration-700"
                          style={{ backgroundImage: `url(${screen.image})` }}
                        />
                      </div>
                    )}
                    <div className="p-5 md:p-6 bg-[var(--surface)]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono tracking-[0.15em]" style={{ color: accent.color }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h4 className="text-[15px] font-semibold text-[var(--fg)]">{screen.title}</h4>
                      </div>
                      {screen.subtitle && (
                        <span className="text-[11px] text-[var(--fg-3)] block mb-2">{screen.subtitle}</span>
                      )}
                      <p className="text-[13px] leading-[1.8] text-[var(--fg-2)] mb-3">{screen.description}</p>
                      {screen.decisions.length > 0 && (
                        <div>
                          <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-[var(--fg-3)] block mb-2">Key Decisions</span>
                          <div className="flex flex-wrap gap-1.5">
                            {screen.decisions.map((dec, j) => (
                              <span key={j} className="text-[10px] px-2.5 py-1 rounded-md border border-[var(--border)] text-[var(--fg-2)]">
                                {dec}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          )}

          {/* Remaining images */}
          {project.images.length > 2 && (
            <AnimatedSection delay={0.21}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.images.slice(2).map((img, i) => (
                  <div key={i} className="relative aspect-[16/9] rounded-xl border border-[var(--border)] overflow-hidden group/img">
                    <div
                      className="absolute inset-0 bg-cover bg-top group-hover/img:scale-[1.02] transition-transform duration-700"
                      style={{ backgroundImage: `url(${img})` }}
                    />
                  </div>
                ))}
              </div>
            </AnimatedSection>
          )}

          {/* 08 — Impact & Outcome */}
          <AnimatedSection delay={0.23}>
            <NumberedHeading number="08" text="Impact & Outcome" accent={accent} />
            {project.outcome ? (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6">
                {project.outcome.title && (
                  <h4 className="text-lg font-bold mb-2" style={{ color: accent.color }}>
                    {project.outcome.title}
                  </h4>
                )}
                {project.outcome.description && (
                  <p className="text-[14px] leading-[1.8] text-[var(--fg-2)] mb-4">{project.outcome.description}</p>
                )}
                {project.outcome.highlights && project.outcome.highlights.length > 0 && (
                  <div className="space-y-2">
                    {project.outcome.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: accent.color }} />
                        <span className="text-[13px] text-[var(--fg-2)]">{h}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-3xl">
                <p className="text-[15px] leading-[1.8] text-[var(--fg-2)]">{project.impact}</p>
              </div>
            )}
          </AnimatedSection>

          {/* 09 — What I Learned */}
          {project.learnings && project.learnings.length > 0 && (
            <AnimatedSection delay={0.25}>
              <NumberedHeading number="09" text="What I Learned" accent={accent} />
              <div className="space-y-4">
                {project.learnings.map((l, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-[11px] font-mono shrink-0 mt-0.5" style={{ color: accent.color }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[14px] leading-[1.8] text-[var(--fg-2)]">{l}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          )}

          {/* CTA */}
          <AnimatedSection delay={0.27}>
            <div className="flex items-center gap-4 flex-wrap">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase px-6 py-3 rounded-xl bg-[var(--cyan)] text-[var(--bg)] font-semibold hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all duration-300"
                  data-cursor="Visit"
                >
                  View Live ↗
                </a>
              )}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--fg-2)] hover:border-[var(--border-hover)] hover:text-[var(--fg)] transition-all"
                data-cursor="Go"
              >
                Discuss a project
              </Link>
            </div>
          </AnimatedSection>

          {/* Next project */}
          <div className="mt-16 pt-8 border-t border-[var(--border)]">
            <Link href={`/work/${nextProject.slug}`} data-cursor="Next" className="block group">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase block mb-2">
                    Next Project
                  </span>
                  <h2 className="text-2xl md:text-4xl font-bold tracking-tight group-hover:text-[var(--cyan)] transition-colors duration-300">
                    {nextProject.title}
                  </h2>
                  <p className="text-[12px] text-[var(--fg-3)] mt-1">{nextProject.category} · {nextProject.year}</p>
                </div>
                <div className="w-12 h-12 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--fg-3)] group-hover:border-[var(--cyan)] group-hover:text-[var(--cyan)] group-hover:translate-x-2 transition-all duration-300">
                  <span className="text-lg">→</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function MetaItem({ label, value, accent }: { label: string; value: string; accent: { color: string; rgb: string } }) {
  return (
    <div>
      <span className="text-[9px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase block mb-1.5">{label}</span>
      <span className="text-[13px] font-medium" style={{ color: accent.color }}>{value}</span>
    </div>
  );
}

function NumberedHeading({ number, text, accent }: { number: string; text: string; accent: { color: string; rgb: string } }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-[11px] font-mono" style={{ color: accent.color }}>{number}</span>
      <div className="w-6 h-px" style={{ background: `rgba(${accent.rgb},0.3)` }} />
      <span className="text-[11px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">{text}</span>
    </div>
  );
}

function AnimatedSection({ children, delay }: { children: React.ReactNode; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="mb-10 md:mb-14"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
