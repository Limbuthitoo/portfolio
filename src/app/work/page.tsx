import WorkPageClient from '@/components/work/WorkPageClient';
import { getProjects, seedIfEmpty } from '@/lib/db';

export const revalidate = 60;

export default function WorkPage() {
  seedIfEmpty();
  const projects = getProjects();
  return <WorkPageClient projects={projects} />;
}
