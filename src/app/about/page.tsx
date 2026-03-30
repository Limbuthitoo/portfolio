import AboutPageClient from '@/components/about/AboutPageClient';
import { getSiteConfig, getExperiences, seedIfEmpty } from '@/lib/db';

export const revalidate = 60;

export default async function AboutPage() {
  await seedIfEmpty();
  const siteConfig = await getSiteConfig();
  const experiences = await getExperiences();
  return <AboutPageClient siteConfig={siteConfig} experiences={experiences} />;
}
