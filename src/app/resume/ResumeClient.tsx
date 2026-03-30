"use client";

import { SiteConfig, Experience } from "@/types";

interface Props {
  siteConfig: SiteConfig;
  experiences: Experience[];
}

export default function ResumeClient({ siteConfig, experiences }: Props) {
  const capabilities = siteConfig.capabilities || [];
  const education = siteConfig.education || [];
  const techStack = siteConfig.techStack || [];
  const skills = siteConfig.skills || [];

  /* Gather all highlights from experiences for "Selected Accomplishments" */
  const allHighlights = experiences
    .flatMap((exp) => exp.highlights.map((h) => h))
    .slice(0, 5);

  /* Build a keyword string from capabilities or techStack */
  const keywords =
    capabilities.length > 0
      ? capabilities.flatMap((c) => c.skills).slice(0, 10)
      : techStack.slice(0, 10);

  return (
    <>
      <style jsx global>{`
        @media print {
          /* hide chrome */
          body, html { margin: 0 !important; padding: 0 !important; background: #fff !important; }
          .no-print { display: none !important; }
          .resume-page {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .resume-paper {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 48px 56px !important;
          }
          @page { margin: 0.5in; size: A4; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <div className="resume-page min-h-screen px-4 md:px-8 py-8 md:py-12 max-w-[850px] mx-auto">
        {/* Toolbar — hidden on print */}
        <div className="no-print flex items-center justify-between mb-6">
          <button
            onClick={() => window.history.back()}
            className="text-[12px] font-mono text-[var(--fg-3)] hover:text-[var(--fg)] transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 text-[12px] font-mono tracking-wider uppercase px-6 py-3 rounded-full bg-[var(--cyan)] text-[var(--bg)] font-semibold hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] transition-all"
            data-cursor="Download"
          >
            Download PDF ↓
          </button>
        </div>

        {/* ─── Resume Paper ─── */}
        <div
          className="resume-paper bg-white text-[#222] rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif", padding: "48px 56px" }}
        >
          {/* ── Header ── */}
          <header className="text-center mb-5">
            <h1
              className="text-[28px] font-normal tracking-[0.25em] uppercase text-[#1a1a1a]"
              style={{ letterSpacing: "0.25em" }}
            >
              {siteConfig.name}
            </h1>
            <p className="text-[14px] italic text-[#444] mt-1">
              {siteConfig.role}
            </p>
            <p className="text-[11.5px] text-[#555] mt-2 tracking-wide">
              {[
                siteConfig.location,
                siteConfig.email,
                siteConfig.social?.linkedin
                  ? siteConfig.social.linkedin.replace("https://", "")
                  : null,
              ]
                .filter(Boolean)
                .join("  •  ")}
            </p>
          </header>

          {/* ── Summary ── */}
          <section className="mb-4">
            <p className="text-[12px] leading-[1.7] text-[#333] text-justify">
              {siteConfig.description}
            </p>
          </section>

          {/* ── Core Competencies / Keywords ── */}
          {keywords.length > 0 && (
            <p className="text-center text-[11px] font-bold text-[#222] tracking-wide mb-4">
              {keywords.join("  •  ")}
            </p>
          )}

          {/* ── Selected Accomplishments ── */}
          {allHighlights.length > 0 && (
            <section className="mb-5">
              <SectionRule title="Selected Accomplishments" />
              <ul className="mt-3 space-y-[6px]">
                {allHighlights.map((h, i) => (
                  <li
                    key={i}
                    className="text-[12px] leading-[1.65] text-[#333] pl-5 relative"
                  >
                    <span className="absolute left-0 top-0 text-[10px] text-[#555]">❖</span>
                    {h}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── Experience ── */}
          {experiences.length > 0 && (
            <section className="mb-5">
              <SectionRule title="Experience" />
              <div className="mt-3 space-y-5">
                {experiences.map((exp, idx) => (
                  <div key={exp.id}>
                    {/* Company & Period */}
                    <div className="flex justify-between items-baseline">
                      <p className="text-[13px] font-bold text-[#1a1a1a] uppercase tracking-wide">
                        {exp.company}
                      </p>
                      <span className="text-[11.5px] text-[#555] shrink-0 ml-4">
                        {exp.period}
                      </span>
                    </div>

                    {/* Role */}
                    <p className="text-[12.5px] font-bold text-[#333] mt-[2px]">
                      {exp.role}
                    </p>

                    {/* Description */}
                    <p className="text-[12px] leading-[1.7] text-[#444] mt-2 text-justify">
                      {exp.description}
                    </p>

                    {/* Highlights */}
                    {exp.highlights.length > 0 && idx === 0 && (
                      <ul className="mt-2 space-y-[4px]">
                        {exp.highlights.slice(0, 5).map((h, i) => (
                          <li
                            key={i}
                            className="text-[12px] leading-[1.65] text-[#333] pl-5 relative"
                          >
                            <span className="absolute left-0 top-0 text-[8px] text-[#555]">•</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                    {exp.highlights.length > 0 && idx > 0 && (
                      <ul className="mt-2 space-y-[4px]">
                        {exp.highlights.slice(0, 3).map((h, i) => (
                          <li
                            key={i}
                            className="text-[12px] leading-[1.65] text-[#333] pl-5 relative"
                          >
                            <span className="absolute left-0 top-0 text-[8px] text-[#555]">•</span>
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

          {/* ── Education ── */}
          {education.length > 0 && (
            <section className="mb-5">
              <SectionRule title="Education" />
              <div className="mt-3 space-y-3">
                {education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <p className="text-[13px] font-bold text-[#1a1a1a] uppercase tracking-wide">
                        {edu.institution}
                      </p>
                      <span className="text-[11.5px] text-[#555] shrink-0 ml-4">
                        {edu.period}
                      </span>
                    </div>
                    <p className="text-[12.5px] text-[#333] mt-[2px]">
                      {edu.degree} — {edu.field}
                    </p>
                    {edu.description && (
                      <p className="text-[12px] text-[#555] leading-[1.65] mt-1">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Skills ── */}
          {(capabilities.length > 0 || skills.length > 0) && (
            <section>
              <SectionRule title="Skills" />
              <div className="mt-3 space-y-2">
                {capabilities.length > 0
                  ? capabilities.map((cap) => (
                      <div key={cap.category} className="flex items-baseline gap-2">
                        <span className="text-[11.5px] font-bold text-[#1a1a1a] uppercase tracking-wide min-w-[100px] shrink-0">
                          {cap.category}:
                        </span>
                        <span className="text-[12px] text-[#444]">
                          {cap.skills.join(", ")}
                        </span>
                      </div>
                    ))
                  : skills.map((s) => (
                      <div key={s.label} className="flex items-baseline gap-2">
                        <span className="text-[11.5px] font-bold text-[#1a1a1a] uppercase tracking-wide min-w-[100px] shrink-0">
                          {s.label}:
                        </span>
                        <span className="text-[12px] text-[#444]">
                          {s.skills.join(", ")}
                        </span>
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

/* ── Section Rule — centered title between horizontal lines ── */
function SectionRule({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-0">
      <div className="flex-1 h-px bg-[#999]" />
      <h2
        className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#1a1a1a] px-4 text-center"
        style={{ fontVariant: "small-caps", fontSize: "13px", letterSpacing: "0.18em" }}
      >
        {title}
      </h2>
      <div className="flex-1 h-px bg-[#999]" />
    </div>
  );
}
