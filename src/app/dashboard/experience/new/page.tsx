'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ExperienceForm from '@/components/dashboard/ExperienceForm';
import { Experience } from '@/types';

export default function NewExperiencePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (exp: Experience) => {
    setSaving(true);
    try {
      const res = await fetch('/api/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exp),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to save experience');
        return;
      }
      router.push('/dashboard/experience');
    } catch {
      alert('Failed to save experience');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-white text-lg font-light mb-6">New Experience</h1>
      <ExperienceForm onSave={handleSave} saving={saving} />
    </div>
  );
}
