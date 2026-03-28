"use client";

import Link from "next/link";
import { Project } from "@/types";

const ACCENTS = [
  { color: "var(--cyan)", rgb: "0,240,255" },
  { color: "var(--violet)", rgb: "139,92,246" },
  { color: "var(--rose)", rgb: "244,63,94" },
  { color: "var(--amber)", rgb: "245,158,11" },
];

export default function ProjectShowcase({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  if (!project) return null;

  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <Link href={`/work/${project.slug}`} data-cursor="Open" className="block h-full">
      <div className="h-full rounded-[var(--card-radius)] overflow-hidden isolate border border-[var(--border)] relative group hover:border-[var(--violet)]/30 transition-all duration-300 card-shimmer">
        {/* Thumbnail image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-top opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
            style={{ backgroundImage: `url(${project.thumbnail})` }}
          />
          {/* Gradient overlay with purple tint */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, var(--overlay-mid) 0%, rgba(139,92,246,0.1) 50%, var(--overlay-end) 100%)`,
            }}
          />
        </div>

        {/* Purple ambient glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 80%, rgba(${accent.rgb},0.12) 0%, transparent 70%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-4">
          {/* Top: meta + arrow */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: accent.color, boxShadow: `0 0 8px rgba(${accent.rgb},0.5)` }}
              />
              <span className="text-[9px] font-mono text-[var(--fg-3)] tracking-[0.15em] uppercase">
                {project.category}
              </span>
            </div>
            <span
              className="w-7 h-7 rounded-lg border flex items-center justify-center text-[11px] opacity-60 group-hover:opacity-100 transition-all backdrop-blur-md group-hover:border-[var(--violet)]/40"
              style={{ borderColor: `rgba(${accent.rgb},0.3)`, color: accent.color, background: 'var(--badge-bg)' }}
            >
              ↗
            </span>
          </div>

          {/* Bottom: title + tech */}
          <div>
            <span
              className="inline-block text-[9px] font-mono px-2 py-0.5 rounded-md border mb-2 backdrop-blur-md"
              style={{ color: accent.color, borderColor: `rgba(${accent.rgb},0.3)`, background: 'var(--badge-bg)' }}
            >
              {project.year}
            </span>
            <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 group-hover:translate-x-1 transition-transform duration-300">
              {project.title}
            </h3>
            <p className="text-[11px] text-[var(--fg-3)] leading-relaxed line-clamp-2 mb-2 group-hover:text-[var(--fg-2)] transition-colors">
              {project.description}
            </p>
            <div className="flex items-center gap-1 flex-wrap">
              {project.technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="text-[8px] font-mono px-1.5 py-0.5 rounded-md backdrop-blur-md border border-[var(--border)] text-[var(--fg-3)]"
                  style={{ background: 'var(--badge-bg)' }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
