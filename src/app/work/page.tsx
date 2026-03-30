import WorkPageClient from '@/components/work/WorkPageClient';
import { getProjects, seedIfEmpty } from '@/lib/db';

export const revalidate = 60;

export default async function WorkPage() {
  await seedIfEmpty();
  const projects = await getProjects();
  return <WorkPageClient projects={projects} />;
}
