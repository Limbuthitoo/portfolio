"use client";

import Link from "next/link";
import TiltCard from "@/components/common/TiltCard";

export default function GameCard({ href, emoji, title, description }: { href: string; emoji: string; title: string; description: string }) {
  return (
    <Link href={href} className="block group">
      <TiltCard className="h-full" tiltStrength={6}>
        <div className="rounded-[var(--card-radius)] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--violet)]/30 p-6 transition-colors h-full">
          <div className="text-4xl mb-4">{emoji}</div>
          <h2 className="text-lg font-bold text-[var(--fg)] group-hover:text-[var(--violet)] transition-colors mb-1">
            {title}
          </h2>
          <p className="text-[var(--fg-3)] text-sm">{description}</p>
        </div>
      </TiltCard>
    </Link>
  );
}
