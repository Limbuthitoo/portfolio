"use client";

import { SiteConfig, CurrentlyItem } from "@/types";

const LABEL_EMOJI: Record<string, string> = {
  Building: "🛠️", Creating: "✨", Learning: "📚", Reading: "📖",
  Listening: "🎧", Watching: "📺", Playing: "🎮", Exploring: "🧭",
  Designing: "🎨", Writing: "✍️", Cooking: "🍳", Traveling: "✈️",
  Thinking: "💭", Shipping: "🚀",
};

const DEFAULT_ITEMS: CurrentlyItem[] = [
  { emoji: "🛠️", label: "Building", value: "Portfolio v2" },
  { emoji: "📚", label: "Learning", value: "Three.js & WebGL" },
  { emoji: "🎧", label: "Listening", value: "Lo-fi beats" },
];

function getEmoji(item: CurrentlyItem): string {
  return LABEL_EMOJI[item.label] || item.emoji;
}

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

      <div className="relative z-10 flex-1 grid grid-cols-3 gap-3 items-center">
        {items.slice(0, 3).map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-1">
            <span className="text-[18px] leading-none">{getEmoji(item)}</span>
            <span className="text-[9px] font-mono text-[var(--fg-3)] uppercase tracking-[0.12em]">
              {item.label}
            </span>
            <p className="text-[12px] text-[var(--fg)] font-medium leading-tight truncate w-full">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
