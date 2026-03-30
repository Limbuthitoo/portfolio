"use client";

import { useEffect, useRef, useCallback } from "react";
import { SiteConfig } from "@/types";

const COLORS = ["var(--cyan)", "var(--violet)", "var(--emerald)", "var(--rose)", "var(--amber)"];

const DEFAULT_GROUPS = [
  { label: "Frontend", skills: ["React", "Next.js", "TypeScript", "Tailwind"] },
  { label: "Design", skills: ["Figma", "Motion", "UI/UX", "Prototyping"] },
  { label: "Backend", skills: ["Node.js", "PostgreSQL", "REST", "Git"] },
];

function SkillContent({ groups }: { groups: { label: string; skills: string[] }[] }) {
  return (
    <>
      {groups.map((group, gi) => (
        <div key={group.label} className="pb-2.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: COLORS[gi % COLORS.length] }}
            />
            <span
              className="text-[11px] font-mono tracking-[0.1em] uppercase"
              style={{ color: COLORS[gi % COLORS.length] }}
            >
              {group.label}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {group.skills.map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--fg-2)] hover:border-[var(--violet)]/30 hover:text-[var(--fg)] transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default function SkillsCard({ siteConfig }: { siteConfig?: SiteConfig }) {
  const groups = siteConfig?.skills?.length ? siteConfig.skills : DEFAULT_GROUPS;
  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const userScrollTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleUserScroll = useCallback(() => {
    pausedRef.current = true;
    clearTimeout(userScrollTimer.current);
    userScrollTimer.current = setTimeout(() => { pausedRef.current = false; }, 2000);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf: number;
    const speed = 0.4;

    const step = () => {
      if (!pausedRef.current && el.scrollHeight > el.clientHeight) {
        el.scrollTop += speed;
        // When we've scrolled past the first copy, jump back
        const half = el.scrollHeight / 2;
        if (el.scrollTop >= half) {
          el.scrollTop -= half;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); clearTimeout(userScrollTimer.current); };
  }, []);
  return (
    <div className="h-full rounded-[var(--card-radius)] bg-[var(--surface)] border border-[var(--border)] p-4 overflow-hidden relative flex flex-col hover:border-[var(--violet)]/30 transition-colors duration-300 group">
      {/* Purple gradient bg */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(139,92,246,0.1) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex items-center justify-between mb-3">
        <span className="text-[11px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">
          Skills
        </span>
        <span className="w-6 h-6 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[12px] text-[var(--fg-3)] group-hover:text-[var(--violet)] group-hover:border-[var(--violet)]/30 transition-colors">
          ↗
        </span>
      </div>

      <div
        ref={scrollRef}
        onWheel={handleUserScroll}
        onTouchMove={handleUserScroll}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        className="relative z-10 flex-1 overflow-y-auto bento-scroll"
      >
        <div className="flex flex-col gap-2.5">
          <SkillContent groups={groups} />
        </div>
        <div className="flex flex-col gap-2.5 mt-2.5" aria-hidden>
          <SkillContent groups={groups} />
        </div>
      </div>
    </div>
  );
}
