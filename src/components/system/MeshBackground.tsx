export default function MeshBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Deep base */}
      <div className="absolute inset-0 bg-[var(--bg)]" />

      {/* ── Aurora borealis waves ── */}
      <div
        className="absolute w-[150vw] h-[60vh] -left-[25vw] top-0"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.06) 30%, rgba(0,240,255,0.04) 60%, transparent 100%)',
          animation: 'aurora-wave 15s ease-in-out infinite',
          filter: 'blur(60px)',
          transformOrigin: 'center top',
        }}
      />
      <div
        className="absolute w-[120vw] h-[50vh] -left-[10vw] top-[5%]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,240,255,0.04) 40%, rgba(139,92,246,0.03) 70%, transparent 100%)',
          animation: 'aurora-wave 20s ease-in-out 3s infinite reverse',
          filter: 'blur(80px)',
          transformOrigin: 'center top',
        }}
      />

      {/* Mesh gradient blobs */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--cyan) 0%, transparent 70%)",
          opacity: 0.07,
          top: "-20%",
          right: "-10%",
          animation: "mesh-drift 30s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--violet) 0%, transparent 70%)",
          opacity: 0.05,
          bottom: "-15%",
          left: "-5%",
          animation: "mesh-drift 25s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--rose) 0%, transparent 70%)",
          opacity: 0.04,
          top: "40%",
          left: "40%",
          animation: "mesh-drift 35s ease-in-out infinite 5s",
        }}
      />

      {/* ── Pulsing energy rings ── */}
      <div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          top: '20%',
          right: '15%',
          border: '1px solid rgba(0,240,255,0.08)',
          animation: 'energy-ring 8s ease-out infinite',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 200,
          height: 200,
          bottom: '30%',
          left: '10%',
          border: '1px solid rgba(139,92,246,0.08)',
          animation: 'energy-ring 10s ease-out 3s infinite',
        }}
      />

      {/* ── Floating orbs (larger, more visible) ── */}
      {[
        { color: "var(--cyan)", size: 6, x: "12%", y: "20%", dur: 8, del: 0 },
        { color: "var(--violet)", size: 5, x: "78%", y: "12%", dur: 10, del: 2 },
        { color: "var(--cyan)", size: 8, x: "88%", y: "55%", dur: 12, del: 1 },
        { color: "var(--violet)", size: 5, x: "22%", y: "65%", dur: 9, del: 3 },
        { color: "var(--rose)", size: 4, x: "50%", y: "40%", dur: 11, del: 4 },
        { color: "var(--cyan)", size: 6, x: "65%", y: "78%", dur: 7, del: 2 },
        { color: "var(--violet)", size: 4, x: "35%", y: "85%", dur: 13, del: 5 },
        { color: "var(--cyan)", size: 3, x: "90%", y: "30%", dur: 9, del: 1 },
        { color: "var(--rose)", size: 5, x: "8%", y: "45%", dur: 14, del: 6 },
        { color: "var(--violet)", size: 3, x: "55%", y: "10%", dur: 10, del: 3 },
      ].map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
            boxShadow: `0 0 ${orb.size * 6}px ${orb.color}, 0 0 ${orb.size * 12}px ${orb.color}`,
            opacity: 0.5,
            animation: `orb-float ${orb.dur}s ease-in-out ${orb.del}s infinite`,
          }}
        />
      ))}

      {/* ── Shooting lines / streaks ── */}
      <div
        className="absolute h-px"
        style={{
          width: '15vw',
          top: '25%',
          left: '-15vw',
          background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
          opacity: 0.15,
          animation: 'shooting-line 8s linear 2s infinite',
        }}
      />
      <div
        className="absolute h-px"
        style={{
          width: '10vw',
          top: '60%',
          left: '-10vw',
          background: 'linear-gradient(90deg, transparent, var(--violet), transparent)',
          opacity: 0.1,
          animation: 'shooting-line 12s linear 6s infinite',
        }}
      />
      <div
        className="absolute h-px"
        style={{
          width: '12vw',
          top: '45%',
          left: '-12vw',
          background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
          opacity: 0.12,
          animation: 'shooting-line 10s linear 0s infinite',
        }}
      />

      {/* Perspective grid floor */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40vh]"
        style={{
          background: `
            linear-gradient(to top, rgba(0,240,255,0.03) 1px, transparent 1px),
            linear-gradient(to right, rgba(0,240,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)",
          animation: "grid-pulse 6s ease-in-out infinite",
        }}
      />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.05) 2px, rgba(0,240,255,0.05) 4px)",
          pointerEvents: "none",
        }}
      />

      {/* Noise texture overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.015]">
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--fg) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, var(--bg) 100%)",
          opacity: 0.6,
        }}
      />
    </div>
  );
}
