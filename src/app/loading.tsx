export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Hexagon spinner */}
        <div className="relative w-16 h-16">
          {/* Outer rotating ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: '1.5px solid transparent',
              borderTopColor: 'var(--cyan)',
              borderRightColor: 'var(--violet)',
              animation: 'spin 1.2s linear infinite',
            }}
          />
          {/* Inner counter-rotating ring */}
          <div
            className="absolute inset-2 rounded-full"
            style={{
              border: '1.5px solid transparent',
              borderBottomColor: 'var(--cyan)',
              borderLeftColor: 'var(--violet)',
              animation: 'spin 1.8s linear infinite reverse',
            }}
          />
          {/* Core pulse */}
          <div
            className="absolute inset-4 rounded-full"
            style={{
              background: 'radial-gradient(circle, var(--cyan) 0%, transparent 70%)',
              animation: 'loading-pulse 1.5s ease-in-out infinite',
            }}
          />
          {/* Orbiting dot */}
          <div
            className="absolute w-1.5 h-1.5 rounded-full top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              background: 'var(--cyan)',
              boxShadow: '0 0 8px var(--cyan)',
              animation: 'orbit 1.2s linear infinite',
              transformOrigin: '50% calc(50% + 32px)',
            }}
          />
        </div>

        {/* Scanning text */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1">
            <span
              className="text-[10px] font-mono tracking-[0.3em] uppercase"
              style={{
                background: 'linear-gradient(90deg, var(--cyan), var(--violet))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'loading-text 2s ease-in-out infinite',
              }}
            >
              Loading
            </span>
            <span className="flex gap-0.5">
              <span className="w-1 h-1 rounded-full bg-[var(--cyan)]" style={{ animation: 'loading-dot 1.4s ease-in-out infinite' }} />
              <span className="w-1 h-1 rounded-full bg-[var(--cyan)]" style={{ animation: 'loading-dot 1.4s ease-in-out 0.2s infinite' }} />
              <span className="w-1 h-1 rounded-full bg-[var(--cyan)]" style={{ animation: 'loading-dot 1.4s ease-in-out 0.4s infinite' }} />
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-24 h-px bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, var(--cyan), var(--violet))',
                animation: 'loading-bar 1.5s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
