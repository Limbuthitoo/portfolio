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
    await fetch('/api/experience', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exp),
    });
    router.push('/dashboard/experience');
  };

  return (
    <div>
      <h1 className="text-white text-lg font-light mb-6">New Experience</h1>
      <ExperienceForm onSave={handleSave} saving={saving} />
    </div>
  );
}
