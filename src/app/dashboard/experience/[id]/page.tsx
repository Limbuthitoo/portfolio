'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ExperienceForm from '@/components/dashboard/ExperienceForm';
import { Experience } from '@/types';

export default function EditExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [exp, setExp] = useState<Experience | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/experience/${id}`).then((r) => r.json()).then(setExp);
  }, [id]);

  const handleSave = async (updated: Experience) => {
    setSaving(true);
    await fetch(`/api/experience/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    router.push('/dashboard/experience');
  };

  if (!exp) return <p className="text-white/30 text-sm">Loading...</p>;

  return (
    <div>
      <h1 className="text-white text-lg font-light mb-6">Edit: {exp.role}</h1>
      <ExperienceForm experience={exp} onSave={handleSave} saving={saving} />
    </div>
  );
}
