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
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    router.push('/dashboard/projects');
  };

  return (
    <div>
      <h1 className="text-white text-lg font-light mb-6">New Project</h1>
      <ProjectForm onSave={handleSave} saving={saving} />
    </div>
  );
}
