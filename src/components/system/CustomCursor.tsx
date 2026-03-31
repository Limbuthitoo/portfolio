"use client";

import { useEffect, useRef, useCallback } from "react";

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const state = useRef({ hovering: false, hidden: false, clicking: false, label: "" });
  const rafId = useRef(0);

  const render = useCallback(() => {
    const ring = ringRef.current;
    const lbl = labelRef.current;
    if (!ring) return;

    // Lerp ring position — near-instant follow
    ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.8;
    ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.8;

    const { hovering, hidden, clicking, label } = state.current;

    // Ring: smooth follow with lerp
    ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
    ring.style.opacity = hidden ? "0" : "1";
    ring.style.width = ring.style.height = hovering ? "56px" : "32px";
    ring.style.borderColor = hovering ? "rgba(0,240,255,0.3)" : "rgba(0,240,255,0.12)";
    ring.style.background = hovering ? "rgba(0,240,255,0.04)" : "transparent";

    if (lbl) {
      lbl.textContent = label;
      lbl.style.opacity = label ? "1" : "0";
    }

    rafId.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest?.("a, button, [data-cursor]");
      if (el) {
        state.current.hovering = true;
        state.current.label = (el as HTMLElement).dataset.cursor || "";
      }
    };
    const onOut = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest?.("a, button, [data-cursor]");
      if (el) {
        state.current.hovering = false;
        state.current.label = "";
      }
    };

    const onDown = () => { state.current.clicking = true; };
    const onUp = () => { state.current.clicking = false; };
    const onEnter = () => { state.current.hidden = false; };
    const onLeave = () => { state.current.hidden = true; };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);

    rafId.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [render]);

  return (
    <div className="hidden md:block">
      {/* Ring — near-instant follow */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full flex items-center justify-center"
        style={{
          width: 32,
          height: 32,
          border: "1px solid rgba(0,240,255,0.12)",
          willChange: "transform",
          transition: "width 0.2s, height 0.2s, border-color 0.2s, background 0.2s",
        }}
      >
        <span
          ref={labelRef}
          className="text-[var(--cyan)] text-[8px] uppercase tracking-[0.2em] font-medium"
          style={{ opacity: 0, transition: "opacity 0.15s" }}
        />
      </div>
    </div>
  );
}
