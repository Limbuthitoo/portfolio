import ContactPageClient from "./ContactPageClient";
import { getSiteConfig, seedIfEmpty } from "@/lib/db";

export const revalidate = 60;

export default async function ContactPage() {
  await seedIfEmpty();
  const siteConfig = await getSiteConfig();
  return <ContactPageClient siteConfig={siteConfig} />;
}
