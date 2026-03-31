'use client';

import { useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltStrength?: number;
}

export default function TiltCard({ children, className = '', tiltStrength = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 25 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 25 });

  /* Smooth glow position */
  const glowX = useSpring(mouseX, { stiffness: 200, damping: 30 });
  const glowY = useSpring(mouseY, { stiffness: 200, damping: 30 });

  /* Gradient string that follows cursor */
  const glowBg = useTransform(
    [glowX, glowY],
    ([x, y]: number[]) =>
      `radial-gradient(600px circle at ${x}px ${y}px, rgba(139,92,246,0.12), rgba(0,240,255,0.06) 40%, transparent 70%)`
  );

  const borderGlow = useTransform(
    [glowX, glowY],
    ([x, y]: number[]) =>
      `radial-gradient(400px circle at ${x}px ${y}px, rgba(139,92,246,0.4), rgba(0,240,255,0.15) 40%, transparent 70%)`
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-y * tiltStrength);
    rotateY.set(x * tiltStrength);
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      className={`${className} relative group`}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
        perspective: 800,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* Cursor-tracking inner glow */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
        style={{
          background: glowBg,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Cursor-tracking border glow */}
      <motion.div
        className="absolute -inset-px rounded-[inherit] pointer-events-none z-0"
        style={{
          background: borderGlow,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />

      {/* Ambient glow behind card */}
      <div
        className="absolute -inset-4 rounded-3xl pointer-events-none z-[-1]"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
          filter: 'blur(20px)',
        }}
      />
    </motion.div>
  );
}
