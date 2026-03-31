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
            description="Classic block-stacking with levels, ghost pieces, and a global top 3 leaderboard."
          />
          <GameCard
            href="/games/tetris/multiplayer"
            icon={
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            }
            title="Multiplayer Tetris"
            description="Battle a friend online — clear lines to send garbage blocks. Share an invite link to play!"
          />
        </div>
      </div>
    </div>
  );
}
