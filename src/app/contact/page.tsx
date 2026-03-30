import ContactPageClient from "./ContactPageClient";
import { getSiteConfig, seedIfEmpty } from "@/lib/db";

export const revalidate = 60;

export default function ContactPage() {
  seedIfEmpty();
  const siteConfig = getSiteConfig();
  return <ContactPageClient siteConfig={siteConfig} />;
}
