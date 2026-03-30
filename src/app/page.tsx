import BentoGrid from "@/components/bento/BentoGrid";
import HeroSection from "@/components/bento/HeroSection";
import ScrollMarquee from "@/components/common/ScrollMarquee";
import { getProjects, getExperiences, getSiteConfig, seedIfEmpty } from "@/lib/db";

export const revalidate = 60;

export default async function Home() {
  await seedIfEmpty();
  const projects = await getProjects();
  const experiences = await getExperiences();
  const siteConfig = await getSiteConfig();

  const marqueeTexts = siteConfig.roles?.length
    ? siteConfig.roles
    : ["Design Engineer", "Frontend Developer", "UI/UX Designer", "Creative Technologist"];

  return (
    <>
      <HeroSection siteConfig={siteConfig} />
      <ScrollMarquee texts={marqueeTexts} />
      <BentoGrid projects={projects} experiences={experiences} siteConfig={siteConfig} />
    </>
  );
}
