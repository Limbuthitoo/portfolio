"use client";

import { useEffect, useRef, useCallback } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const state = useRef({ hovering: false, hidden: false, label: "" });
  const rafId = useRef(0);

  const render = useCallback(() => {
    const dot = dotRef.current;
    const lbl = labelRef.current;
    if (!dot) return;

    const { hovering, hidden, label } = state.current;
    const hasLabel = hovering && label;

    // Direct position — no lerp, instant follow
    dot.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
    dot.style.opacity = hidden ? "0" : "1";
    dot.style.width = dot.style.height = hasLabel ? "56px" : hovering ? "40px" : "8px";
    dot.style.background = hovering ? "rgba(0,240,255,0.12)" : "rgba(0,240,255,0.9)";
    dot.style.borderColor = hovering ? "rgba(0,240,255,0.4)" : "transparent";
    dot.style.boxShadow = hovering
      ? "0 0 16px rgba(0,240,255,0.15)"
      : "0 0 6px rgba(0,240,255,0.4)";

    if (lbl) {
      lbl.textContent = label;
      lbl.style.opacity = hasLabel ? "1" : "0";
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

    const onEnter = () => { state.current.hidden = false; };
    const onLeave = () => { state.current.hidden = true; };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);

    rafId.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [render]);

  return (
    <div className="hidden md:block">
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full flex items-center justify-center"
        style={{
          width: 8,
          height: 8,
          border: "1.5px solid transparent",
          background: "rgba(0,240,255,0.9)",
          boxShadow: "0 0 6px rgba(0,240,255,0.4)",
          willChange: "transform",
          transition: "width 0.15s, height 0.15s, background 0.15s, border-color 0.15s, box-shadow 0.15s",
        }}
      >
        <span
          ref={labelRef}
          className="text-[var(--cyan)] text-[8px] uppercase tracking-[0.2em] font-medium"
          style={{ opacity: 0, transition: "opacity 0.1s" }}
        />
      </div>
    </div>
  );
}
