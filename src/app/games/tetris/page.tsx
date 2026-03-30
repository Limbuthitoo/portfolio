import Link from "next/link";
import TetrisClient from "@/components/games/TetrisClient";

export const metadata = {
  title: "Ultra Tetris — Bijay Subbalimbu",
  description: "Play Ultra Tetris — stack blocks, clear lines, climb levels, and compete for top 3 high scores.",
};

export default function TetrisPage() {
  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/games"
          className="text-sm text-[var(--fg-3)] hover:text-[var(--fg)] transition-colors flex items-center gap-1 mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Games
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--fg)] mb-2">Ultra Tetris</h1>
          <p className="text-[var(--fg-3)] text-sm">
            Stack blocks. Clear lines. Beat the high score.
          </p>
        </div>

        <TetrisClient />
      </div>
    </div>
  );
}
