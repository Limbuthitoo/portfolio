export default function MeshBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Deep base */}
      <div className="absolute inset-0 bg-[var(--bg)]" />

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

      {/* ── Floating micro orbs ── */}
      {[
        { color: "var(--cyan)", size: 4, x: "15%", y: "25%", dur: 8, del: 0 },
        { color: "var(--violet)", size: 3, x: "75%", y: "15%", dur: 10, del: 2 },
        { color: "var(--cyan)", size: 5, x: "85%", y: "60%", dur: 12, del: 1 },
        { color: "var(--violet)", size: 3, x: "25%", y: "70%", dur: 9, del: 3 },
        { color: "var(--rose)", size: 2, x: "50%", y: "45%", dur: 11, del: 4 },
        { color: "var(--cyan)", size: 3, x: "60%", y: "80%", dur: 7, del: 2 },
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
            boxShadow: `0 0 ${orb.size * 4}px ${orb.color}`,
            opacity: 0.4,
            animation: `orb-float ${orb.dur}s ease-in-out ${orb.del}s infinite`,
          }}
        />
      ))}

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
