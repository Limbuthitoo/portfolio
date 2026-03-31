"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function CustomCursor() {
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [label, setLabel] = useState("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 28 });
  const sy = useSpring(y, { stiffness: 500, damping: 28 });

  // Track velocity for cursor stretch effect
  const velocity = useMotionValue(0);
  const prevPos = useRef({ x: 0, y: 0, time: 0 });

  const cursorScale = useTransform(velocity, [0, 1500], [1, 0.85]);
  const cursorStretch = useTransform(velocity, [0, 1500], [1, 1.3]);
  const springScale = useSpring(cursorScale, { stiffness: 200, damping: 20 });
  const springStretch = useSpring(cursorStretch, { stiffness: 200, damping: 20 });

  const move = useCallback(
    (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      const now = performance.now();
      const dt = now - prevPos.current.time;
      if (dt > 0) {
        const dx = e.clientX - prevPos.current.x;
        const dy = e.clientY - prevPos.current.y;
        const speed = Math.sqrt(dx * dx + dy * dy) / dt * 1000;
        velocity.set(speed);
      }
      prevPos.current = { x: e.clientX, y: e.clientY, time: now };
    },
    [x, y, velocity]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleEnter = () => setHidden(false);
    const handleLeave = () => setHidden(true);
    const handleDown = () => setClicking(true);
    const handleUp = () => setClicking(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseenter", handleEnter);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("mouseup", handleUp);

    // Event delegation for hover states
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

    // Decay velocity when mouse stops
    const decayInterval = setInterval(() => {
      velocity.set(velocity.get() * 0.9);
    }, 16);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseenter", handleEnter);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      clearInterval(decayInterval);
    };
  }, [move, velocity]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[99999] hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="relative -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
        animate={{
          width: hovering ? 64 : clicking ? 6 : 8,
          height: hovering ? 64 : clicking ? 6 : 8,
          opacity: hidden ? 0 : 1,
          background: hovering ? "rgba(0,240,255,0.06)" : "rgba(0,240,255,0.8)",
          backdropFilter: hovering ? "blur(8px)" : "blur(0px)",
          border: hovering ? "1px solid rgba(0,240,255,0.2)" : "1px solid transparent",
          boxShadow: hovering ? "none" : "0 0 10px rgba(0,240,255,0.3), 0 0 20px rgba(0,240,255,0.1)",
        }}
        style={{
          scaleX: hovering ? 1 : springStretch,
          scaleY: hovering ? 1 : springScale,
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
