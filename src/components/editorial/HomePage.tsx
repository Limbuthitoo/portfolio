"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Project, Experience } from "@/types";

interface Props {
  projects: Project[];
  experiences: Experience[];
}

/* ─── Section Heading ─── */
function SectionHead({ number, title }: { number: string; title: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className="flex items-baseline gap-4 mb-10"
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <span className="text-[11px] font-mono text-[var(--accent)] tracking-widest">
        {number}
      </span>
      <span className="text-[11px] font-mono text-[var(--fg-3)] tracking-[0.15em] uppercase">
        {title}
      </span>
      <div className="flex-1 h-px bg-[var(--border)] ml-4" />
    </motion.div>
  );
}

/* ─── Hero Section ─── */
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.8], [0, -60]);

  return (
    <section ref={ref} className="relative min-h-[100vh] flex flex-col justify-end px-6 md:px-10 pb-16">
      <motion.div style={{ opacity, y }}>
        {/* Edition metadata */}
        <div className="flex items-center gap-6 mb-8">
          <span className="text-[10px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">
            Folio N°001
          </span>
          <span className="text-[10px] font-mono text-[var(--fg-3)]">—</span>
          <span className="text-[10px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">
            Edition 2026
          </span>
        </div>

        {/* Name */}
        <motion.h1
          className="text-[clamp(3rem,10vw,9rem)] font-bold leading-[0.9] tracking-[-0.04em] mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Bijay
          <br />
          <span className="text-[var(--accent)]">Subbalimbu</span>
        </motion.h1>

        {/* Role + Info */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div>
            <p className="text-[15px] text-[var(--fg-2)] leading-relaxed max-w-md">
              Frontend Developer & UI/UX Designer crafting
              <br className="hidden md:block" />
              animation-driven interactive experiences.
            </p>
          </div>
          <div className="flex items-center gap-8 text-[10px] font-mono text-[var(--fg-3)] tracking-[0.15em] uppercase">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              <span>Available</span>
            </div>
            <span>Kathmandu, NPL</span>
            <span>27.7172°N</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="w-px h-12 bg-[var(--fg-3)]"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  );
}

/* ─── Selected Work (Index) ─── */
function SelectedWork({ projects }: { projects: Project[] }) {
  const featured = projects.filter((p) => p.featured);

  return (
    <section className="px-6 md:px-10 py-20 md:py-32">
      <SectionHead number="01" title="Selected Work" />

      <div className="border-t border-[var(--border)]">
        {featured.map((project, i) => (
          <ProjectLine key={project.slug} project={project} index={i} />
        ))}
      </div>

      <motion.div
        className="mt-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <Link
          href="/work"
          className="text-[11px] font-mono tracking-[0.15em] uppercase text-[var(--fg-3)] hover:text-[var(--accent)] transition-colors duration-300"
          data-cursor="Archive"
        >
          View all projects →
        </Link>
      </motion.div>
    </section>
  );
}

function ProjectLine({ project, index }: { project: Project; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link href={`/work/${project.slug}`} data-cursor="View" className="block">
        <div className="project-line group flex items-center justify-between py-5 md:py-7 border-b border-[var(--border)] relative">
          {/* Number */}
          <div className="flex items-center gap-4 md:gap-8 flex-1 min-w-0">
            <span className="text-[11px] font-mono text-[var(--fg-3)] w-6 shrink-0">
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Title */}
            <h3 className="text-xl md:text-3xl lg:text-4xl font-bold tracking-tight group-hover:text-[var(--accent)] transition-colors duration-300 truncate">
              {project.title}
            </h3>
          </div>

          {/* Category + Year */}
          <div className="hidden md:flex items-center gap-8">
            <span className="text-[11px] font-mono text-[var(--fg-3)] tracking-[0.1em] uppercase">
              {project.category}
            </span>
            <span className="text-[11px] font-mono text-[var(--fg-3)]">
              {project.year}
            </span>
          </div>

          {/* Arrow */}
          <span className="text-[var(--fg-3)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all duration-300 ml-4 text-sm">
            →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Capabilities Section (Categorized Skills) ─── */
const CAPABILITIES = {
  Design: ["UI/UX Design", "Motion Graphics", "Prototyping", "Design Systems", "Brand Identity"],
  Development: ["React / Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Node.js", "Three.js"],
  Tools: ["Figma", "VS Code", "After Effects", "Blender", "Git", "Vercel"],
};

function CapabilitiesSection() {
  return (
    <section className="px-6 md:px-10 py-20 md:py-32 bg-[var(--bg-elevated)]">
      <SectionHead number="02" title="Capabilities" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        {(Object.entries(CAPABILITIES) as [string, string[]][]).map(([category, skills], ci) => (
          <CapabilityColumn key={category} category={category} skills={skills} index={ci} />
        ))}
      </div>

      {/* Tech marquee */}
      <div className="mt-20 overflow-hidden border-t border-b border-[var(--border)] py-4">
        <div className="marquee-track flex items-center gap-8 whitespace-nowrap">
          {[...Array(2)].map((_, set) => (
            <div key={set} className="flex items-center gap-8">
              {["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion", "Figma", "Node.js", "Three.js", "GSAP", "WebGL"].map((tech) => (
                <span
                  key={`${set}-${tech}`}
                  className="text-[12px] font-mono text-[var(--fg-3)] tracking-[0.15em] uppercase"
                >
                  {tech}
                  <span className="text-[var(--accent)] ml-8">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CapabilityColumn({ category, skills, index }: { category: string; skills: string[]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <h3 className="text-[11px] font-mono text-[var(--accent)] tracking-[0.15em] uppercase mb-6">
        {category}
      </h3>
      <ul className="space-y-3">
        {skills.map((skill) => (
          <li key={skill} className="flex items-center gap-3 group">
            <span className="w-1 h-1 rounded-full bg-[var(--border)] group-hover:bg-[var(--accent)] transition-colors" />
            <span className="text-[14px] text-[var(--fg-2)] group-hover:text-[var(--fg)] transition-colors">
              {skill}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ─── Experience Section ─── */
function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <section className="px-6 md:px-10 py-20 md:py-32">
      <SectionHead number="03" title="Experience" />

      <div className="space-y-0 border-t border-[var(--border)]">
        {experiences.map((exp, i) => (
          <ExperienceLine key={exp.id} experience={exp} index={i} />
        ))}
      </div>
    </section>
  );
}

function ExperienceLine({ experience, index }: { experience: Experience; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-12 gap-4 py-6 border-b border-[var(--border)] group"
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div className="col-span-12 md:col-span-3">
        <span className="text-[11px] font-mono text-[var(--fg-3)] tracking-[0.1em]">
          {experience.period}
        </span>
      </div>
      <div className="col-span-12 md:col-span-4">
        <h4 className="text-[15px] font-semibold group-hover:text-[var(--accent)] transition-colors">
          {experience.role}
        </h4>
        <p className="text-[12px] font-mono text-[var(--fg-3)] mt-0.5">
          {experience.company}
        </p>
      </div>
      <div className="col-span-12 md:col-span-5">
        <p className="text-[13px] text-[var(--fg-2)] leading-relaxed">
          {experience.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Footer / Contact ─── */
function FooterSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <footer ref={ref} className="px-6 md:px-10 py-20 md:py-32 bg-[var(--bg-elevated)]">
      <SectionHead number="04" title="Contact" />

      <motion.div
        className="max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p className="text-[clamp(1.5rem,4vw,3.5rem)] font-bold tracking-tight leading-[1.15] mb-10">
          Have a project in mind?
          <br />
          <Link
            href="/contact"
            className="text-[var(--accent)] hover:opacity-80 transition-opacity"
            data-cursor="Go"
          >
            Let&apos;s talk.
          </Link>
        </p>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-10 border-t border-[var(--border)]">
          <a
            href="mailto:hello@bijaysubbalimbu.com"
            className="text-[13px] text-[var(--fg-2)] hover:text-[var(--accent)] transition-colors"
            data-cursor="Email"
          >
            hello@bijaysubbalimbu.com
          </a>

          <div className="flex items-center gap-6">
            {[
              { label: "GitHub", href: "https://github.com" },
              { label: "LinkedIn", href: "https://linkedin.com" },
              { label: "Dribbble", href: "https://dribbble.com" },
              { label: "Twitter", href: "https://twitter.com" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-[var(--fg-3)] tracking-[0.1em] uppercase hover:text-[var(--accent)] transition-colors"
                data-cursor={social.label}
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-16 text-[10px] font-mono text-[var(--fg-3)] tracking-[0.15em] uppercase">
          <span>© 2026 Bijay Subbalimbu</span>
          <span>Kathmandu, Nepal</span>
        </div>
      </motion.div>
    </footer>
  );
}

/* ─── Main Component ─── */
export default function HomePage({ projects, experiences }: Props) {
  return (
    <>
      <HeroSection />
      <SelectedWork projects={projects} />
      <CapabilitiesSection />
      <ExperienceSection experiences={experiences} />
      <FooterSection />
    </>
  );
}
