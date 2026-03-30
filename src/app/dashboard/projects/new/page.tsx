'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/dashboard/ProjectForm';
import { Project } from '@/types';

export default function NewProjectPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (project: Project) => {
    setSaving(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to save project');
        return;
      }
      router.push('/dashboard/projects');
    } catch {
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-white text-lg font-light mb-6">New Project</h1>
      <ProjectForm onSave={handleSave} saving={saving} />
    </div>
  );
}
