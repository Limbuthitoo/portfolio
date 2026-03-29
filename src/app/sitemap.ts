import type { MetadataRoute } from 'next';
import { getProjects, seedIfEmpty } from '@/lib/db';

export default function sitemap(): MetadataRoute.Sitemap {
  seedIfEmpty();
  const baseUrl = 'https://bijaysubbalimbu.com';

  const projects = getProjects();
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
