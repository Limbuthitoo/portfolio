"use client";

import { useEffect, useRef } from "react";
import { Experience } from "@/types";

const NODE_COLORS = ["var(--cyan)", "var(--violet)", "var(--rose)", "var(--amber)"];

function useAutoScroll(speed = 0.3, delay = 1000) {
  const ref = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    let raf: number;
    let started = false;

    const timer = setTimeout(() => { started = true; }, delay);

    const step = () => {
      const el = ref.current;
      if (started && el && !paused.current) {
        const half = el.scrollHeight / 2;
        if (half > 0 && el.scrollHeight > el.clientHeight) {
          el.scrollTop += speed;
          if (el.scrollTop >= half) {
            el.scrollTop -= half;
          }
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); clearTimeout(timer); };
  }, [speed, delay]);

  return { ref, pause: () => { paused.current = true; }, resume: () => { paused.current = false; } };
}

function ExperienceContent({ experiences }: { experiences: Experience[] }) {
  return (
    <>
      {experiences.slice(0, 4).map((exp, i) => (
        <div key={exp.id} className="relative pl-6 py-2.5 group">
          <div
            className="absolute left-0 top-3.5 w-[11px] h-[11px] rounded-full border-2 bg-[var(--bg)] z-10 group-hover:scale-125 transition-transform"
            style={{
              borderColor: NODE_COLORS[i % NODE_COLORS.length],
              boxShadow: `0 0 6px ${NODE_COLORS[i % NODE_COLORS.length]}40`,
            }}
          />
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-0.5">
            <div className="flex-1 min-w-0">
              <h4 className="text-[14px] font-semibold group-hover:text-[var(--cyan)] transition-colors leading-tight">
                {exp.role}
              </h4>
              <p className="text-[12px] text-[var(--fg-2)] font-medium">
                {exp.company}
              </p>
              <p className="text-[12px] text-[var(--fg-2)] mt-1 leading-relaxed line-clamp-2">
                {exp.description}
              </p>
              {exp.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {exp.highlights.slice(0, 2).map((h) => (
                    <span
                      key={h}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded-md border border-[var(--border)] text-[var(--fg-3)] bg-[var(--surface-hover)]"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[11px] font-mono text-[var(--fg-3)] shrink-0 sm:ml-3 sm:mt-0.5"
              style={{ color: NODE_COLORS[i % NODE_COLORS.length] }}
            >
              {exp.period}
            </span>
          </div>
        </div>
      ))}
    </>
  );
}

export default function ExperienceTimeline({
  experiences,
}: {
  experiences: Experience[];
}) {
  const { ref, pause, resume } = useAutoScroll(0.3, 1200);
  return (
    <div className="h-full rounded-[var(--card-radius)] bg-[var(--surface)] border border-[var(--border)] p-4 md:p-5 flex flex-col overflow-hidden hover:border-[var(--violet)]/30 transition-colors duration-300 relative group">
      {/* Purple gradient bg */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(139,92,246,0.08) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex items-center justify-between mb-3">
        <span className="text-[11px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">
          Experience
        </span>
        <span className="w-6 h-6 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[12px] text-[var(--fg-3)] group-hover:text-[var(--violet)] group-hover:border-[var(--violet)]/30 transition-colors">
          ↗
        </span>
      </div>

      <div
        ref={ref}
        onMouseEnter={pause}
        onMouseLeave={resume}
        className="relative z-10 flex-1 min-h-0 overflow-y-auto bento-scroll relative"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="absolute left-[5px] top-1 bottom-1 w-px bg-gradient-to-b from-[var(--violet)] via-[var(--cyan)] to-[var(--border)] opacity-30 z-10" />
        <ExperienceContent experiences={experiences} />
        <ExperienceContent experiences={experiences} />
      </div>
    </div>
  );
}
