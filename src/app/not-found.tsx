import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[var(--fg)] mb-2">404</h1>
        <p className="text-sm text-[var(--fg-3)] mb-6">This page doesn&apos;t exist.</p>
        <Link
          href="/"
          className="text-[10px] font-mono tracking-[0.2em] uppercase px-5 py-2.5 rounded-lg border border-[var(--border)] text-[var(--fg-2)] hover:bg-[var(--surface)] transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
