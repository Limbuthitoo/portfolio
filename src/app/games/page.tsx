import Link from "next/link";

export const metadata = {
  title: "Games — Bijay Subbalimbu",
  description: "Mini games built with React.",
};

const GAMES = [
  {
    slug: "shadow-quest",
    title: "Shadow Quest",
    emoji: "⚔️",
    description: "A dungeon platformer with sword combat, traps, potions, and 5 challenging levels.",
    color: "var(--violet)",
  },
];

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
          {GAMES.map((game) => (
            <Link
              key={game.slug}
              href={`/games/${game.slug}`}
              className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--border-hover)] transition-all hover:shadow-lg"
            >
              <div className="text-4xl mb-4">{game.emoji}</div>
              <h2 className="text-lg font-semibold text-[var(--fg)] mb-1 group-hover:text-[var(--violet)] transition-colors">
                {game.title}
              </h2>
              <p className="text-sm text-[var(--fg-3)]">{game.description}</p>
              <div
                className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: game.color, boxShadow: `0 0 8px ${game.color}` }}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
