"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [label, setLabel] = useState("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 28 });
  const sy = useSpring(y, { stiffness: 500, damping: 28 });

  const move = useCallback(
    (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    },
    [x, y]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleEnter = () => setHidden(false);
    const handleLeave = () => setHidden(true);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseenter", handleEnter);
    document.addEventListener("mouseleave", handleLeave);

    // Use event delegation instead of MutationObserver to avoid memory leaks
    const handleMouseOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("a, button, [data-cursor]");
      if (el) {
        setHovering(true);
        setLabel((el as HTMLElement).dataset.cursor || "");
      }
    };
    const handleMouseOut = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("a, button, [data-cursor]");
      if (el) {
        setHovering(false);
        setLabel("");
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseenter", handleEnter);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [move]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="relative -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
        animate={{
          width: hovering ? 64 : 8,
          height: hovering ? 64 : 8,
          opacity: hidden ? 0 : 1,
          background: hovering ? "rgba(0,240,255,0.06)" : "rgba(0,240,255,0.8)",
          backdropFilter: hovering ? "blur(8px)" : "blur(0px)",
          border: hovering ? "1px solid rgba(0,240,255,0.2)" : "1px solid transparent",
          boxShadow: hovering ? "none" : "0 0 10px rgba(0,240,255,0.3), 0 0 20px rgba(0,240,255,0.1)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        {label && (
          <motion.span
            className="text-[var(--cyan)] text-[8px] uppercase tracking-[0.2em] font-medium"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}
