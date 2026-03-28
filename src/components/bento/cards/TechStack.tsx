"use client";

const TECH = [
  { name: "React", color: "var(--cyan)" },
  { name: "Next.js", color: "var(--fg)" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Tailwind", color: "#06B6D4" },
  { name: "Framer", color: "var(--violet)" },
  { name: "Figma", color: "var(--rose)" },
  { name: "Node", color: "var(--emerald)" },
  { name: "Three.js", color: "var(--amber)" },
];

export default function TechStack() {
  return (
    <div className="h-full rounded-[var(--card-radius)] bg-[var(--surface)] border border-[var(--border)] p-4 flex flex-col hover:border-[var(--violet)]/30 transition-colors duration-300 overflow-hidden relative group">
      {/* Purple gradient bg */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 70%, rgba(139,92,246,0.08) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex items-center justify-between mb-2">
        <span className="text-[9px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">
          Tech Stack
        </span>
        <span className="w-6 h-6 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[10px] text-[var(--fg-3)] group-hover:text-[var(--violet)] group-hover:border-[var(--violet)]/30 transition-colors">
          ↗
        </span>
      </div>

      <div className="relative z-10 flex flex-wrap gap-1 flex-1 content-start">
        {TECH.map((t) => (
          <span
            key={t.name}
            className="px-2 py-0.5 rounded-md text-[9px] font-mono border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors"
            style={{ color: t.color }}
          >
            {t.name}
          </span>
        ))}
      </div>
    </div>
  );
}
