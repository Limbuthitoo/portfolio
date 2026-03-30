"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types";
import AnimatedText from "@/components/common/AnimatedText";

const ACCENT_MAP: Record<string, { color: string; rgb: string }> = {
  "Web Development": { color: "var(--cyan)", rgb: "0,240,255" },
  "UI/UX Design": { color: "var(--violet)", rgb: "139,92,246" },
  "Motion Design": { color: "var(--rose)", rgb: "244,63,94" },
  "Branding": { color: "var(--amber)", rgb: "245,158,11" },
};
const FALLBACK_ACCENTS = [
  { color: "var(--cyan)", rgb: "0,240,255" },
  { color: "var(--violet)", rgb: "139,92,246" },
  { color: "var(--rose)", rgb: "244,63,94" },
  { color: "var(--amber)", rgb: "245,158,11" },
  { color: "var(--emerald)", rgb: "16,185,129" },
];

function getAccent(project: Project, i: number) {
  return ACCENT_MAP[project.category] || FALLBACK_ACCENTS[i % FALLBACK_ACCENTS.length];
}

export default function WorkPageClient({ projects }: { projects: Project[] }) {
  const types = ["All", "UI/UX", "Frontend", "Other"] as const;
  const [activeType, setActiveType] = useState<string>("All");
  const filtered = activeType === "All" ? projects : projects.filter((p) => {
    if (activeType === "UI/UX") return p.type === 'uiux';
    if (activeType === "Frontend") return p.type === 'frontend';
    return p.type === 'other';
  });

  return (
    <div className="p-4 md:p-6">
      {/* Window chrome */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--border)]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[11px] font-mono text-[var(--fg-3)]">~/work</span>
          </div>
          <div className="w-[52px]" />
        </div>

        <div className="p-5 md:p-8">
          {/* Header row */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" style={{ boxShadow: "0 0 6px var(--cyan)" }} />
                <span className="text-[9px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">Archive</span>
              </div>
              <AnimatedText text="Selected Work" as="h1" splitBy="word" className="text-2xl md:text-4xl font-bold tracking-tight" />
            </div>
            <span className="text-[10px] font-mono text-[var(--fg-3)]">
              {filtered.length}/{projects.length}
            </span>
          </div>

          {/* Type filter tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-6 flex-wrap">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`text-[10px] font-mono tracking-[0.1em] uppercase px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                  activeType === t
                    ? "bg-[var(--cyan)] text-[var(--bg)] border-[var(--cyan)] shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                    : "text-[var(--fg-3)] border-[var(--border)] hover:border-[var(--fg-3)] hover:text-[var(--fg-2)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Project grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeType}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {filtered.map((project, i) => {
                const accent = getAccent(project, i);
                return (
                  <motion.div
                    key={project.slug}
                    initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Link href={`/work/${project.slug}`} data-cursor="View" className="block group">
                      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden relative hover:border-[var(--border-hover)] transition-all duration-300 card-shimmer">
                        {/* Thumbnail area */}
                        <div className="relative h-44 overflow-hidden">
                          <div
                            className="absolute inset-0 bg-cover bg-top opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                            style={{ backgroundImage: `url(${project.thumbnail})` }}
                          />
                          {/* Gradient overlay */}
                          <div
                            className="absolute inset-0"
                            style={{ background: `linear-gradient(to bottom, transparent 0%, var(--overlay-mid) 50%, var(--overlay-end) 100%)` }}
                          />

                          {/* Year + type pills */}
                          <div className="absolute top-3 right-3 flex gap-1.5">
                            <span
                              className="text-[8px] font-mono px-2 py-0.5 rounded-md border backdrop-blur-md"
                              style={{
                                color: project.type === 'uiux' ? 'var(--violet)' : project.type === 'frontend' ? 'var(--cyan)' : 'var(--amber)',
                                borderColor: project.type === 'uiux' ? 'rgba(139,92,246,0.4)' : project.type === 'frontend' ? 'rgba(0,240,255,0.4)' : 'rgba(245,158,11,0.4)',
                                background: 'var(--badge-bg)',
                              }}
                            >
                              {project.type === 'uiux' ? 'UI/UX' : project.type === 'frontend' ? 'Frontend' : 'Other'}
                            </span>
                            <span
                              className="text-[8px] font-mono px-2 py-0.5 rounded-md border backdrop-blur-md"
                              style={{
                                color: accent.color,
                                borderColor: `rgba(${accent.rgb},0.3)`,
                                background: 'var(--badge-bg)',
                              }}
                            >
                              {project.year}
                            </span>
                          </div>

                          {/* Tech tags */}
                          <div className="absolute bottom-3 left-4 flex gap-1.5">
                            {project.technologies.slice(0, 3).map((tech) => (
                              <span
                                key={tech}
                                className="text-[8px] font-mono px-1.5 py-0.5 rounded backdrop-blur-md text-[var(--fg-2)] border border-[var(--border)]"
                                style={{ background: 'var(--badge-bg)' }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: accent.color, boxShadow: `0 0 6px rgba(${accent.rgb},0.5)` }}
                            />
                            <span className="text-[9px] font-mono text-[var(--fg-3)] tracking-[0.15em] uppercase">
                              {project.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold tracking-tight mb-1 group-hover:text-[var(--cyan)] transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-[12px] text-[var(--fg-3)] leading-relaxed line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
                            <span className="text-[10px] font-mono text-[var(--fg-3)]">{project.role}</span>
                            <span
                              className="text-[var(--fg-3)] group-hover:translate-x-1 transition-all text-xs"
                              style={{ color: accent.color }}
                            >
                              →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-[var(--fg-3)] font-mono text-sm">No projects found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
