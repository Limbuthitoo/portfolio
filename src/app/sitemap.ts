import type { MetadataRoute } from 'next';
import { getProjects, seedIfEmpty } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await seedIfEmpty();
  const baseUrl = 'https://bijaysubbalimbu.com.np';

  const projects = await getProjects();
  const projectUrls = projects.map((p) => ({
    url: `${baseUrl}/work/${p.slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/work`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    ...projectUrls,
  ];
}
