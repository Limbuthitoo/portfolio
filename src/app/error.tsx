'use client';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--fg)] mb-3">Something went wrong</h1>
        <p className="text-sm text-[var(--fg-3)] mb-6">An unexpected error occurred.</p>
        <button
          onClick={reset}
          className="text-[10px] font-mono tracking-[0.2em] uppercase px-5 py-2.5 rounded-lg border border-[var(--border)] text-[var(--fg-2)] hover:bg-[var(--surface)] transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
