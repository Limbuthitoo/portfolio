"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Command {
  id: string;
  label: string;
  desc: string;
  href: string;
  icon: string;
  section: string;
  external?: boolean;
}

const NAV_COMMANDS: Command[] = [
  { id: "home", label: "Home", desc: "Dashboard home", href: "/", icon: "⌂", section: "Navigate" },
  { id: "work", label: "Work", desc: "Project archive", href: "/work", icon: "◆", section: "Navigate" },
  { id: "about", label: "About", desc: "Story & capabilities", href: "/about", icon: "◉", section: "Navigate" },
  { id: "contact", label: "Contact", desc: "Get in touch", href: "/contact", icon: "✉", section: "Navigate" },
];

const ACTION_COMMANDS: Command[] = [
  { id: "email", label: "Send Email", desc: "hello@bijaysubbalimbu.com", href: "mailto:hello@bijaysubbalimbu.com", icon: "✉", section: "Actions", external: true },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [socialCommands, setSocialCommands] = useState<Command[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load social links from config API
  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((config) => {
        const links: Command[] = [];
        if (config.social?.github) links.push({ id: "github", label: "GitHub", desc: "View profile", href: config.social.github, icon: "⟠", section: "Social", external: true });
        if (config.social?.linkedin) links.push({ id: "linkedin", label: "LinkedIn", desc: "Professional profile", href: config.social.linkedin, icon: "◈", section: "Social", external: true });
        if (config.social?.dribbble) links.push({ id: "dribbble", label: "Dribbble", desc: "Design portfolio", href: config.social.dribbble, icon: "◉", section: "Social", external: true });
        setSocialCommands(links);
      })
      .catch(() => {});
  }, []);

  const COMMANDS = [...NAV_COMMANDS, ...socialCommands, ...ACTION_COMMANDS];

  const filtered = COMMANDS.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.desc.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = useCallback(
    (cmd: Command) => {
      setOpen(false);
      setQuery("");
      if (cmd.external) {
        window.open(cmd.href, "_blank");
      } else {
        router.push(cmd.href);
      }
    },
    [router]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setSelectedIndex(0);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    const onToggle = () => {
      setOpen((v) => !v);
      setQuery("");
      setSelectedIndex(0);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("toggle-command-palette", onToggle);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("toggle-command-palette", onToggle);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex]);
    }
  };

  // Group by section
  const sections: Record<string, typeof COMMANDS> = {};
  filtered.forEach((c) => {
    if (!sections[c.section]) sections[c.section] = [];
    sections[c.section].push(c);
  });

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* Palette */}
          <motion.div
            className="fixed z-[61] top-[20%] left-1/2 w-[90vw] max-w-[560px]"
            style={{ x: "-50%" }}
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            <div className="rounded-2xl bg-[rgba(18,18,30,0.95)] backdrop-blur-2xl border border-[var(--border)] shadow-2xl overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
                <span className="text-[var(--fg-3)] text-sm">⌘</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-sm text-[var(--fg)] placeholder:text-[var(--fg-3)] outline-none"
                />
                <kbd className="text-[10px] font-mono text-[var(--fg-3)] bg-[var(--surface)] px-2 py-0.5 rounded-md border border-[var(--border)]">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[300px] overflow-y-auto bento-scroll py-2">
                {Object.entries(sections).map(([section, items]) => (
                  <div key={section}>
                    <p className="px-5 py-1.5 text-[9px] font-mono uppercase tracking-widest text-[var(--fg-3)]">
                      {section}
                    </p>
                    {items.map((cmd) => {
                      flatIndex++;
                      const idx = flatIndex;
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => handleSelect(cmd)}
                          className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                            idx === selectedIndex
                              ? "bg-[var(--surface-active)] text-[var(--fg)]"
                              : "text-[var(--fg-2)] hover:bg-[var(--surface-hover)]"
                          }`}
                        >
                          <span className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-xs">
                            {cmd.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{cmd.label}</p>
                            <p className="text-[11px] text-[var(--fg-3)] truncate">{cmd.desc}</p>
                          </div>
                          {cmd.external && (
                            <span className="text-[10px] text-[var(--fg-3)]">↗</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}

                {filtered.length === 0 && (
                  <p className="px-5 py-8 text-center text-sm text-[var(--fg-3)]">
                    No results found
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
