'use client';

import { useState } from 'react';
import { Project, ProjectType, ResearchQuote, Persona, DesignDecision, KeyScreen } from '@/types';

interface Props {
  project?: Project;
  onSave: (project: Project) => void;
  saving: boolean;
}

const empty: Project = {
  slug: '', title: '', category: '', type: 'frontend', description: '', longDescription: '',
  problem: '', solution: '', impact: '', thumbnail: '', images: [],
  technologies: [], role: '', year: '', liveUrl: '', featured: false,
};

export default function ProjectForm({ project, onSave, saving }: Props) {
  const [form, setForm] = useState<Project>(project || empty);
  const [techInput, setTechInput] = useState(project?.technologies.join(', ') || '');
  const [imagesInput, setImagesInput] = useState(project?.images.join(', ') || '');
  const [responsibilitiesInput, setResponsibilitiesInput] = useState(project?.responsibilities?.join('\n') || '');
  const [learningsInput, setLearningsInput] = useState(project?.learnings?.join('\n') || '');

  const set = (key: keyof Project, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const base: Project = {
      ...form,
      slug,
      technologies: techInput.split(',').map((t) => t.trim()).filter(Boolean),
      images: imagesInput.split(',').map((t) => t.trim()).filter(Boolean),
    };

    if (form.type === 'uiux') {
      base.responsibilities = responsibilitiesInput.split('\n').map((r) => r.trim()).filter(Boolean);
      base.learnings = learningsInput.split('\n').map((l) => l.trim()).filter(Boolean);
    }

    onSave(base);
  };

  const inputCls = 'w-full bg-white/[0.03] border border-white/[0.06] focus:border-white/15 text-white text-sm px-3 py-2.5 rounded-lg outline-none transition-colors';
  const labelCls = 'text-white/25 text-[11px] uppercase tracking-[0.25em] block mb-1.5';
  const sectionCls = 'pt-6 mt-6 border-t border-white/[0.04]';

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Title</label>
          <input className={inputCls} value={form.title} onChange={(e) => set('title', e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <input className={inputCls} value={form.category} onChange={(e) => set('category', e.target.value)} required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Project Type</label>
          <select
            className={inputCls}
            value={form.type}
            onChange={(e) => set('type', e.target.value as ProjectType)}
          >
            <option value="frontend">Frontend</option>
            <option value="uiux">UI/UX Design</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Role</label>
          <input className={inputCls} value={form.role} onChange={(e) => set('role', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Year</label>
          <input className={inputCls} value={form.year} onChange={(e) => set('year', e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <textarea className={`${inputCls} resize-none`} rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} required />
      </div>

      <div>
        <label className={labelCls}>Long Description</label>
        <textarea className={`${inputCls} resize-none`} rows={4} value={form.longDescription} onChange={(e) => set('longDescription', e.target.value)} />
      </div>

      <div>
        <label className={labelCls}>Problem / Challenge</label>
        <textarea className={`${inputCls} resize-none`} rows={3} value={form.problem} onChange={(e) => set('problem', e.target.value)} />
      </div>

      <div>
        <label className={labelCls}>Solution / Approach</label>
        <textarea className={`${inputCls} resize-none`} rows={3} value={form.solution} onChange={(e) => set('solution', e.target.value)} />
      </div>

      <div>
        <label className={labelCls}>Impact</label>
        <textarea className={`${inputCls} resize-none`} rows={3} value={form.impact} onChange={(e) => set('impact', e.target.value)} />
      </div>

      <div>
        <label className={labelCls}>Thumbnail Path</label>
        <input className={inputCls} value={form.thumbnail} onChange={(e) => set('thumbnail', e.target.value)} placeholder="/projects/my-project.jpg" />
      </div>

      <div>
        <label className={labelCls}>Image Paths (comma-separated)</label>
        <input className={inputCls} value={imagesInput} onChange={(e) => setImagesInput(e.target.value)} placeholder="/projects/img-1.jpg, /projects/img-2.jpg" />
      </div>

      <div>
        <label className={labelCls}>Technologies (comma-separated)</label>
        <input className={inputCls} value={techInput} onChange={(e) => setTechInput(e.target.value)} />
      </div>

      <div>
        <label className={labelCls}>Live URL</label>
        <input className={inputCls} type="url" value={form.liveUrl || ''} onChange={(e) => set('liveUrl', e.target.value)} />
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set('featured', e.target.checked)}
          className="w-4 h-4 rounded border-white/10 bg-white/[0.03]" />
        <label htmlFor="featured" className="text-white/40 text-xs">Featured project</label>
      </div>

      {/* ── UI/UX Specific Fields ── */}
      {form.type === 'uiux' && (
        <div className={sectionCls}>
          <h3 className="text-white/40 text-[12px] uppercase tracking-[0.3em] mb-4">UI/UX Case Study Fields</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Timeline</label>
                <input className={inputCls} value={form.timeline || ''} onChange={(e) => set('timeline', e.target.value)} placeholder="3 months" />
              </div>
              <div>
                <label className={labelCls}>Team</label>
                <input className={inputCls} value={form.team || ''} onChange={(e) => set('team', e.target.value)} placeholder="3 (UX, Dev, PM)" />
              </div>
            </div>

            <div>
              <label className={labelCls}>Responsibilities (one per line)</label>
              <textarea className={`${inputCls} resize-none`} rows={4} value={responsibilitiesInput} onChange={(e) => setResponsibilitiesInput(e.target.value)} placeholder="User research & interviews&#10;UI design across platforms&#10;Competitive analysis" />
            </div>

            {/* Research Quotes */}
            <div>
              <label className={labelCls}>Research Quotes</label>
              <QuotesEditor
                quotes={form.research?.quotes || []}
                onChange={(quotes) => set('research', { ...form.research, quotes })}
                inputCls={inputCls}
                labelCls={labelCls}
              />
            </div>

            <div>
              <label className={labelCls}>Research Summary</label>
              <textarea className={`${inputCls} resize-none`} rows={3} value={form.research?.summary || ''} onChange={(e) => set('research', { ...form.research, summary: e.target.value })} />
            </div>

            {/* Personas */}
            <div>
              <label className={labelCls}>Personas</label>
              <PersonasEditor
                personas={form.personas || []}
                onChange={(personas) => set('personas', personas)}
                inputCls={inputCls}
              />
            </div>

            {/* Design Decisions */}
            <div>
              <label className={labelCls}>Design Decisions</label>
              <DecisionsEditor
                decisions={form.designDecisions || []}
                onChange={(decisions) => set('designDecisions', decisions)}
                inputCls={inputCls}
              />
            </div>

            {/* Key Screens */}
            <div>
              <label className={labelCls}>Key Screens</label>
              <ScreensEditor
                screens={form.keyScreens || []}
                onChange={(screens) => set('keyScreens', screens)}
                inputCls={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Learnings (one per line)</label>
              <textarea className={`${inputCls} resize-none`} rows={4} value={learningsInput} onChange={(e) => setLearningsInput(e.target.value)} placeholder="One key learning per line" />
            </div>

            <div>
              <label className={labelCls}>Outcome Title</label>
              <input className={inputCls} value={form.outcome?.title || ''} onChange={(e) => set('outcome', { ...form.outcome, title: e.target.value })} placeholder="1st Place - Design Challenge" />
            </div>
            <div>
              <label className={labelCls}>Outcome Description</label>
              <textarea className={`${inputCls} resize-none`} rows={3} value={form.outcome?.description || ''} onChange={(e) => set('outcome', { ...form.outcome, description: e.target.value })} />
            </div>
          </div>
        </div>
      )}

      <div className="pt-4 pb-4">
        <button type="submit" disabled={saving}
          className="bg-white/[0.06] hover:bg-white/10 disabled:opacity-50 text-white text-[9px] uppercase tracking-[0.3em] px-6 py-2.5 rounded-lg transition-colors">
          {saving ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}

/* ─── Sub-editors for complex fields ─── */

function QuotesEditor({ quotes, onChange, inputCls, labelCls }: { quotes: ResearchQuote[]; onChange: (q: ResearchQuote[]) => void; inputCls: string; labelCls: string }) {
  const add = () => onChange([...quotes, { text: '', source: '', insight: '' }]);
  const remove = (i: number) => onChange(quotes.filter((_, idx) => idx !== i));
  const update = (i: number, key: keyof ResearchQuote, val: string) => {
    const next = [...quotes];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {quotes.map((q, i) => (
        <div key={i} className="p-3 rounded-lg border border-white/[0.04] space-y-2">
          <textarea className={`${inputCls} resize-none`} rows={2} value={q.text} onChange={(e) => update(i, 'text', e.target.value)} placeholder="Quote text" />
          <div className="grid grid-cols-2 gap-2">
            <input className={inputCls} value={q.source} onChange={(e) => update(i, 'source', e.target.value)} placeholder="Source (e.g. Plumber)" />
            <input className={inputCls} value={q.insight} onChange={(e) => update(i, 'insight', e.target.value)} placeholder="Key insight" />
          </div>
          <button type="button" onClick={() => remove(i)} className="text-red-400/60 text-[12px] hover:text-red-400">Remove</button>
        </div>
      ))}
      <button type="button" onClick={add} className="text-[12px] text-white/30 hover:text-white/60 border border-dashed border-white/[0.06] rounded-lg px-3 py-2 w-full">+ Add Quote</button>
    </div>
  );
}

function PersonasEditor({ personas, onChange, inputCls }: { personas: Persona[]; onChange: (p: Persona[]) => void; inputCls: string }) {
  const add = () => onChange([...personas, { name: '', type: '', needs: '' }]);
  const remove = (i: number) => onChange(personas.filter((_, idx) => idx !== i));
  const update = (i: number, key: keyof Persona, val: string) => {
    const next = [...personas];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {personas.map((p, i) => (
        <div key={i} className="p-3 rounded-lg border border-white/[0.04] grid grid-cols-3 gap-2">
          <input className={inputCls} value={p.name} onChange={(e) => update(i, 'name', e.target.value)} placeholder="Name (e.g. Homeowner)" />
          <input className={inputCls} value={p.type} onChange={(e) => update(i, 'type', e.target.value)} placeholder="Type (e.g. Primary)" />
          <input className={inputCls} value={p.needs} onChange={(e) => update(i, 'needs', e.target.value)} placeholder="Needs" />
          <button type="button" onClick={() => remove(i)} className="text-red-400/60 text-[12px] hover:text-red-400 col-span-3">Remove</button>
        </div>
      ))}
      <button type="button" onClick={add} className="text-[12px] text-white/30 hover:text-white/60 border border-dashed border-white/[0.06] rounded-lg px-3 py-2 w-full">+ Add Persona</button>
    </div>
  );
}

function DecisionsEditor({ decisions, onChange, inputCls }: { decisions: DesignDecision[]; onChange: (d: DesignDecision[]) => void; inputCls: string }) {
  const add = () => onChange([...decisions, { question: '', answer: '' }]);
  const remove = (i: number) => onChange(decisions.filter((_, idx) => idx !== i));
  const update = (i: number, key: keyof DesignDecision, val: string) => {
    const next = [...decisions];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {decisions.map((d, i) => (
        <div key={i} className="p-3 rounded-lg border border-white/[0.04] space-y-2">
          <input className={inputCls} value={d.question} onChange={(e) => update(i, 'question', e.target.value)} placeholder="Question (e.g. Why acoustic-only?)" />
          <textarea className={`${inputCls} resize-none`} rows={2} value={d.answer} onChange={(e) => update(i, 'answer', e.target.value)} placeholder="Answer / rationale" />
          <button type="button" onClick={() => remove(i)} className="text-red-400/60 text-[12px] hover:text-red-400">Remove</button>
        </div>
      ))}
      <button type="button" onClick={add} className="text-[12px] text-white/30 hover:text-white/60 border border-dashed border-white/[0.06] rounded-lg px-3 py-2 w-full">+ Add Decision</button>
    </div>
  );
}

function ScreensEditor({ screens, onChange, inputCls }: { screens: KeyScreen[]; onChange: (s: KeyScreen[]) => void; inputCls: string }) {
  const add = () => onChange([...screens, { title: '', subtitle: '', description: '', image: '', decisions: [] }]);
  const remove = (i: number) => onChange(screens.filter((_, idx) => idx !== i));
  const update = (i: number, key: string, val: unknown) => {
    const next = [...screens];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {screens.map((s, i) => (
        <div key={i} className="p-3 rounded-lg border border-white/[0.04] space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input className={inputCls} value={s.title} onChange={(e) => update(i, 'title', e.target.value)} placeholder="Screen title" />
            <input className={inputCls} value={s.subtitle} onChange={(e) => update(i, 'subtitle', e.target.value)} placeholder="Subtitle" />
          </div>
          <textarea className={`${inputCls} resize-none`} rows={2} value={s.description} onChange={(e) => update(i, 'description', e.target.value)} placeholder="Screen description" />
          <input className={inputCls} value={s.image} onChange={(e) => update(i, 'image', e.target.value)} placeholder="Image path" />
          <input className={inputCls} value={s.decisions.join(', ')} onChange={(e) => update(i, 'decisions', e.target.value.split(',').map((d: string) => d.trim()).filter(Boolean))} placeholder="Key decisions (comma-separated)" />
          <button type="button" onClick={() => remove(i)} className="text-red-400/60 text-[12px] hover:text-red-400">Remove</button>
        </div>
      ))}
      <button type="button" onClick={add} className="text-[12px] text-white/30 hover:text-white/60 border border-dashed border-white/[0.06] rounded-lg px-3 py-2 w-full">+ Add Screen</button>
    </div>
  );
}
