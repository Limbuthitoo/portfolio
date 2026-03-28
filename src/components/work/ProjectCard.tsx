"use client";

import Link from "next/link";
import { Project } from "@/types";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/work/${project.slug}`} className="block">
      <div className="rounded-[var(--card-radius)] bg-[var(--surface)] border border-[var(--border)] p-5 hover:border-[var(--border-hover)] transition-colors">
        <h3 className="text-base font-semibold mb-1">{project.title}</h3>
        <p className="text-xs text-[var(--fg-3)]">{project.category} — {project.year}</p>
      </div>
    </Link>
  );
}
