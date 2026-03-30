'use client';

import { useEffect, useState } from 'react';
import { SiteConfig, Highlight, SkillGroup, Capability, CurrentlyItem } from '@/types';

const inputCls = 'w-full bg-white/[0.03] border border-white/[0.06] focus:border-white/15 text-white text-sm px-3 py-2.5 rounded-lg outline-none transition-colors';
const labelCls = 'text-white/25 text-[9px] uppercase tracking-[0.25em] block mb-1.5';
const sectionCls = 'pt-6 mt-6 border-t border-white/[0.06]';
const btnCls = 'bg-white/[0.06] hover:bg-white/10 disabled:opacity-50 text-white text-[9px] uppercase tracking-[0.3em] px-6 py-2.5 rounded-lg transition-colors';
const addBtnCls = 'text-[11px] text-white/30 hover:text-white/60 border border-dashed border-white/[0.06] rounded-lg px-3 py-2 w-full transition-colors';
const removeBtnCls = 'text-red-400/60 text-[11px] hover:text-red-400 transition-colors';

export default function SettingsPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/config').then((r) => r.ok ? r.json() : Promise.reject()).then(setConfig).catch(() => {});
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to save settings');
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword) {
      setPasswordMessage({ type: 'error', text: 'Enter your current password' });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 8 characters' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setPasswordSaving(true);
    setPasswordMessage(null);

    try {
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setPasswordMessage({ type: 'success', text: 'Password changed successfully' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMessage({ type: 'error', text: data.error || 'Failed to change password' });
      }
    } catch {
      setPasswordMessage({ type: 'error', text: 'Failed to change password' });
    }
    setPasswordSaving(false);
  };

  if (!config) return <p className="text-white/30 text-sm">Loading...</p>;

  const set = (key: keyof SiteConfig, value: unknown) => setConfig((prev) => prev ? { ...prev, [key]: value } : prev);

  return (
    <div className="flex flex-col h-full -m-5">
      <div className="flex-1 overflow-y-auto p-5">
        <h1 className="text-white text-lg font-light mb-6">Settings</h1>

        <div className="max-w-2xl space-y-4">
        {/* ── General ── */}
        <SectionTitle>General</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Name</label>
            <input className={inputCls} value={config.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input className={inputCls} value={config.email} onChange={(e) => set('email', e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Title (shown below name on homepage)</label>
            <input className={inputCls} value={config.title} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Role (shown on about page)</label>
            <input className={inputCls} value={config.role} onChange={(e) => set('role', e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <textarea className={`${inputCls} resize-none`} rows={3} value={config.description} onChange={(e) => set('description', e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Location</label>
            <input className={inputCls} value={config.location} onChange={(e) => set('location', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Availability</label>
            <input className={inputCls} value={config.availability} onChange={(e) => set('availability', e.target.value)} />
          </div>
        </div>

        {/* ── Social Links ── */}
        <div className={sectionCls}>
          <SectionTitle>Social Links</SectionTitle>
          <div className="space-y-2">
            {Object.entries(config.social).map(([platform, url]) => (
              <div key={platform} className="flex items-center gap-3">
                <span className="text-white/20 text-[9px] uppercase tracking-[0.2em] w-20">{platform}</span>
                <input
                  type="url"
                  value={url || ''}
                  onChange={(e) => set('social', { ...config.social, [platform]: e.target.value })}
                  className={`flex-1 ${inputCls}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Animated Roles (Hero Banner) ── */}
        <div className={sectionCls}>
          <SectionTitle>Animated Roles (Hero Banner)</SectionTitle>
          <p className="text-white/15 text-[10px] mb-3">These rotate in the hero section on the homepage.</p>
          <TagListEditor
            items={config.roles || []}
            onChange={(roles) => set('roles', roles)}
            placeholder="e.g. Frontend Developer"
          />
        </div>

        {/* ── Highlights (Stats) ── */}
        <div className={sectionCls}>
          <SectionTitle>Highlights (Homepage Stats)</SectionTitle>
          <HighlightsEditor
            highlights={config.highlights || []}
            onChange={(highlights) => set('highlights', highlights)}
          />
        </div>

        {/* ── Tech Stack ── */}
        <div className={sectionCls}>
          <SectionTitle>Tech Stack</SectionTitle>
          <p className="text-white/15 text-[10px] mb-3">Shown in the tech stack card on the homepage.</p>
          <TagListEditor
            items={config.techStack || []}
            onChange={(techStack) => set('techStack', techStack)}
            placeholder="e.g. React"
          />
        </div>

        {/* ── Skills (Homepage Card) ── */}
        <div className={sectionCls}>
          <SectionTitle>Skills (Homepage Card)</SectionTitle>
          <p className="text-white/15 text-[10px] mb-3">Grouped skill tags shown on the homepage skills card.</p>
          <SkillGroupsEditor
            groups={config.skills || []}
            onChange={(skills) => set('skills', skills)}
          />
        </div>

        {/* ── Capabilities (About Page) ── */}
        <div className={sectionCls}>
          <SectionTitle>Capabilities (About Page)</SectionTitle>
          <p className="text-white/15 text-[10px] mb-3">Design, Development, and Tools skill lists on the about page.</p>
          <CapabilitiesEditor
            capabilities={config.capabilities || []}
            onChange={(capabilities) => set('capabilities', capabilities)}
          />
        </div>

        {/* ── Currently (Homepage Card) ── */}
        <div className={sectionCls}>
          <SectionTitle>Currently (Homepage Card)</SectionTitle>
          <p className="text-white/15 text-[10px] mb-3">What you&apos;re working on, learning, listening to — keeps the site feeling alive.</p>
          <CurrentlyEditor
            items={config.currently || []}
            onChange={(currently) => set('currently', currently)}
          />
        </div>

        {/* ── Password Change ── */}
        <div className={sectionCls}>
          <SectionTitle>Change Password</SectionTitle>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputCls} />
            </div>
            {passwordMessage && (
              <p className={`text-xs ${passwordMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {passwordMessage.text}
              </p>
            )}
            <div className="pt-2">
              <button onClick={handlePasswordChange} disabled={passwordSaving} className={btnCls}>
                {passwordSaving ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

      <div className="shrink-0 border-t border-white/[0.06] bg-[#060606] px-5 py-3 flex justify-end">
        <button onClick={handleSave} disabled={saving} className={btnCls}>
          {saved ? 'Saved ✓' : saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-white/60 text-xs uppercase tracking-[0.25em] mb-3">{children}</h2>;
}

function TagListEditor({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [input, setInput] = useState('');
  const add = () => {
    const val = input.trim();
    if (val && !items.includes(val)) {
      onChange([...items, val]);
      setInput('');
    }
  };
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/70 text-[12px]">
            {item}
            <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="text-white/20 hover:text-red-400 text-[10px]">✕</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className={inputCls}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder}
        />
        <button type="button" onClick={add} className="shrink-0 bg-white/[0.06] hover:bg-white/10 text-white text-[11px] px-4 rounded-lg transition-colors">Add</button>
      </div>
    </div>
  );
}

function HighlightsEditor({ highlights, onChange }: { highlights: Highlight[]; onChange: (v: Highlight[]) => void }) {
  const add = () => onChange([...highlights, { value: '', label: '' }]);
  const update = (i: number, key: keyof Highlight, val: string) => {
    const next = [...highlights];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {highlights.map((h, i) => (
        <div key={i} className="flex items-center gap-2">
          <input className={`${inputCls} w-24`} value={h.value} onChange={(e) => update(i, 'value', e.target.value)} placeholder="12+" />
          <input className={inputCls} value={h.label} onChange={(e) => update(i, 'label', e.target.value)} placeholder="Years Exp" />
          <button type="button" onClick={() => onChange(highlights.filter((_, idx) => idx !== i))} className={removeBtnCls}>✕</button>
        </div>
      ))}
      <button type="button" onClick={add} className={addBtnCls}>+ Add Highlight</button>
    </div>
  );
}

function SkillGroupsEditor({ groups, onChange }: { groups: SkillGroup[]; onChange: (v: SkillGroup[]) => void }) {
  const add = () => onChange([...groups, { label: '', skills: [] }]);
  const updateLabel = (i: number, label: string) => {
    const next = [...groups];
    next[i] = { ...next[i], label };
    onChange(next);
  };
  const updateSkills = (i: number, skills: string) => {
    const next = [...groups];
    next[i] = { ...next[i], skills: skills.split(',').map((s) => s.trim()).filter(Boolean) };
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {groups.map((g, i) => (
        <div key={i} className="p-3 rounded-lg border border-white/[0.04] space-y-2">
          <div className="flex items-center gap-2">
            <input className={`${inputCls} w-32`} value={g.label} onChange={(e) => updateLabel(i, e.target.value)} placeholder="Frontend" />
            <button type="button" onClick={() => onChange(groups.filter((_, idx) => idx !== i))} className={removeBtnCls}>Remove</button>
          </div>
          <input className={inputCls} value={g.skills.join(', ')} onChange={(e) => updateSkills(i, e.target.value)} placeholder="React, Next.js, TypeScript" />
        </div>
      ))}
      <button type="button" onClick={add} className={addBtnCls}>+ Add Skill Group</button>
    </div>
  );
}

function CapabilitiesEditor({ capabilities, onChange }: { capabilities: Capability[]; onChange: (v: Capability[]) => void }) {
  const add = () => onChange([...capabilities, { category: '', skills: [] }]);
  const updateCategory = (i: number, category: string) => {
    const next = [...capabilities];
    next[i] = { ...next[i], category };
    onChange(next);
  };
  const updateSkills = (i: number, skills: string) => {
    const next = [...capabilities];
    next[i] = { ...next[i], skills: skills.split(',').map((s) => s.trim()).filter(Boolean) };
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {capabilities.map((c, i) => (
        <div key={i} className="p-3 rounded-lg border border-white/[0.04] space-y-2">
          <div className="flex items-center gap-2">
            <input className={`${inputCls} w-40`} value={c.category} onChange={(e) => updateCategory(i, e.target.value)} placeholder="Design" />
            <button type="button" onClick={() => onChange(capabilities.filter((_, idx) => idx !== i))} className={removeBtnCls}>Remove</button>
          </div>
          <input className={inputCls} value={c.skills.join(', ')} onChange={(e) => updateSkills(i, e.target.value)} placeholder="UI/UX Design, Graphic Design, Motion Graphics" />
        </div>
      ))}
      <button type="button" onClick={add} className={addBtnCls}>+ Add Capability</button>
    </div>
  );
}

function CurrentlyEditor({ items, onChange }: { items: CurrentlyItem[]; onChange: (v: CurrentlyItem[]) => void }) {
  const LABEL_EMOJI: Record<string, string> = {
    Building: '🛠️', Creating: '✨', Learning: '📚', Reading: '📖',
    Listening: '🎧', Watching: '📺', Playing: '🎮', Exploring: '🧭',
    Designing: '🎨', Writing: '✍️', Cooking: '🍳', Traveling: '✈️',
    Thinking: '💭', Shipping: '🚀',
  };
  const labels = Object.keys(LABEL_EMOJI);

  const add = () => onChange([...items, { emoji: '🛠️', label: 'Building', value: '' }]);
  const updateLabel = (i: number, label: string) => {
    const next = [...items];
    next[i] = { ...next[i], label, emoji: LABEL_EMOJI[label] || next[i].emoji };
    onChange(next);
  };
  const updateValue = (i: number, value: string) => {
    const next = [...items];
    next[i] = { ...next[i], value };
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-10 text-center text-[18px] shrink-0">{LABEL_EMOJI[item.label] || item.emoji}</span>
          <select
            className={`${inputCls} w-36`}
            value={labels.includes(item.label) ? item.label : ''}
            onChange={(e) => updateLabel(i, e.target.value)}
          >
            {!labels.includes(item.label) && <option value="">{item.label || 'Select...'}</option>}
            {labels.map((l) => <option key={l} value={l}>{LABEL_EMOJI[l]} {l}</option>)}
          </select>
          <input className={inputCls} value={item.value} onChange={(e) => updateValue(i, e.target.value)} placeholder="e.g. Portfolio v2" />
          <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className={removeBtnCls}>✕</button>
        </div>
      ))}
      <button type="button" onClick={add} className={addBtnCls}>+ Add Item</button>
    </div>
  );
}
