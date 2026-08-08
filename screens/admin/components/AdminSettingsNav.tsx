"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["Общие", "/admin/settings"],
  ["SEO шаблон", "/admin/settings/seo"],
  ["Меню", "/admin/settings/menu"],
] as const;

export default function AdminSettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex flex-wrap gap-2" aria-label="Разделы настроек">
      {links.map(([label, href]) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} className={`rounded-lg border px-4 py-2 text-sm font-medium ${active ? "border-[#009d0a] bg-[#009d0a] text-white" : "border-slate-300 bg-white text-slate-700 hover:border-[#009d0a]"}`}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
