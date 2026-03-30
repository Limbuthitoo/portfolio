import { getSiteConfig, getExperiences, seedIfEmpty } from "@/lib/db";
import ResumeClient from "./ResumeClient";

export const revalidate = 60;

export default async function ResumePage() {
  await seedIfEmpty();
  const [siteConfig, experiences] = await Promise.all([
    getSiteConfig(),
    getExperiences(),
  ]);
  return <ResumeClient siteConfig={siteConfig} experiences={experiences} />;
}
