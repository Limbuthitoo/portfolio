'use client';

import { useState } from 'react';
import { Experience } from '@/types';

interface Props {
  experience?: Experience;
  onSave: (exp: Experience) => void;
  saving: boolean;
}

const empty: Experience = {
  id: '', role: '', company: '', period: '', description: '', highlights: [],
};

export default function ExperienceForm({ experience, onSave, saving }: Props) {
  const [form, setForm] = useState<Experience>(experience || empty);
  const [highlightsInput, setHighlightsInput] = useState(experience?.highlights.join('\n') || '');

  const set = (key: keyof Experience, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = form.id || form.role.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    onSave({
      ...form,
      id,
      highlights: highlightsInput.split('\n').map((h) => h.trim()).filter(Boolean),
    });
  };

  const inputCls = 'w-full bg-white/[0.03] border border-white/[0.06] focus:border-white/15 text-white text-sm px-3 py-2.5 rounded-lg outline-none transition-colors';
  const labelCls = 'text-white/25 text-[9px] uppercase tracking-[0.25em] block mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
    <div className="flex-1 overflow-y-auto pb-20">
    <div className="max-w-2xl space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Role</label>
          <input className={inputCls} value={form.role} onChange={(e) => set('role', e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Company</label>
          <input className={inputCls} value={form.company} onChange={(e) => set('company', e.target.value)} required />
        </div>
      </div>

      <div>
        <label className={labelCls}>Period</label>
        <input className={inputCls} value={form.period} onChange={(e) => set('period', e.target.value)} placeholder="2020 — Present" required />
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <textarea className={`${inputCls} resize-none`} rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} required />
      </div>

      <div>
        <label className={labelCls}>Highlights (one per line)</label>
        <textarea className={`${inputCls} resize-none`} rows={4} value={highlightsInput} onChange={(e) => setHighlightsInput(e.target.value)} />
      </div>

    </div>
    </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 z-20 bg-[#060606] border-t border-white/[0.06] px-5 py-3 flex items-center justify-end -mx-5 -mb-5">
        <button type="submit" disabled={saving}
          className="bg-white/[0.06] hover:bg-white/10 disabled:opacity-50 text-white text-[9px] uppercase tracking-[0.3em] px-6 py-2.5 rounded-lg transition-colors">
          {saving ? 'Saving...' : experience ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
