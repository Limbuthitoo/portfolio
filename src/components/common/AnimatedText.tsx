'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  delay?: number;
  splitBy?: 'word' | 'letter';
}

export default function AnimatedText({
  text,
  as: Tag = 'p',
  className = '',
  delay = 0,
  splitBy = 'word',
}: AnimatedTextProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  const units = splitBy === 'letter' ? text.split('') : text.split(' ');

  return (
    <Tag ref={ref} className={`${className} overflow-hidden`}>
      {units.map((unit, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', rotateX: -80 }}
            animate={inView ? { y: '0%', rotateX: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: delay + i * (splitBy === 'letter' ? 0.02 : 0.04),
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {unit}
            {splitBy === 'word' && i < units.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
