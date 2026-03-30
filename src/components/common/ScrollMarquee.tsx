'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';

interface ScrollMarqueeProps {
  texts: string[];
  baseVelocity?: number;
}

export default function ScrollMarquee({ texts, baseVelocity = -1.5 }: ScrollMarqueeProps) {
  const baseX = useMotionValue(0);
  const scrollVelocity = useMotionValue(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScroll = useRef(0);

  // Track scroll velocity from the scroll container
  useEffect(() => {
    const wrapper = document.querySelector('.bento-scroll') as HTMLElement | null;
    if (!wrapper) return;

    let lastTime = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 0) {
        const vel = (wrapper.scrollTop - prevScroll.current) / dt;
        scrollVelocity.set(vel);
        prevScroll.current = wrapper.scrollTop;
        lastTime = now;
      }
    };

    wrapper.addEventListener('scroll', onScroll, { passive: true });
    return () => wrapper.removeEventListener('scroll', onScroll);
  }, [scrollVelocity]);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.scrollWidth / 2);
    }
  }, [texts]);

  useAnimationFrame((_, delta) => {
    const velocity = scrollVelocity.get();
    // Speed up marquee based on scroll velocity
    const speedMultiplier = 1 + Math.min(Math.abs(velocity) * 3, 8);
    let moveBy = baseVelocity * speedMultiplier * (delta / 16);

    let newX = baseX.get() + moveBy;
    if (containerWidth > 0 && Math.abs(newX) >= containerWidth) {
      newX = 0;
    }
    baseX.set(newX);

    // Decay scroll velocity
    scrollVelocity.set(velocity * 0.95);
  });

  const x = useTransform(baseX, (v) => `${v}px`);
  const separator = ' — ';
  const fullText = texts.join(separator) + separator;
  // Repeat 4x to ensure seamless loop
  const repeated = fullText.repeat(4);

  return (
    <div className="overflow-hidden py-6 md:py-8 select-none">
      <motion.div
        ref={containerRef}
        className="flex whitespace-nowrap"
        style={{ x }}
      >
        <span className="text-[clamp(2rem,5vw,4rem)] font-extrabold tracking-tight text-[var(--fg-3)] opacity-40">
          {repeated}
        </span>
      </motion.div>
    </div>
  );
}
