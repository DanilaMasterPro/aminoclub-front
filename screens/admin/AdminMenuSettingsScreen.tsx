"use client";

import { FormEvent } from "react";
import AdminMenuEditor from "./components/AdminMenuEditor";
import AdminPageHeader from "./components/AdminPageHeader";
import AdminSettingsNav from "./components/AdminSettingsNav";
import { useAdminMenuPages, useAdminSettingSection } from "./hooks/useAdminSettings";

export default function AdminMenuSettingsScreen() {
  const settings = useAdminSettingSection("menus", { header: [], footer: [] });
  const pages = useAdminMenuPages();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void settings.save();
  };

  return (
    <section className="max-w-5xl">
      <AdminPageHeader eyebrow="Навигация сайта" title="Меню" />
      <AdminSettingsNav />
      <form onSubmit={submit} className="space-y-6">
        <AdminMenuEditor
          title="Верхнее меню"
          description="Открывается по кнопке меню в шапке сайта."
          items={settings.value.header}
          pages={pages}
          onChange={(header) => settings.setValue((current) => ({ ...current, header }))}
        />
        <AdminMenuEditor
          title="Нижнее меню"
          description="Отображается в футере. Пункты с одинаковой группой собираются в одну колонку."
          items={settings.value.footer}
          pages={pages}
          showGroups
          onChange={(footer) => settings.setValue((current) => ({ ...current, footer }))}
        />
        {settings.message && <p className="text-sm text-slate-600" aria-live="polite">{settings.message}</p>}
        <button disabled={settings.isSaving || settings.isLoading} className="rounded-lg bg-[#009d0a] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-50">
          {settings.isSaving ? "Сохраняем…" : "Сохранить меню"}
        </button>
      </form>
    </section>
  );
}
