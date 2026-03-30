"use client";

import { SiteConfig, CurrentlyItem } from "@/types";

const DEFAULT_ITEMS: CurrentlyItem[] = [
  { emoji: "🛠", label: "Building", value: "Portfolio v2" },
  { emoji: "📚", label: "Learning", value: "Three.js & WebGL" },
  { emoji: "🎧", label: "Listening", value: "Lo-fi beats" },
];

export default function CurrentlyCard({ siteConfig }: { siteConfig?: SiteConfig }) {
  const items = siteConfig?.currently?.length ? siteConfig.currently : DEFAULT_ITEMS;

  return (
    <div className="h-full rounded-[var(--card-radius)] bg-[var(--surface)] border border-[var(--border)] p-4 overflow-hidden relative flex flex-col hover:border-[var(--violet)]/30 transition-colors duration-300 group">
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 20% 80%, rgba(6,182,212,0.08) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex items-center justify-between mb-3">
        <span className="text-[11px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">
          Currently
        </span>
        <span className="w-6 h-6 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[12px] text-[var(--fg-3)] group-hover:text-[var(--cyan)] group-hover:border-[var(--cyan)]/30 transition-colors">
          ↗
        </span>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="text-[16px] leading-none shrink-0">{item.emoji}</span>
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-[var(--fg-3)] uppercase tracking-[0.1em]">
                {item.label}
              </span>
              <p className="text-[13px] text-[var(--fg)] font-medium truncate leading-tight">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
