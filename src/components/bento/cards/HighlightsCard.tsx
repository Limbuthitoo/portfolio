"use client";

import { SiteConfig } from "@/types";

const DEFAULT_HIGHLIGHTS = [
  { value: "12+", label: "Years Exp" },
  { value: "50+", label: "Projects" },
];

export default function HighlightsCard({ siteConfig }: { siteConfig?: SiteConfig }) {
  const highlights = siteConfig?.highlights?.length ? siteConfig.highlights : DEFAULT_HIGHLIGHTS;
  return (
    <div className="h-full rounded-[var(--card-radius)] bg-[var(--surface)] border border-[var(--border)] p-4 flex flex-col justify-between hover:border-[var(--violet)]/30 transition-colors overflow-hidden relative group">
      {/* Purple gradient bg */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 20% 80%, rgba(139,92,246,0.1) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[9px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">
          Highlights
        </span>
        <span className="w-6 h-6 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[10px] text-[var(--fg-3)] group-hover:text-[var(--violet)] group-hover:border-[var(--violet)]/30 transition-colors">
          ↗
        </span>
      </div>

      <div className="relative z-10 flex items-center gap-2 sm:gap-4 overflow-hidden">
        {highlights.map((h, i) => (
          <div key={i} className="flex items-center gap-2 sm:gap-4 min-w-0">
            {i > 0 && <div className="w-px h-5 sm:h-6 bg-[var(--border)] shrink-0" />}
            <div className="min-w-0">
              <p className="text-base sm:text-xl font-bold leading-none truncate" style={{ color: i === 0 ? "var(--violet)" : "var(--cyan)" }}>{h.value}</p>
              <p className="text-[8px] sm:text-[9px] text-[var(--fg-3)] mt-0.5 truncate">{h.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
