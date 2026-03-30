"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { SiteConfig } from "@/types";
import MagneticButton from "@/components/common/MagneticButton";

export default function ContactPageClient({ siteConfig }: { siteConfig: SiteConfig }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(form.subject || "Portfolio Inquiry");
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const socials = Object.entries(siteConfig.social).filter(([, url]) => url);

  return (
    <div>
      {/* ─── HERO — Big headline ─── */}
      <section className="px-6 md:px-16 lg:px-24 pt-20 md:pt-32 pb-12 md:pb-20 max-w-[1400px] mx-auto">
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-2 h-2 rounded-full bg-[var(--emerald)]" style={{ boxShadow: "0 0 10px rgba(16,185,129,0.6)" }} />
          <span className="text-[11px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">
            {siteConfig.availability}
          </span>
        </motion.div>

        <div className="overflow-hidden">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[0.95] mb-6"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Let&apos;s build
            <br />
            <span className="text-[var(--fg-3)]">something</span>{" "}
            <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--violet)] bg-clip-text text-transparent">
              great
            </span>
          </motion.h1>
        </div>

        <motion.p
          className="text-base md:text-xl text-[var(--fg-2)] max-w-xl leading-relaxed"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Have a project in mind? I&apos;m always interested in hearing
          about new opportunities and collaborations.
        </motion.p>
      </section>

      {/* ─── MAIN CONTENT — Form + Sidebar ─── */}
      <div className="px-6 md:px-16 lg:px-24 pb-16 md:pb-24 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* ── Form ── */}
          <RevealSection className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field
                  label="Name" name="name" type="text" value={form.name}
                  onChange={(v) => setForm((s) => ({ ...s, name: v }))}
                  focused={focused} onFocus={setFocused}
                />
                <Field
                  label="Email" name="email" type="email" value={form.email}
                  onChange={(v) => setForm((s) => ({ ...s, email: v }))}
                  focused={focused} onFocus={setFocused}
                />
              </div>
              <Field
                label="Subject" name="subject" type="text" value={form.subject}
                onChange={(v) => setForm((s) => ({ ...s, subject: v }))}
                focused={focused} onFocus={setFocused}
              />
              <Field
                label="Message" name="message" type="textarea" value={form.message}
                onChange={(v) => setForm((s) => ({ ...s, message: v }))}
                focused={focused} onFocus={setFocused}
              />

              <div className="pt-2">
                <MagneticButton strength={0.3}>
                  <button
                    type="submit"
                    className={`relative text-[12px] font-mono tracking-wider uppercase px-10 py-4 rounded-full font-semibold transition-all duration-500 ${
                      sent
                        ? "bg-[var(--emerald)] text-[var(--bg)] scale-[1.02]"
                        : "bg-[var(--cyan)] text-[var(--bg)] hover:shadow-[0_0_40px_rgba(0,240,255,0.25)] hover:scale-[1.02]"
                    }`}
                    data-cursor="Send"
                  >
                    {sent ? "Message Sent ✓" : "Send Message →"}
                  </button>
                </MagneticButton>
              </div>
            </form>
          </RevealSection>

          {/* ── Info sidebar ── */}
          <div className="lg:col-span-5 space-y-6">
            <RevealSection>
              <div className="space-y-8">
                <InfoBlock label="Email">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-base md:text-lg font-medium text-[var(--fg)] hover:text-[var(--cyan)] transition-colors duration-300 group/email"
                    data-cursor="Email"
                  >
                    {siteConfig.email}
                    <span className="inline-block ml-2 opacity-0 -translate-x-1 group-hover/email:opacity-100 group-hover/email:translate-x-0 transition-all duration-300 text-[var(--cyan)]">↗</span>
                  </a>
                </InfoBlock>

                <InfoBlock label="Location">
                  <p className="text-base md:text-lg font-medium text-[var(--fg)]">{siteConfig.location}</p>
                </InfoBlock>

                <InfoBlock label="Availability">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--emerald)] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--emerald)]" />
                    </span>
                    <span className="text-base font-medium text-[var(--emerald)]">{siteConfig.availability}</span>
                  </div>
                </InfoBlock>
              </div>
            </RevealSection>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-[var(--border)] to-transparent" />

            {/* Social links */}
            <RevealSection>
              <span className="text-[10px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase block mb-4">
                Connect
              </span>
              <div className="flex flex-wrap gap-2">
                {socials.map(([platform, url]) => (
                  <MagneticButton key={platform} strength={0.2}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase px-5 py-2.5 rounded-full border border-[var(--border)] text-[var(--fg-3)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] hover:bg-[rgba(0,240,255,0.04)] transition-all duration-300"
                      data-cursor={platform}
                    >
                      {platform}
                    </a>
                  </MagneticButton>
                ))}
              </div>
            </RevealSection>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function RevealSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
    >
      {children}
    </motion.div>
  );
}

function InfoBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="text-[10px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase block mb-2">{label}</span>
      {children}
    </div>
  );
}

function Field({
  label,
  name,
  type,
  value,
  onChange,
  focused,
  onFocus,
}: {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  focused: string | null;
  onFocus: (n: string | null) => void;
}) {
  const isActive = focused === name;

  return (
    <div className="relative">
      <label
        className={`text-[10px] font-mono tracking-[0.15em] uppercase block mb-2 transition-colors duration-300 ${
          isActive ? "text-[var(--cyan)]" : "text-[var(--fg-3)]"
        }`}
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => onFocus(name)}
          onBlur={() => onFocus(null)}
          className="w-full bg-transparent rounded-xl border border-[var(--border)] px-4 py-3.5 text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-3)]/40 focus:border-[var(--cyan)] focus:shadow-[0_0_0_1px_var(--cyan),0_0_20px_rgba(0,240,255,0.06)] outline-none transition-all duration-300 resize-none"
          rows={5}
          required
          placeholder={`Your ${label.toLowerCase()}...`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => onFocus(name)}
          onBlur={() => onFocus(null)}
          className="w-full bg-transparent rounded-xl border border-[var(--border)] px-4 py-3.5 text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-3)]/40 focus:border-[var(--cyan)] focus:shadow-[0_0_0_1px_var(--cyan),0_0_20px_rgba(0,240,255,0.06)] outline-none transition-all duration-300"
          required
          placeholder={`Your ${label.toLowerCase()}...`}
        />
      )}
      {/* Accent line under active field */}
      <motion.div
        className="absolute bottom-0 left-4 right-4 h-px bg-[var(--cyan)]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isActive ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: 0 }}
      />
    </div>
  );
}
