import BentoGrid from "@/components/bento/BentoGrid";
import HeroSection from "@/components/bento/HeroSection";
import { getProjects, getExperiences, getSiteConfig, seedIfEmpty } from "@/lib/db";

export const revalidate = 60;

export default function Home() {
  seedIfEmpty();
  const projects = getProjects();
  const experiences = getExperiences();
  const siteConfig = getSiteConfig();

  return (
    <>
      <HeroSection siteConfig={siteConfig} />
      <BentoGrid projects={projects} experiences={experiences} siteConfig={siteConfig} />
    </>
  );
}
