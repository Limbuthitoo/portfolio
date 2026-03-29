'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProjectForm from '@/components/dashboard/ProjectForm';
import { Project } from '@/types';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${slug}`).then((r) => r.ok ? r.json() : Promise.reject()).then(setProject).catch(() => {});
  }, [slug]);

  const handleSave = async (updated: Project) => {
    setSaving(true);
    await fetch(`/api/projects/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    router.push('/dashboard/projects');
  };

  if (!project) return <p className="text-white/30 text-sm">Loading...</p>;

  return (
    <div>
      <h1 className="text-white text-lg font-light mb-6">Edit: {project.title}</h1>
      <ProjectForm project={project} onSave={handleSave} saving={saving} />
    </div>
  );
}
