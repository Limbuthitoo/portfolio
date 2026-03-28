"use client";

import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";

export default function StatusBar() {
  const [time, setTime] = useState("");
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Kathmandu",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 sm:px-5 h-10 text-[10px] sm:text-[11px] font-mono border-b border-[var(--border)] overflow-hidden">
      <div className="flex items-center gap-2 text-[var(--fg-2)]">
        <span className="font-semibold text-[var(--cyan)]">bijay.os</span>
        <span className="opacity-40">|</span>
        <span className="text-[var(--fg-3)]">v2026.3</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 text-[var(--fg-3)] shrink-0">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 rounded-md hover:bg-[var(--surface-hover)] transition-colors"
          data-cursor="Theme"
          aria-label="Toggle theme"
        >
          <span className="text-sm">{theme === "dark" ? "☀️" : "🌙"}</span>
          <span className="text-[var(--fg-3)] hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
        <span className="opacity-30 hidden sm:inline">|</span>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--emerald)] animate-pulse" />
          <span className="text-[var(--fg-2)]">Online</span>
        </div>
        <span className="opacity-30 hidden sm:inline">|</span>
        <span className="text-[var(--fg-3)] hidden sm:inline">NPT</span>
        <span>{time || "--:--"}</span>
      </div>
    </div>
  );
}
