"use client";

import { SiteConfig } from "@/types";

export default function AvailabilityCard({ siteConfig }: { siteConfig?: SiteConfig }) {
  const availability = siteConfig?.availability || "Available for freelance";
  return (
    <div data-cursor="Open" className="block h-full">
      <div className="h-full rounded-[var(--card-radius)] bg-[var(--surface)] border border-[var(--border)] p-4 flex flex-col justify-between overflow-hidden relative group hover:border-[var(--violet)]/30 transition-all duration-300">
        {/* Purple gradient bg */}
        <div
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.08) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[9px] sm:text-[11px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">
            Availability
          </span>
          <span className="w-6 h-6 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[12px] text-[var(--fg-3)] group-hover:text-[var(--violet)] group-hover:border-[var(--violet)]/30 transition-colors">
            ↗
          </span>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--emerald)] opacity-30" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--emerald)]" />
            </span>
            <p className="text-[14px] font-semibold text-[var(--emerald)]">
              Open to Work
            </p>
          </div>
          <p className="text-[12px] text-[var(--fg-3)]">
            {availability}
          </p>
        </div>
      </div>
    </div>
  );
}
