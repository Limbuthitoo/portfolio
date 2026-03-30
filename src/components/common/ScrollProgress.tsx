'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const scaleX = useMotionValue(0);
  const springScaleX = useSpring(scaleX, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [visible, setVisible] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    // Find the Lenis scroll wrapper
    const wrapper = document.querySelector('.bento-scroll') as HTMLElement | null;
    if (!wrapper) return;

    const update = () => {
      const scrollTop = wrapper.scrollTop;
      const scrollHeight = wrapper.scrollHeight - wrapper.clientHeight;
      if (scrollHeight > 0) {
        scaleX.set(scrollTop / scrollHeight);
        setVisible(scrollTop > 10);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    wrapper.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      wrapper.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [scaleX]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[100]"
      style={{
        scaleX: springScaleX,
        background: 'linear-gradient(90deg, var(--violet), var(--cyan))',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s',
      }}
    />
  );
}
