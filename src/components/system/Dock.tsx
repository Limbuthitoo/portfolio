"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const DOCK_ITEMS = [
  { href: "/", label: "Home", icon: "⌂", color: "var(--cyan)", rgb: "0,240,255" },
  { href: "/work", label: "Work", icon: "◆", color: "var(--violet)", rgb: "139,92,246" },
  { href: "/about", label: "About", icon: "◉", color: "var(--rose)", rgb: "244,63,94" },
  { href: "/games", label: "Games", icon: "♟", color: "var(--emerald)", rgb: "16,185,129" },
  { href: "/contact", label: "Contact", icon: "✉", color: "var(--amber)", rgb: "245,158,11" },
];

export default function Dock() {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) return null;

  return (
    <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-1.5rem)] sm:w-auto sm:max-w-[calc(100vw-2rem)]">
      <div className="relative flex items-end justify-center gap-2 sm:gap-2 px-2.5 sm:px-3 py-2.5 sm:py-2 rounded-2xl bg-[var(--dock-bg)] backdrop-blur-2xl border border-[var(--border)] gradient-border">
        {DOCK_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} data-cursor={item.label}>
              <motion.div
                className="relative flex flex-col items-center group"
                whileHover={{ y: -8, scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div
                  className="w-12 h-12 sm:w-12 sm:h-12 rounded-[14px] flex items-center justify-center text-lg sm:text-lg transition-all duration-300"
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
                    className="transition-all duration-300"
                    style={{
                      color: isActive ? item.color : "var(--fg-2)",
                      textShadow: isActive ? `0 0 12px ${item.color}` : "none",
                    }}
                  >
                    {item.icon}
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

                {/* Tooltip */}
                <div className="absolute -top-8 px-2.5 py-1 rounded-lg bg-[var(--dock-bg)] backdrop-blur-xl border border-[var(--border)] text-[10px] font-medium text-[var(--fg)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
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
          <span className="text-base">⌘</span>
          <div className="absolute -top-8 px-2.5 py-1 rounded-lg bg-[var(--dock-bg)] backdrop-blur-xl border border-[var(--border)] text-[10px] font-medium text-[var(--fg)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Search (⌘K)
          </div>
        </motion.button>
      </div>
    </div>
  );
}
