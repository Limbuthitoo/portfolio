import Link from "next/link";

export const metadata = {
  title: "Games — Bijay Subbalimbu",
  description: "Mini games coming soon.",
};

export default function GamesPage() {
  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-sm text-[var(--fg-3)] hover:text-[var(--fg)] transition-colors flex items-center gap-1 mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Home
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--fg)] mb-2">Games</h1>
        <p className="text-[var(--fg-2)] text-sm mb-10">
          Mini games built for fun. Take a break and play!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/games/tetris"
            className="group rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--violet)]/30 p-6 transition-colors"
          >
            <div className="text-4xl mb-4">🧱</div>
            <h2 className="text-lg font-bold text-[var(--fg)] group-hover:text-[var(--violet)] transition-colors mb-1">
              Ultra Tetris
            </h2>
            <p className="text-[var(--fg-3)] text-sm">
              Classic block-stacking with levels, ghost pieces, and a global top 3 leaderboard.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
