'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Project, Experience } from '@/types';

export default function DashboardOverview() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    fetch('/api/projects').then((r) => r.ok ? r.json() : Promise.reject()).then(setProjects).catch(() => {});
    fetch('/api/experience').then((r) => r.ok ? r.json() : Promise.reject()).then(setExperiences).catch(() => {});
  }, []);

  const stats = [
    { label: 'Projects', value: projects.length, href: '/dashboard/projects' },
    { label: 'Featured', value: projects.filter((p) => p.featured).length, href: '/dashboard/projects' },
    { label: 'Experience', value: experiences.length, href: '/dashboard/experience' },
  ];

  return (
    <div>
      <h1 className="text-white text-lg font-light mb-6">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white/[0.025] border border-white/[0.04] rounded-lg p-5 hover:bg-white/[0.04] transition-colors">
            <span className="text-white/20 text-[9px] uppercase tracking-[0.3em] block mb-2">{s.label}</span>
            <span className="text-white text-2xl font-[100]">{s.value}</span>
          </Link>
        ))}
      </div>

      <h2 className="text-white/40 text-xs uppercase tracking-[0.2em] mb-4">Recent Projects</h2>
      <div className="space-y-2">
        {projects.slice(0, 5).map((p) => (
          <Link key={p.slug} href={`/dashboard/projects/${p.slug}`} className="flex items-center justify-between bg-white/[0.015] border border-white/[0.03] rounded-lg px-4 py-3 hover:bg-white/[0.03] transition-colors">
            <div>
              <span className="text-white/70 text-sm font-light">{p.title}</span>
              <span className="text-white/20 text-[9px] ml-3">{p.category}</span>
            </div>
            <span className="text-white/15 text-[9px] font-mono">{p.year}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
