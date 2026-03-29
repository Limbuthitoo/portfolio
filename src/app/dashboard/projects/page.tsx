'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Project } from '@/types';

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch('/api/projects').then((r) => r.ok ? r.json() : Promise.reject()).then(setProjects).catch(() => {});
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this project?')) return;
    await fetch('/api/projects', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    setProjects((prev) => prev.filter((p) => p.slug !== slug));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-lg font-light">Projects</h1>
        <Link href="/dashboard/projects/new" className="text-[9px] uppercase tracking-[0.3em] text-white/40 border border-white/10 px-4 py-2 rounded-lg hover:bg-white/[0.04] transition-colors">
          + New Project
        </Link>
      </div>

      <div className="space-y-2">
        {projects.map((p) => (
          <div key={p.slug} className="flex items-center justify-between bg-white/[0.015] border border-white/[0.03] rounded-lg px-4 py-3">
            <Link href={`/dashboard/projects/${p.slug}`} className="flex-1">
              <span className="text-white/70 text-sm font-light">{p.title}</span>
              <span className="text-white/20 text-[9px] ml-3">{p.category}</span>
              {p.featured && <span className="text-amber-400/50 text-[8px] ml-2">★</span>}
            </Link>
            <button onClick={() => handleDelete(p.slug)} className="text-white/15 text-[9px] hover:text-red-400/70 transition-colors ml-4">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
