import type { Metadata } from "next";
import { getSiteSettings } from "@/api/site-settings";
import { resolveMediaUrl } from "@/api/media";
import JsonLd from "@/components/JsonLd";
import HomeScreen from "@/screens/home/HomeScreen";
import { siteUrl } from "@/utils/siteUrl";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const { general } = await getSiteSettings();
  const logo = resolveMediaUrl(general.logoUrl || "/icons/logo.svg");
  return (
    <>
      {/* Schema.org Organization: seller details for search engines (legal data as in /requisites). */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "AMINOCLUB",
          legalName: "ООО «Ингредиенты. Развитие»",
          url: siteUrl,
          logo: logo.startsWith("http") ? logo : `${siteUrl}${logo}`,
          ...(general.email ? { email: general.email } : {}),
          ...(general.phone ? { telephone: general.phone } : {}),
          address: {
            "@type": "PostalAddress",
            streetAddress: "Канонерский остров, д. 3, корп. 1, лит. Б",
            addressLocality: "Санкт-Петербург",
            postalCode: "198184",
            addressCountry: "RU",
          },
          sameAs: general.socialLinks.map((link) => link.url).filter((url) => /^https?:\/\//.test(url)),
        }}
      />
      <HomeScreen />
    </>
  );
}
