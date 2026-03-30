"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { SiteConfig } from "@/types";

const COLORS = ["var(--cyan)", "var(--violet)", "var(--emerald)", "var(--rose)", "var(--amber)"];

const DEFAULT_GROUPS = [
  { label: "Frontend", skills: ["React", "Next.js", "TypeScript", "Tailwind"] },
  { label: "Design", skills: ["Figma", "Motion", "UI/UX", "Prototyping"] },
  { label: "Backend", skills: ["Node.js", "PostgreSQL", "REST", "Git"] },
];

function SkillContent({ groups }: { groups: { label: string; skills: string[] }[] }) {
  return (
    <div className="flex flex-col gap-2.5 pb-4">
      {groups.map((group, gi) => (
        <div key={group.label}>
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
    </div>
  );
}

export default function SkillsCard({ siteConfig }: { siteConfig?: SiteConfig }) {
  const groups = siteConfig?.skills?.length ? siteConfig.skills : DEFAULT_GROUPS;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const hovered = useRef(false);
  const [contentH, setContentH] = useState(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const measure = () => {
      const h = el.scrollHeight / 2;
      if (h > 0) setContentH(h);
    };
    const timer = setTimeout(measure, 600);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => { clearTimeout(timer); ro.disconnect(); };
  }, []);

  useAnimationFrame((_, delta) => {
    if (hovered.current || contentH <= 0) return;
    const speed = 15;
    let next = y.get() - (speed * delta) / 1000;
    if (next <= -contentH) next += contentH;
    y.set(next);
  });

  // Native wheel listener with { passive: false } so preventDefault works
  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (contentH <= 0) return;
      e.preventDefault();
      e.stopPropagation();
      let next = y.get() - e.deltaY * 0.5;
      next = Math.max(-contentH, Math.min(0, next));
      y.set(next);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [contentH, y]);

  return (
    <div className="h-full rounded-[var(--card-radius)] bg-[var(--surface)] border border-[var(--border)] p-4 overflow-hidden relative flex flex-col hover:border-[var(--violet)]/30 transition-colors duration-300 group">
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
        ref={scrollAreaRef}
        className="relative z-10 flex-1 min-h-0 overflow-hidden"
        onMouseEnter={() => { hovered.current = true; }}
        onMouseLeave={() => { hovered.current = false; }}
      >
        <motion.div ref={wrapperRef} style={{ y }}>
          <SkillContent groups={groups} />
          <SkillContent groups={groups} />
        </motion.div>
      </div>
    </div>
  );
}
