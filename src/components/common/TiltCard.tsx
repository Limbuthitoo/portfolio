'use client';

import { useRef, useState, useEffect, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltStrength?: number;
}

/* Floating particles that appear on hover */
function HoverParticles({ active }: { active: boolean }) {
  const [particles] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1.5 + Math.random() * 2,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
    }))
  );

  return (
    <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none z-20">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 2 === 0 ? 'var(--violet)' : 'var(--cyan)',
            opacity: active ? 0.6 : 0,
            boxShadow: `0 0 ${p.size * 3}px ${p.id % 2 === 0 ? 'var(--violet)' : 'var(--cyan)'}`,
            transition: `opacity 0.5s ease ${p.delay * 0.1}s`,
            animation: active
              ? `card-particle ${p.duration}s ease-in-out ${p.delay}s infinite`
              : 'none',
          }}
        />
      ))}
    </div>
  );
}

export default function TiltCard({ children, className = '', tiltStrength = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 20 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  const glowX = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const glowY = useSpring(mouseY, { stiffness: 150, damping: 25 });

  /* Cursor-tracking spotlight */
  const spotlight = useTransform(
    [glowX, glowY],
    ([x, y]: number[]) =>
      `radial-gradient(500px circle at ${x}px ${y}px, rgba(139,92,246,0.1), rgba(0,240,255,0.04) 40%, transparent 70%)`
  );

  /* Shimmer sweep on hover */
  const shimmer = useTransform(
    [glowX, glowY],
    ([x, y]: number[]) =>
      `radial-gradient(300px circle at ${x}px ${y}px, rgba(255,255,255,0.03), transparent 60%)`
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

  /* Inject keyframes on mount */
  useEffect(() => {
    const id = 'card-particle-keyframes';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes card-particle {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
        25% { transform: translate(8px, -12px) scale(1.3); opacity: 0.8; }
        50% { transform: translate(-5px, -20px) scale(0.8); opacity: 0.3; }
        75% { transform: translate(10px, -8px) scale(1.1); opacity: 0.7; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        ref={ref}
        className={`${className} relative group rounded-[var(--card-radius)]`}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {children}

        {/* ── Rotating conic gradient border (same as dock) ── */}
        <div
          className="absolute -inset-px rounded-[var(--card-radius)] pointer-events-none z-10 overflow-hidden"
          style={{
            padding: '1.5px',
            background: 'conic-gradient(from var(--angle, 0deg), transparent 30%, var(--violet), var(--cyan), transparent 70%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            animation: 'rotate-gradient 4s linear infinite',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* ── Cursor-tracking spotlight ── */}
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
          style={{
            background: spotlight,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* ── White shimmer on cursor ── */}
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
          style={{
            background: shimmer,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            mixBlendMode: 'overlay',
          }}
        />

        {/* ── Floating particles ── */}
        <HoverParticles active={hovered} />

        {/* ── Ambient glow behind card ── */}
        <div
          className="absolute -inset-4 rounded-3xl pointer-events-none z-[-1]"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(0,240,255,0.03) 50%, transparent 70%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.5s ease',
            filter: 'blur(24px)',
          }}
        />
      </motion.div>
    </div>
  );
}
