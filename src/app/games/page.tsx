import Link from "next/link";
import GameCard from "./GameCard";

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
          <GameCard
            href="/games/tetris"
            icon={
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="6" height="6" rx="1" />
                <rect x="9" y="3" width="6" height="6" rx="1" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
                <rect x="9" y="15" width="6" height="6" rx="1" />
              </svg>
            }
            title="Ultra Tetris"
            description="Classic block-stacking with levels, ghost pieces, and multiplayer battles."
          />
          <GameCard
            href="/games/pong"
            icon={
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="3" height="12" rx="1.5" />
                <rect x="19" y="8" width="3" height="8" rx="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <path d="M12 3v3M12 18v3" opacity="0.3" />
              </svg>
            }
            title="Retro Pong"
            description="Classic paddle game — play solo against CPU or battle a friend in multiplayer."
          />
        </div>
      </div>
    </div>
  );
}
