"use client";

import Link from "next/link";
import { SiteConfig } from "@/types";

export default function QuickLinks({ siteConfig }: { siteConfig?: SiteConfig }) {
  const social = siteConfig?.social;
  const email = siteConfig?.email || "hello@bijaysubbalimbu.com";

  const LINKS = [
    ...(social?.github ? [{ label: "GitHub", href: social.github, ext: true, icon: "↗" }] : []),
    ...(social?.linkedin ? [{ label: "LinkedIn", href: social.linkedin, ext: true, icon: "↗" }] : []),
    ...(social?.dribbble ? [{ label: "Dribbble", href: social.dribbble, ext: true, icon: "↗" }] : []),
    { label: "Resume", href: "/resume", ext: false, icon: "→" },
    { label: "Email", href: `mailto:${email}`, ext: true, icon: "↗" },
  ];
  return (
    <div className="h-full rounded-[var(--card-radius)] bg-[var(--surface)] border border-[var(--border)] p-4 flex flex-col hover:border-[var(--violet)]/30 transition-colors duration-300 overflow-hidden relative group">
      {/* Purple gradient bg */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(139,92,246,0.08) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">
          Find me on
        </span>
        <span className="w-6 h-6 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[12px] text-[var(--fg-3)] group-hover:text-[var(--violet)] group-hover:border-[var(--violet)]/30 transition-colors">
          ↗
        </span>
      </div>

      <div className="relative z-10 flex flex-wrap gap-1.5 flex-1 content-start">
        {LINKS.map((l) => {
          const cls =
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] text-[13px] font-medium text-[var(--fg-2)] hover:text-[var(--violet)] hover:border-[var(--violet)]/20 transition-all";
          return l.ext ? (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cls}
              data-cursor={l.label}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[12px] opacity-50">{l.icon}</span>
              {l.label}
            </a>
          ) : (
            <Link key={l.label} href={l.href} className={cls} data-cursor={l.label} onClick={(e) => e.stopPropagation()}>
              <span className="text-[12px] opacity-50">{l.icon}</span>
              {l.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
