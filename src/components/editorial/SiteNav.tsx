"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
      <nav className="flex items-center justify-between px-6 md:px-10 py-5">
        {/* Logo / Name */}
        <Link href="/" className="group" data-cursor="Home">
          <span className="text-[13px] font-medium tracking-[0.08em] uppercase text-white">
            Bijay Subbalimbu
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative group"
                data-cursor={item.label}
              >
                <span
                  className={`text-[12px] tracking-[0.1em] uppercase transition-colors duration-300 ${
                    isActive ? "text-white" : "text-white/40 hover:text-white/80"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-px bg-white"
                    layoutId="nav-indicator"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* Command palette trigger */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("toggle-command-palette"))}
            className="text-[12px] tracking-[0.1em] text-white/30 hover:text-white/60 transition-colors hidden md:block"
            data-cursor="Search"
          >
            ⌘K
          </button>
        </div>
      </nav>
    </header>
  );
}
