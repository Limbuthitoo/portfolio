"use client";

import { SiteConfig } from "@/types";

export default function LocationCard({ siteConfig }: { siteConfig?: SiteConfig }) {
  const location = siteConfig?.location || "Kathmandu, Nepal";
  return (
    <div className="h-full rounded-[var(--card-radius)] bg-[var(--surface)] border border-[var(--border)] p-4 flex flex-col justify-between overflow-hidden relative group hover:border-[var(--violet)]/30 transition-colors duration-300">
      {/* Purple gradient bg */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 80%, rgba(139,92,246,0.08) 0%, transparent 70%)" }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[11px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">
          Based in
        </span>
        <span className="w-6 h-6 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[12px] text-[var(--fg-3)] group-hover:text-[var(--violet)] group-hover:border-[var(--violet)]/30 transition-colors">
          ↗
        </span>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--emerald)] animate-pulse" />
          <span className="text-[14px] font-semibold">{location}</span>
        </div>
        <span className="text-[11px] font-mono text-[var(--fg-3)]">
          27.72°N, 85.32°E
        </span>
      </div>
    </div>
  );
}
