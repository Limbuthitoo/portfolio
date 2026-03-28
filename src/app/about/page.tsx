import AboutPageClient from '@/components/about/AboutPageClient';
import { getSiteConfig, getExperiences, seedIfEmpty } from '@/lib/db';

export const revalidate = 60;

export default function AboutPage() {
  seedIfEmpty();
  const siteConfig = getSiteConfig();
  const experiences = getExperiences();
  return <AboutPageClient siteConfig={siteConfig} experiences={experiences} />;
}
