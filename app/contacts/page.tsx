import type { Metadata } from "next";
import { getSiteSettings } from "@/api/site-settings";
import ContactsScreen from "@/screens/contacts/ContactsScreen";
import { buildSiteMetadata, systemPageSeo } from "@/utils/siteMetadata";

// Meta tags are edited in admin → «SEO шаблон» → «Страницы сайта».
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteSettings();
  return buildSiteMetadata({ ...systemPageSeo(seo, "contacts"), path: "/contacts" }, seo);
}

export default function ContactsPage() { return <ContactsScreen />; }
