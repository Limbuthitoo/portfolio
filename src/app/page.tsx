import BentoGrid from "@/components/bento/BentoGrid";
import HeroSection from "@/components/bento/HeroSection";
import { getProjects, getExperiences, getSiteConfig, seedIfEmpty } from "@/lib/db";

export const revalidate = 60;

export default async function Home() {
  await seedIfEmpty();
  const projects = await getProjects();
  const experiences = await getExperiences();
  const siteConfig = await getSiteConfig();

  return (
    <>
      <HeroSection siteConfig={siteConfig} />
      <BentoGrid projects={projects} experiences={experiences} siteConfig={siteConfig} />
    </>
  );
}
