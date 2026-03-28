"use client";

import dynamic from "next/dynamic";

const ShadowQuest = dynamic(() => import("@/components/games/ShadowQuest"), { ssr: false });

export default function ShadowQuestPage() {
  return <ShadowQuest />;
}
