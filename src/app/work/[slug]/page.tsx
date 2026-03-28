import { notFound } from 'next/navigation';
import ProjectDetailClient from '@/components/work/ProjectDetailClient';
import UIUXDetailClient from '@/components/work/UIUXDetailClient';
import { getProjects, getProjectBySlug, seedIfEmpty } from '@/lib/db';

export const revalidate = 60;

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  seedIfEmpty();
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const projects = getProjects();
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  if (project.type === 'uiux') {
    return <UIUXDetailClient project={project} nextProject={nextProject} currentIndex={currentIndex} />;
  }

  return <ProjectDetailClient project={project} nextProject={nextProject} currentIndex={currentIndex} />;
}
