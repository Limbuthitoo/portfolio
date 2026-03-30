"use client";

import dynamic from "next/dynamic";

const UltraTetris = dynamic(() => import("@/components/games/UltraTetris"), { ssr: false });

export default function TetrisClient() {
  return <UltraTetris />;
}
