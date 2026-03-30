"use client";

import Link from "next/link";
import { SiteConfig, Experience } from "@/types";

const COLORS = ["var(--cyan)", "var(--violet)", "var(--emerald)", "var(--rose)", "var(--amber)"];
const NODE_COLORS = ["var(--cyan)", "var(--violet)", "var(--rose)", "var(--amber)"];
const TECH_COLORS = ["var(--cyan)", "var(--fg)", "#3178C6", "#06B6D4", "var(--violet)", "var(--rose)", "var(--emerald)", "var(--amber)"];

const LABEL_EMOJI: Record<string, string> = {
  Building: "🛠️", Creating: "✨", Learning: "📚", Reading: "📖",
  Listening: "🎧", Watching: "📺", Playing: "🎮", Exploring: "🧭",
  Designing: "🎨", Writing: "✍️", Cooking: "🍳", Traveling: "✈️",
  Thinking: "💭", Shipping: "🚀",
};

/* ─── Availability ─── */
export function AvailabilityExpanded({ siteConfig }: { siteConfig?: SiteConfig }) {
  const availability = siteConfig?.availability || "Available for freelance";
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--emerald)] opacity-40" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--emerald)]" />
        </span>
        <p className="text-xl font-bold text-[var(--emerald)]">Open to Work</p>
      </div>
      <p className="text-[15px] text-[var(--fg-2)] leading-relaxed">{availability}</p>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
        <p className="text-[12px] font-mono text-[var(--fg-3)] tracking-[0.15em] uppercase">What I&apos;m looking for</p>
        <div className="flex flex-wrap gap-2">
          {["Full-time roles", "Freelance projects", "Contract work", "Collaborations"].map((item) => (
            <span key={item} className="text-[12px] px-3 py-1.5 rounded-full border border-[var(--emerald)]/20 text-[var(--emerald)] bg-[var(--emerald)]/5">
              {item}
            </span>
          ))}
        </div>
      </div>
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 text-[12px] font-mono tracking-wider uppercase px-6 py-3 rounded-full bg-[var(--cyan)] text-[var(--bg)] font-semibold hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] transition-all"
        data-cursor="Go"
      >
        Get in touch →
      </Link>
    </div>
  );
}

/* ─── Highlights ─── */
export function HighlightsExpanded({ siteConfig }: { siteConfig?: SiteConfig }) {
  const highlights = siteConfig?.highlights?.length
    ? siteConfig.highlights
    : [{ value: "12+", label: "Years Exp" }, { value: "50+", label: "Projects" }, { value: "500+", label: "Designs" }];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {highlights.map((h, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center hover:border-[var(--border-hover)] transition-all"
          >
            <p className="text-3xl md:text-4xl font-extrabold mb-1" style={{ color: i % 2 === 0 ? "var(--violet)" : "var(--cyan)" }}>
              {h.value}
            </p>
            <p className="text-[11px] font-mono text-[var(--fg-3)] tracking-[0.15em] uppercase">{h.label}</p>
          </div>
        ))}
      </div>
      <p className="text-[14px] text-[var(--fg-2)] leading-relaxed">
        Numbers that represent years of dedication, learning, and building across design and development.
      </p>
    </div>
  );
}

/* ─── Location ─── */
export function LocationExpanded({ siteConfig }: { siteConfig?: SiteConfig }) {
  const location = siteConfig?.location || "Kathmandu, Nepal";
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[var(--emerald)] animate-pulse" />
            <p className="text-xl font-bold">{location}</p>
          </div>
          <p className="text-[13px] font-mono text-[var(--fg-3)]">27.72°N, 85.32°E</p>
        </div>
        {/* Map-like grid */}
        <div className="h-32 relative overflow-hidden border-t border-[var(--border)]">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "linear-gradient(rgba(139,92,246,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.8) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--violet)] opacity-30" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[var(--violet)] border-2 border-[var(--bg)]" />
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-[10px] font-mono text-[var(--fg-3)] tracking-[0.15em] uppercase mb-1">Timezone</p>
          <p className="text-[14px] font-medium">NPT (UTC+5:45)</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-[10px] font-mono text-[var(--fg-3)] tracking-[0.15em] uppercase mb-1">Open to</p>
          <p className="text-[14px] font-medium">Remote work globally</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Tech Stack ─── */
export function TechStackExpanded({ siteConfig }: { siteConfig?: SiteConfig }) {
  const tech = siteConfig?.techStack?.length
    ? siteConfig.techStack
    : ["React", "Next.js", "TypeScript", "Tailwind", "Framer", "Figma", "Node", "Three.js"];

  return (
    <div className="space-y-5">
      <p className="text-[14px] text-[var(--fg-2)] leading-relaxed">
        Technologies and tools I use daily to build modern, performant applications.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {tech.map((name, i) => (
          <div
            key={name}
            className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 hover:border-[var(--border-hover)] transition-all"
          >
            <div className="w-2 h-2 rounded-full" style={{ background: TECH_COLORS[i % TECH_COLORS.length] }} />
            <span className="text-[13px] font-mono font-medium" style={{ color: TECH_COLORS[i % TECH_COLORS.length] }}>
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Skills ─── */
export function SkillsExpanded({ siteConfig }: { siteConfig?: SiteConfig }) {
  const groups = siteConfig?.skills?.length
    ? siteConfig.skills
    : [
        { label: "Frontend", skills: ["React", "Next.js", "TypeScript", "Tailwind"] },
        { label: "Design", skills: ["Figma", "Motion", "UI/UX", "Prototyping"] },
        { label: "Backend", skills: ["Node.js", "PostgreSQL", "REST", "Git"] },
      ];

  return (
    <div className="space-y-5">
      {groups.map((group, gi) => (
        <div key={group.label}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ background: COLORS[gi % COLORS.length] }} />
            <span className="text-[12px] font-mono tracking-[0.15em] uppercase font-medium" style={{ color: COLORS[gi % COLORS.length] }}>
              {group.label}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {group.skills.map((skill) => (
              <span
                key={skill}
                className="text-[12px] font-mono px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--fg-2)] hover:border-[var(--border-hover)] hover:text-[var(--fg)] transition-colors"
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

/* ─── Experience ─── */
export function ExperienceExpanded({ experiences }: { experiences: Experience[] }) {
  return (
    <div className="space-y-0">
      {experiences.map((exp, i) => (
        <div key={exp.id} className="relative pl-7 py-5 group">
          {/* Timeline line */}
          {i < experiences.length - 1 && (
            <div className="absolute left-[5px] top-8 bottom-0 w-px bg-[var(--border)]" />
          )}
          {/* Node */}
          <div
            className="absolute left-0 top-6 w-3 h-3 rounded-full border-2 bg-[var(--bg)] z-10"
            style={{
              borderColor: NODE_COLORS[i % NODE_COLORS.length],
              boxShadow: `0 0 8px ${NODE_COLORS[i % NODE_COLORS.length]}40`,
            }}
          />
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
            <div className="flex-1 min-w-0">
              <h4 className="text-[15px] font-semibold text-[var(--fg)]">{exp.role}</h4>
              <p className="text-[13px] text-[var(--fg-2)] font-medium">{exp.company}</p>
              <p className="text-[13px] text-[var(--fg-2)] mt-2 leading-relaxed">
                {exp.description}
              </p>
              {exp.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {exp.highlights.map((h) => (
                    <span
                      key={h}
                      className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-[var(--border)] text-[var(--fg-3)] bg-[var(--surface)]"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <span
              className="text-[11px] font-mono shrink-0 sm:ml-3 sm:mt-1"
              style={{ color: NODE_COLORS[i % NODE_COLORS.length] }}
            >
              {exp.period}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Quick Links ─── */
export function QuickLinksExpanded({ siteConfig }: { siteConfig?: SiteConfig }) {
  const social = siteConfig?.social;
  const email = siteConfig?.email || "hello@bijaysubbalimbu.com";

  const LINKS = [
    ...(social?.github ? [{ label: "GitHub", href: social.github, ext: true, desc: "Code repositories and open source" }] : []),
    ...(social?.linkedin ? [{ label: "LinkedIn", href: social.linkedin, ext: true, desc: "Professional network and updates" }] : []),
    ...(social?.dribbble ? [{ label: "Dribbble", href: social.dribbble, ext: true, desc: "Design shots and visual work" }] : []),
    ...(social?.behance ? [{ label: "Behance", href: social.behance, ext: true, desc: "Design case studies and projects" }] : []),
    { label: "Resume", href: "/about", ext: false, desc: "Full background and experience" },
    { label: "Email", href: `mailto:${email}`, ext: true, desc: email },
  ];

  return (
    <div className="space-y-2">
      {LINKS.map((l) => {
        const inner = (
          <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] transition-all group/link">
            <div>
              <p className="text-[14px] font-semibold group-hover/link:text-[var(--cyan)] transition-colors">{l.label}</p>
              <p className="text-[12px] text-[var(--fg-3)] mt-0.5">{l.desc}</p>
            </div>
            <span className="text-[14px] text-[var(--fg-3)] group-hover/link:text-[var(--cyan)] group-hover/link:translate-x-1 transition-all">
              {l.ext ? "↗" : "→"}
            </span>
          </div>
        );

        return l.ext ? (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" data-cursor={l.label}>
            {inner}
          </a>
        ) : (
          <Link key={l.label} href={l.href} data-cursor={l.label}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
}

/* ─── Currently ─── */
export function CurrentlyExpanded({ siteConfig }: { siteConfig?: SiteConfig }) {
  const items = siteConfig?.currently?.length
    ? siteConfig.currently
    : [
        { emoji: "🛠️", label: "Building", value: "Portfolio v2" },
        { emoji: "📚", label: "Learning", value: "Three.js & WebGL" },
        { emoji: "🎧", label: "Listening", value: "Lo-fi beats" },
      ];

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const emoji = LABEL_EMOJI[item.label] || item.emoji;
        return (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--border-hover)] transition-all"
          >
            <span className="text-2xl leading-none">{emoji}</span>
            <div>
              <p className="text-[10px] font-mono text-[var(--fg-3)] tracking-[0.15em] uppercase">{item.label}</p>
              <p className="text-[15px] font-medium text-[var(--fg)]">{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
