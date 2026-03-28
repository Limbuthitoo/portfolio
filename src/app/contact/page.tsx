"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/data/siteConfig";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

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

  return (
    <div className="p-4 md:p-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--border)]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[11px] font-mono text-[var(--fg-3)]">~/contact</span>
          </div>
          <div className="w-[52px]" />
        </div>

        <div className="p-5 md:p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" style={{ boxShadow: "0 0 6px var(--cyan)" }} />
              <span className="text-[9px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">Contact</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">Let&apos;s talk</h1>
            <p className="text-[13px] text-[var(--fg-2)] max-w-lg leading-relaxed">
              Have a project in mind? I&apos;m available for freelance work and
              always interested in hearing about new opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Form */}
            <motion.div
              className="lg:col-span-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 card-shimmer relative"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Name" type="text" value={form.name} onChange={(v) => setForm((s) => ({ ...s, name: v }))} />
                  <Field label="Email" type="email" value={form.email} onChange={(v) => setForm((s) => ({ ...s, email: v }))} />
                </div>
                <Field label="Subject" type="text" value={form.subject} onChange={(v) => setForm((s) => ({ ...s, subject: v }))} />
                <Field label="Message" type="textarea" value={form.message} onChange={(v) => setForm((s) => ({ ...s, message: v }))} />

                <button
                  type="submit"
                  className={`text-[11px] font-mono tracking-wider uppercase px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                    sent
                      ? "bg-[var(--emerald)] text-[var(--bg)]"
                      : "bg-[var(--cyan)] text-[var(--bg)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                  }`}
                  data-cursor="Send"
                >
                  {sent ? "Message Sent ✓" : "Send Message →"}
                </button>
              </form>
            </motion.div>

            {/* Info sidebar */}
            <motion.div
              className="lg:col-span-2 space-y-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <InfoCard icon="✉" label="Email" color="var(--cyan)">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-[13px] font-medium text-[var(--fg)] hover:text-[var(--cyan)] transition-colors"
                  data-cursor="Email"
                >
                  {siteConfig.email}
                </a>
              </InfoCard>

              <InfoCard icon="◎" label="Location" color="var(--violet)">
                <p className="text-[13px] font-medium">{siteConfig.location}</p>
              </InfoCard>

              <InfoCard icon="●" label="Status" color="var(--emerald)">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--emerald)] animate-pulse" />
                  <span className="text-[13px] font-medium text-[var(--emerald)]">Available for work</span>
                </div>
              </InfoCard>

              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 card-shimmer relative">
                <span className="text-[9px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase block mb-2.5">Social</span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(siteConfig.social).map(([platform, url]) =>
                    url ? (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] font-mono tracking-wider uppercase px-2.5 py-1.5 rounded-md border border-[var(--border)] text-[var(--fg-3)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] transition-colors"
                        data-cursor={platform}
                      >
                        {platform}
                      </a>
                    ) : null
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  color,
  children,
}: {
  icon: string;
  label: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 card-shimmer relative">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px]" style={{ color }}>{icon}</span>
        <span className="text-[9px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">{label}</span>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const base =
    "w-full bg-[var(--bg)] rounded-lg border border-[var(--border)] px-3.5 py-2.5 text-[13px] text-[var(--fg)] placeholder:text-[var(--fg-3)] focus:border-[var(--cyan)] outline-none transition-colors";

  return (
    <div>
      <label className="text-[9px] font-mono tracking-[0.2em] text-[var(--fg-3)] uppercase block mb-1">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} className={`${base} resize-none`} rows={4} required placeholder={`Your ${label.toLowerCase()}...`} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={base} required placeholder={`Your ${label.toLowerCase()}...`} />
      )}
    </div>
  );
}
