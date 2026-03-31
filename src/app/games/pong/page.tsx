"use client";

import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";

const RetroPong = dynamic(() => import("@/components/games/RetroPong"), { ssr: false });
const MultiplayerPong = dynamic(() => import("@/components/games/MultiplayerPong"), { ssr: false });

type Mode = null | "single" | "multiplayer";

export default function PongPage() {
  const [mode, setMode] = useState<Mode>(null);

  if (mode === "single") {
    return (
      <div className="min-h-screen px-4 py-4 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="hidden sm:flex">
            <button
              onClick={() => setMode(null)}
              className="text-sm text-[var(--fg-3)] hover:text-[var(--fg)] transition-colors flex items-center gap-1 mb-8"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back
            </button>
          </div>
          <div className="hidden sm:block text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--fg)] mb-2">Retro Pong</h1>
            <p className="text-[var(--fg-3)] text-sm">You vs CPU — First to 7 wins.</p>
          </div>
          <RetroPong />
        </div>
      </div>
    );
  }

  if (mode === "multiplayer") {
    return (
      <div className="min-h-screen px-4 py-4 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="hidden sm:flex">
            <button
              onClick={() => setMode(null)}
              className="text-sm text-[var(--fg-3)] hover:text-[var(--fg)] transition-colors flex items-center gap-1 mb-8"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back
            </button>
          </div>
          <div className="hidden sm:block text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--fg)] mb-2">Retro Pong</h1>
            <p className="text-[var(--fg-3)] text-sm">Multiplayer — Battle a friend online!</p>
          </div>
          <MultiplayerPong />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="max-w-xl mx-auto">
        <Link
          href="/games"
          className="text-sm text-[var(--fg-3)] hover:text-[var(--fg)] transition-colors flex items-center gap-1 mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Games
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--fg)] mb-2">Retro Pong</h1>
          <p className="text-[var(--fg-3)] text-sm">Choose your mode</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setMode("single")}
            className="group rounded-[var(--card-radius)] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--violet)]/30 p-6 transition-colors text-left"
          >
            <div className="mb-4 text-[var(--fg-2)] group-hover:text-[var(--violet)] transition-colors">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[var(--fg)] group-hover:text-[var(--violet)] transition-colors mb-1">
              Single Player
            </h2>
            <p className="text-[var(--fg-3)] text-sm">
              Play against the CPU with easy, medium, or hard difficulty.
            </p>
          </button>

          <button
            onClick={() => setMode("multiplayer")}
            className="group rounded-[var(--card-radius)] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--violet)]/30 p-6 transition-colors text-left"
          >
            <div className="mb-4 text-[var(--fg-2)] group-hover:text-[var(--violet)] transition-colors">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[var(--fg)] group-hover:text-[var(--violet)] transition-colors mb-1">
              Multiplayer
            </h2>
            <p className="text-[var(--fg-3)] text-sm">
              Challenge a friend online — share a room code to play!
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
