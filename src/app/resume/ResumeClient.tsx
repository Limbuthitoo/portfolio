"use client";

import { SiteConfig, Experience } from "@/types";

interface Props {
  siteConfig: SiteConfig;
  experiences: Experience[];
}

export default function ResumeClient({ siteConfig, experiences }: Props) {
  const handleDownload = () => {
    window.print();
  };

  const capabilities = siteConfig.capabilities || [];
  const education = siteConfig.education || [];
  const techStack = siteConfig.techStack || [];

  return (
    <>
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .resume-page {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .resume-content {
            border: none !important;
            background: white !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          .resume-h { color: #111 !important; }
          .resume-sub { color: #333 !important; }
          .resume-muted { color: #666 !important; }
          .resume-accent { color: #0891b2 !important; }
          .resume-border { border-color: #e5e7eb !important; }
          .resume-tag { background: #f3f4f6 !important; border-color: #e5e7eb !important; color: #374151 !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <div className="resume-page min-h-screen px-4 md:px-8 py-8 md:py-12 max-w-[900px] mx-auto">
        {/* Download button (hidden on print) */}
        <div className="no-print flex items-center justify-between mb-6">
          <button
            onClick={() => window.history.back()}
            className="text-[12px] font-mono text-[var(--fg-3)] hover:text-[var(--fg)] transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 text-[12px] font-mono tracking-wider uppercase px-6 py-3 rounded-full bg-[var(--cyan)] text-[var(--bg)] font-semibold hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] transition-all"
            data-cursor="Download"
          >
            Download PDF ↓
          </button>
        </div>

        {/* Resume content */}
        <div className="resume-content rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8 md:p-12 space-y-8">
          {/* Header */}
          <header className="pb-6 border-b border-[var(--border)] resume-border">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight resume-h">
              {siteConfig.name}
            </h1>
            <p className="text-base md:text-lg text-[var(--fg-2)] resume-sub mt-1">
              {siteConfig.role}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-[12px] font-mono text-[var(--fg-3)] resume-muted">
              <span>{siteConfig.email}</span>
              <span>·</span>
              <span>{siteConfig.location}</span>
              {siteConfig.social.github && (
                <>
                  <span>·</span>
                  <span>{siteConfig.social.github.replace('https://', '')}</span>
                </>
              )}
              {siteConfig.social.linkedin && (
                <>
                  <span>·</span>
                  <span>{siteConfig.social.linkedin.replace('https://', '')}</span>
                </>
              )}
            </div>
          </header>

          {/* Summary */}
          <section>
            <ResumeHeading>Summary</ResumeHeading>
            <p className="text-[14px] text-[var(--fg-2)] resume-sub leading-relaxed">
              {siteConfig.description}
            </p>
          </section>

          {/* Skills / Tech Stack */}
          {(capabilities.length > 0 || techStack.length > 0) && (
            <section>
              <ResumeHeading>Skills</ResumeHeading>
              {capabilities.length > 0 ? (
                <div className="space-y-3">
                  {capabilities.map((cap) => (
                    <div key={cap.category}>
                      <span className="text-[11px] font-mono text-[var(--cyan)] resume-accent tracking-[0.15em] uppercase font-medium">
                        {cap.category}
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {cap.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[12px] px-2.5 py-1 rounded-md border border-[var(--border)] text-[var(--fg-2)] resume-tag"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[12px] px-2.5 py-1 rounded-md border border-[var(--border)] text-[var(--fg-2)] resume-tag"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <section>
              <ResumeHeading>Experience</ResumeHeading>
              <div className="space-y-5">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                      <div>
                        <h3 className="text-[15px] font-semibold text-[var(--fg)] resume-h">
                          {exp.role}
                        </h3>
                        <p className="text-[13px] text-[var(--fg-2)] resume-sub">{exp.company}</p>
                      </div>
                      <span className="text-[11px] font-mono text-[var(--fg-3)] resume-muted shrink-0">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-[13px] text-[var(--fg-2)] resume-sub leading-relaxed mt-1.5">
                      {exp.description}
                    </p>
                    {exp.highlights.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {exp.highlights.map((h, i) => (
                          <li key={i} className="text-[12px] text-[var(--fg-2)] resume-sub flex items-start gap-2">
                            <span className="text-[var(--cyan)] resume-accent mt-0.5 shrink-0">•</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <ResumeHeading>Education</ResumeHeading>
              <div className="space-y-4">
                {education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                      <div>
                        <h3 className="text-[15px] font-semibold text-[var(--fg)] resume-h">
                          {edu.degree} — {edu.field}
                        </h3>
                        <p className="text-[13px] text-[var(--fg-2)] resume-sub">{edu.institution}</p>
                      </div>
                      <span className="text-[11px] font-mono text-[var(--fg-3)] resume-muted shrink-0">
                        {edu.period}
                      </span>
                    </div>
                    {edu.description && (
                      <p className="text-[12px] text-[var(--fg-2)] resume-sub leading-relaxed mt-1">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

function ResumeHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-[11px] font-mono text-[var(--fg-3)] resume-muted tracking-[0.2em] uppercase">
        {children}
      </h2>
      <div className="flex-1 h-px bg-[var(--border)] resume-border" />
    </div>
  );
}
