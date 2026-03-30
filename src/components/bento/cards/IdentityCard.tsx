"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SiteConfig } from "@/types";
import { useRotatingText } from "@/lib/hooks";

const ROLES = [
  "Design Engineer",
  "Frontend Developer",
  "UI/UX Designer",
  "Creative Technologist",
];

export default function IdentityCard({ siteConfig }: { siteConfig?: SiteConfig }) {
  const { index: roleIdx } = useRotatingText(ROLES);
  const displayName = siteConfig?.name || "Bijay Subbalimbu";
  const initials = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="h-full rounded-[var(--card-radius)] bg-[var(--surface)] border border-[var(--border)] overflow-hidden relative group hover:border-[var(--border-hover)] transition-colors card-shimmer">
      {/* Ambient gradient background */}
      <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
        <div
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,240,255,0.12), transparent 70%)" }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)" }}
        />
      </div>

      {/* HUD corner decorations */}
      <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-[var(--cyan)] opacity-20" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-[var(--cyan)] opacity-20" />

      <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
        {/* Top section */}
        <div>
          {/* Status line */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--emerald)] animate-pulse" />
            <span className="text-[9px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">
              System Active — Ready
            </span>
          </div>

          {/* Avatar + name */}
          <div className="flex items-start gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--cyan)] to-[var(--violet)] flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-[0_0_24px_rgba(0,240,255,0.15)]">
              {initials}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-tight">
                {displayName}
              </h1>
              <div className="h-5 overflow-hidden mt-1">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={roleIdx}
                    className="text-xs font-mono text-[var(--cyan)] typing-cursor"
                    initial={{ y: 14, opacity: 0, filter: "blur(4px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -14, opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.3 }}
                  >
                    {ROLES[roleIdx]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Bio text */}
          <p className="text-sm text-[var(--fg-2)] leading-relaxed max-w-md">
            12+ years crafting at the intersection of design & code — from pixels to motion to interfaces that feel inevitable.
          </p>
        </div>

        {/* Bottom actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/work"
            className="px-5 py-2.5 rounded-xl bg-[var(--cyan)] text-[var(--bg)] text-sm font-semibold hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all duration-300"
            data-cursor="Go"
          >
            View Work
          </Link>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] text-sm font-medium text-[var(--fg-2)] hover:text-[var(--fg)] hover:border-[var(--border-hover)] transition-colors"
            data-cursor="Go"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
