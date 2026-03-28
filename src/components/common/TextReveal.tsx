'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
}

export default function TextReveal({ text, className = '' }: TextRevealProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.3'],
  });

  const words = text.split(' ');

  return (
    <p ref={ref} className={`${className} flex flex-wrap`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = (i + 1) / words.length;
        return (
          <Word key={i} range={[start, end]} progress={scrollYProgress}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  range,
  progress,
}: {
  children: string;
  range: [number, number];
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span className="mr-[0.3em] mt-1 inline-block" style={{ opacity }}>
      {children}
    </motion.span>
  );
}
