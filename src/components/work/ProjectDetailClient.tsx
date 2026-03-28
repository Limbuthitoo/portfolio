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

export default function ProjectDetailClient({ project, nextProject, currentIndex }: Props) {
  const accent = ACCENT_DATA[currentIndex % ACCENT_DATA.length];

  // Extract stat-like metrics from impact string (e.g. "40% reduction", "200+ teams")
  const impactMetrics = extractMetrics(project.impact);

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
        <div className="relative h-72 md:h-96 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-top"
            style={{ backgroundImage: `url(${project.thumbnail})` }}
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom, var(--overlay-start) 0%, var(--overlay-mid) 40%, var(--overlay-solid) 100%)` }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: accent.color, boxShadow: `0 0 8px rgba(${accent.rgb},0.5)` }}
              />
              <span
                className="text-[10px] font-mono tracking-[0.15em] uppercase"
                style={{ color: accent.color }}
              >
                {project.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3">{project.title}</h1>
            <p className="text-[14px] md:text-base text-[var(--fg-2)] max-w-2xl leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>

        {/* Project info bar */}
        <div className="border-b border-[var(--border)] px-6 md:px-10 py-4">
          <div className="flex flex-wrap gap-6 md:gap-10">
            <InfoItem label="Role" value={project.role} />
            <InfoItem label="Year" value={project.year} />
            <InfoItem label="Category" value={project.category} />
            {project.liveUrl && (
              <div>
                <span className="text-[9px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase block mb-1">Live</span>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-medium hover:text-[var(--cyan)] transition-colors"
                  style={{ color: accent.color }}
                  data-cursor="Visit"
                >
                  View Site ↗
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Tech stack strip */}
        <div className="border-b border-[var(--border)] px-6 md:px-10 py-3">
          <div className="flex items-center gap-3 overflow-x-auto">
            <span className="text-[9px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase shrink-0">Built with</span>
            <div className="flex gap-1.5 flex-wrap">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] font-mono px-2.5 py-1 rounded-md border border-[var(--border)] text-[var(--fg-2)] hover:border-[var(--border-hover)] transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 md:px-10 py-8 md:py-12">
          {/* Overview */}
          <AnimatedSection delay={0}>
            <div className="max-w-3xl">
              <SectionLabel text="Overview" accent={accent} />
              <p className="text-[15px] md:text-base leading-[1.8] text-[var(--fg-2)]">
                {project.longDescription}
              </p>
            </div>
          </AnimatedSection>

          {/* Screenshots — first image full width */}
          {project.images.length > 0 && (
            <AnimatedSection delay={0.05}>
              <div className="relative aspect-[16/9] rounded-xl border border-[var(--border)] overflow-hidden group/img">
                <div
                  className="absolute inset-0 bg-cover bg-top group-hover/img:scale-[1.02] transition-transform duration-700"
                  style={{ backgroundImage: `url(${project.images[0]})` }}
                />
              </div>
            </AnimatedSection>
          )}

          {/* Challenge & Approach — side by side on desktop */}
          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <SectionLabel text="The Challenge" accent={accent} />
                <p className="text-[14px] leading-[1.8] text-[var(--fg-2)]">
                  {project.problem}
                </p>
              </div>
              <div>
                <SectionLabel text="The Approach" accent={accent} />
                <p className="text-[14px] leading-[1.8] text-[var(--fg-2)]">
                  {project.solution}
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Second screenshot */}
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

          {/* Impact / Results */}
          <AnimatedSection delay={0.2}>
            <SectionLabel text="Impact & Results" accent={accent} />
            {impactMetrics.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {impactMetrics.map((metric, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center"
                  >
                    <p
                      className="text-2xl md:text-3xl font-bold mb-1"
                      style={{ color: ACCENT_DATA[i % ACCENT_DATA.length].color }}
                    >
                      {metric.value}
                    </p>
                    <p className="text-[11px] text-[var(--fg-3)] leading-tight">{metric.label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[15px] leading-[1.8] text-[var(--fg)] font-medium">
                {project.impact}
              </p>
            )}
          </AnimatedSection>

          {/* CTA */}
          {project.liveUrl && (
            <AnimatedSection delay={0.25}>
              <div className="flex items-center gap-4">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase px-6 py-3 rounded-xl bg-[var(--cyan)] text-[var(--bg)] font-semibold hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all duration-300"
                  data-cursor="Visit"
                >
                  Visit Live Site ↗
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--fg-2)] hover:border-[var(--border-hover)] hover:text-[var(--fg)] transition-all"
                  data-cursor="Go"
                >
                  Discuss a project
                </Link>
              </div>
            </AnimatedSection>
          )}

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

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[9px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase block mb-1">{label}</span>
      <span className="text-[13px] font-medium text-[var(--fg)]">{value}</span>
    </div>
  );
}

function SectionLabel({ text, accent }: { text: string; accent: { color: string; rgb: string } }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: accent.color, boxShadow: `0 0 6px rgba(${accent.rgb},0.5)` }}
      />
      <span className="text-[10px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">
        {text}
      </span>
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

/** Extract numeric metrics from impact text like "40% reduction in cycles, adopted by 200+ teams" */
function extractMetrics(impact: string): { value: string; label: string }[] {
  const patterns = /(\d+[%+Kk]?\+?)\s+(.+?)(?:,|\.|\band\b|$)/gi;
  const results: { value: string; label: string }[] = [];
  let match;
  while ((match = patterns.exec(impact)) !== null) {
    const value = match[1];
    let label = match[2].trim();
    // Clean up label
    label = label.replace(/^(?:in|of|by|across|the)\s+/i, "").trim();
    if (label.length > 0 && label.length < 50) {
      results.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
    }
  }
  return results.slice(0, 3);
}
