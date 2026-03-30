"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const THRESHOLD = 80;
const MAX_PULL = 120;

export default function PullToRefresh() {
  const router = useRouter();
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);

  const isAtTop = useCallback(() => {
    const scroller = document.querySelector(".bento-scroll");
    if (scroller) return scroller.scrollTop <= 0;
    return window.scrollY <= 0;
  }, []);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (refreshing) return;
      if (isAtTop()) {
        startY.current = e.touches[0].clientY;
        pulling.current = true;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!pulling.current || refreshing) return;
      if (!isAtTop()) {
        pulling.current = false;
        setPull(0);
        return;
      }
      const diff = e.touches[0].clientY - startY.current;
      if (diff > 0) {
        const clamped = Math.min(diff * 0.5, MAX_PULL);
        setPull(clamped);
      } else {
        pulling.current = false;
        setPull(0);
      }
    };

    const onTouchEnd = () => {
      if (!pulling.current) return;
      pulling.current = false;
      if (pull >= THRESHOLD && !refreshing) {
        setRefreshing(true);
        setPull(THRESHOLD);
        router.refresh();
        setTimeout(() => {
          setRefreshing(false);
          setPull(0);
        }, 1000);
      } else {
        setPull(0);
      }
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [pull, refreshing, router, isAtTop]);

  if (pull === 0 && !refreshing) return null;

  const progress = Math.min(pull / THRESHOLD, 1);
  const rotation = refreshing ? undefined : pull * 3;

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[9998] pointer-events-none flex items-center justify-center"
      style={{
        top: `${Math.max(pull - 10, 0)}px`,
        opacity: progress,
        transition: pulling.current ? "none" : "all 0.3s ease",
      }}
    >
      <div
        className="w-9 h-9 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shadow-lg backdrop-blur-md"
      >
        <svg
          className={refreshing ? "animate-spin" : ""}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--cyan)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: refreshing ? undefined : `rotate(${rotation}deg)` }}
        >
          {refreshing ? (
            <>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </>
          ) : (
            <>
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
