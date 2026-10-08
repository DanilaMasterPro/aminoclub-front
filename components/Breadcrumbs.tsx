import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { siteUrl } from "@/utils/siteUrl";

export type Crumb = { label: string; href: string };

/**
 * Visible breadcrumbs plus the matching Schema.org BreadcrumbList for search engines.
 * «Главная» is added automatically; the last item is the current page.
 */
export default function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  const crumbs: Crumb[] = [{ label: "Главная", href: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `${siteUrl}${crumb.href}`,
    })),
  };

  return (
    <nav aria-label="Хлебные крошки" className={`text-xs text-[#6d7271] ${className}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map((crumb, index) => {
          const isCurrent = index === crumbs.length - 1;
          return (
            <li key={`${crumb.href}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {isCurrent ? (
                <span aria-current="page" className="text-[#15191a]">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="transition-colors hover:text-[#15191a]">{crumb.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd data={jsonLd} />
    </nav>
  );
}
