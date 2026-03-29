'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Experience } from '@/types';

export default function ExperienceListPage() {
  const [items, setItems] = useState<Experience[]>([]);

  useEffect(() => {
    fetch('/api/experience').then((r) => r.ok ? r.json() : Promise.reject()).then(setItems).catch(() => {});
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    await fetch('/api/experience', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setItems((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-lg font-light">Experience</h1>
        <Link href="/dashboard/experience/new" className="text-[9px] uppercase tracking-[0.3em] text-white/40 border border-white/10 px-4 py-2 rounded-lg hover:bg-white/[0.04] transition-colors">
          + New Entry
        </Link>
      </div>
      <div className="space-y-2">
        {items.map((exp) => (
          <div key={exp.id} className="flex items-center justify-between bg-white/[0.015] border border-white/[0.03] rounded-lg px-4 py-3">
            <Link href={`/dashboard/experience/${exp.id}`} className="flex-1">
              <span className="text-white/70 text-sm font-light">{exp.role}</span>
              <span className="text-white/20 text-[9px] ml-3">{exp.company}</span>
            </Link>
            <span className="text-white/15 text-[9px] font-mono mr-4">{exp.period}</span>
            <button onClick={() => handleDelete(exp.id)} className="text-white/15 text-[9px] hover:text-red-400/70 transition-colors">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
