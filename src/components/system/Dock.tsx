"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const DOCK_ICONS: Record<string, React.ReactNode> = {
  Home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  ),
  Work: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  ),
  Games: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12h4M8 10v4" />
      <circle cx="15" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="18" cy="13" r="1" fill="currentColor" stroke="none" />
      <path d="M17.32 5H6.68a4 4 0 00-3.978 3.59l-.89 8.01A3 3 0 004.798 20h1.474a2 2 0 001.879-1.316L9 16h6l.849 2.684A2 2 0 0017.728 20h1.474a3 3 0 002.986-3.4l-.89-8.01A4 4 0 0017.32 5z" />
    </svg>
  ),
  About: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 00-16 0" />
    </svg>
  ),
  Contact: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  ),
};

const DOCK_ITEMS = [
  { href: "/", label: "Home", color: "var(--cyan)", rgb: "0,240,255" },
  { href: "/work", label: "Work", color: "var(--violet)", rgb: "139,92,246" },
  { href: "/games", label: "Games", color: "var(--emerald)", rgb: "16,185,129" },
  { href: "/about", label: "About", color: "var(--rose)", rgb: "244,63,94" },
  { href: "/contact", label: "Contact", color: "var(--amber)", rgb: "245,158,11" },
];

export default function Dock() {
  const pathname = usePathname();
  const [tappedLabel, setTappedLabel] = useState<string | null>(null);

  // Auto-hide tapped label after 1.5s
  useEffect(() => {
    if (!tappedLabel) return;
    const t = setTimeout(() => setTappedLabel(null), 1500);
    return () => clearTimeout(t);
  }, [tappedLabel]);

  const handleTap = useCallback((label: string) => {
    setTappedLabel((prev) => (prev === label ? null : label));
  }, []);

  if (pathname.startsWith("/dashboard")) return null;
  if (pathname.startsWith("/games/")) return null;

  return (
    <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[calc(100vw-2rem)]">
      <div className="relative flex items-end justify-center gap-2 sm:gap-2 px-3 sm:px-3 py-2 sm:py-2 rounded-2xl bg-[var(--dock-bg)] backdrop-blur-2xl border border-[var(--border)] gradient-border">
        {DOCK_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} data-cursor={item.label} onClick={() => handleTap(item.label)}>
              <motion.div
                className="relative flex flex-col items-center group"
                whileHover={{ y: -8, scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div
                  className="w-12 h-12 sm:w-12 sm:h-12 rounded-[14px] sm:rounded-[14px] flex items-center justify-center text-lg sm:text-lg transition-all duration-300"
                  style={{
                    background: isActive
                      ? `rgba(${item.rgb},0.12)`
                      : "var(--surface)",
                    border: `1px solid ${isActive ? `rgba(${item.rgb},0.25)` : "var(--border)"}`,
                    boxShadow: isActive
                      ? `0 0 24px rgba(${item.rgb},0.12), 0 0 8px rgba(${item.rgb},0.06)`
                      : "none",
                  }}
                >
                  <span
                    className="transition-all duration-300 flex items-center justify-center"
                    style={{
                      color: isActive ? item.color : "var(--fg-2)",
                      filter: isActive ? `drop-shadow(0 0 6px ${item.color})` : "none",
                    }}
                  >
                    {DOCK_ICONS[item.label]}
                  </span>
                </div>

                {/* Active dot with glow */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1.5 w-1 h-1 rounded-full"
                    style={{
                      background: item.color,
                      boxShadow: `0 0 6px ${item.color}`,
                    }}
                    layoutId="dock-indicator"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                {/* Tooltip — hover on desktop, tap-to-show on mobile (auto-hides) */}
                <div
                  className={`absolute -top-8 px-2.5 py-1 rounded-lg bg-[var(--dock-bg)] backdrop-blur-xl border border-[var(--border)] text-[10px] font-medium text-[var(--fg)] transition-opacity pointer-events-none whitespace-nowrap ${
                    tappedLabel === item.label ? "opacity-100" : "opacity-0 sm:group-hover:opacity-100"
                  }`}
                >
                  {item.label}
                </div>
              </motion.div>
            </Link>
          );
        })}

        {/* Separator */}
        <div className="hidden sm:block w-px h-8 bg-[var(--border)] mx-1" />

        {/* Cmd+K trigger */}
        <motion.button
          onClick={() => {
            window.dispatchEvent(new CustomEvent("toggle-command-palette"));
          }}
          className="hidden sm:flex w-12 h-12 rounded-[14px] items-center justify-center text-sm bg-[var(--surface)] border border-[var(--border)] text-[var(--fg-3)] hover:text-[var(--fg)] hover:border-[var(--border-hover)] transition-all group relative"
          whileHover={{ y: -8, scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          data-cursor="Search"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <div className="absolute -top-8 px-2.5 py-1 rounded-lg bg-[var(--dock-bg)] backdrop-blur-xl border border-[var(--border)] text-[10px] font-medium text-[var(--fg)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Search (⌘K)
          </div>
        </motion.button>
      </div>
    </div>
  );
}
