"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const MultiplayerTetris = dynamic(() => import("@/components/games/MultiplayerTetris"), { ssr: false });

function MultiplayerContent() {
  return <MultiplayerTetris />;
}

export default function MultiplayerTetrisPage() {
  return (
    <div className="min-h-screen px-4 py-4 sm:py-12">
      <div className="max-w-5xl mx-auto">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-white/30 text-sm font-mono">Loading…</div>
          </div>
        }>
          <MultiplayerContent />
        </Suspense>
      </div>
    </div>
  );
}
