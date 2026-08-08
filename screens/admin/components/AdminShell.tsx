"use client";

import type { AuthUser } from "@/api/types";
import AuthGate from "@/components/AuthGate";
import DashboardHeader from "@/components/DashboardHeader";
import { useLogout } from "@/hooks/useLogout";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  ["Обзор", "/admin"], ["Товары", "/admin/products"], ["Категории", "/admin/categories"],
  ["Заказы", "/admin/orders"], ["Тренеры", "/admin/trainers"],
  ["Заявки тренеров", "/admin/trainer-applications"], ["Промокоды", "/admin/promo-codes"],
  ["Реферальная статистика", "/admin/referral"], ["Выплаты", "/admin/payouts"],
  ["Страницы", "/admin/pages"], ["Новости", "/admin/articles"],
  ["Баннеры", "/admin/banners"],
] as const;

const settingsNav = [
  ["Меню", "/admin/settings/menu"],
  ["SEO шаблон", "/admin/settings/seo"],
  ["Общие", "/admin/settings"],
] as const;

function Shell({ user, children }: { user: AuthUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { logout, isLoggingOut } = useLogout();

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-slate-900">
      <aside className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-[#111716] text-white transition-transform lg:translate-x-0`}>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Link href="/admin" className="font-black tracking-tight text-[#39d353]">AMINOCLUB</Link>
          <button onClick={() => setOpen(false)} className="text-xl lg:hidden" aria-label="Закрыть меню">×</button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {nav.map(([label, href]) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return <Link key={href} href={href} onClick={() => setOpen(false)} className={`mb-1 block rounded-lg px-3 py-2.5 text-sm ${active ? "bg-[#009d0a] font-semibold text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>{label}</Link>;
          })}
          <div className="mt-1">
            <Link href="/admin/settings" onClick={() => setOpen(false)} className={`block rounded-lg px-3 py-2.5 text-sm ${pathname.startsWith("/admin/settings") ? "font-semibold text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>
              Настройки
            </Link>
            <div className="ml-3 border-l border-white/15 pl-2">
              {settingsNav.map(([label, href]) => {
                const active = pathname === href;
                return <Link key={href} href={href} onClick={() => setOpen(false)} className={`mb-1 block rounded-lg px-3 py-2 text-xs ${active ? "bg-[#009d0a] font-semibold text-white" : "text-slate-400 hover:bg-white/10 hover:text-white"}`}>{label}</Link>;
              })}
            </div>
          </div>
        </nav>
      </aside>
      {open && <button className="fixed inset-0 z-20 bg-black/30 lg:hidden" onClick={() => setOpen(false)} aria-label="Закрыть меню" />}
      <div className="lg:pl-64">
        <DashboardHeader sticky email={user.email} isLoggingOut={isLoggingOut} onLogout={logout}>
          <button type="button" onClick={() => setOpen(true)} className="rounded-lg border border-slate-200 px-3 py-2 lg:hidden">Меню</button>
          <span className="hidden text-sm text-slate-500 lg:block">Административная панель</span>
        </DashboardHeader>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return <AuthGate role="ADMIN">{(user) => <Shell user={user}>{children}</Shell>}</AuthGate>;
}
