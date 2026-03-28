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
