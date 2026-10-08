"use client";

import { FormEvent, useState } from "react";
import { defaultSiteSettings } from "@/api/site-settings";
import type { PageSeo, SeoSystemPage } from "@/api/types";
import AdminImageDropzone from "./components/AdminImageDropzone";
import AdminPageHeader from "./components/AdminPageHeader";
import AdminSettingsNav from "./components/AdminSettingsNav";
import { useAdminSettingSection } from "./hooks/useAdminSettings";

const inputClassName = "mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#009d0a]";

const systemPages: Array<{ key: SeoSystemPage; label: string; path: string }> = [
  { key: "catalog", label: "Каталог", path: "/catalog" },
  { key: "contacts", label: "Контакты", path: "/contacts" },
  { key: "news", label: "Блог", path: "/news" },
  { key: "affiliate", label: "Партнёрская программа", path: "/affiliate" },
];

/** Comma-separated keywords. The raw text is kept while typing, so commas are not swallowed. */
function KeywordsInput({ value, onChange }: { value: string[]; onChange: (keywords: string[]) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <input
      value={draft ?? value.join(", ")}
      onChange={(event) => {
        setDraft(event.target.value);
        onChange(event.target.value.split(",").map((item) => item.trim()).filter(Boolean));
      }}
      onBlur={() => setDraft(null)}
      placeholder="протеин, спортивное питание"
      className={inputClassName}
    />
  );
}

export default function AdminSeoSettingsScreen() {
  const settings = useAdminSettingSection("seo", { ...defaultSiteSettings.seo, title: "", description: "", keywords: [], imageUrl: "" });
  // An API without per-page SEO yet still gets the defaults.
  const pages = { ...defaultSiteSettings.seo.pages, ...settings.value.pages };

  const setPage = (key: SeoSystemPage, patch: Partial<PageSeo>) =>
    settings.setValue((current) => ({ ...current, pages: { ...defaultSiteSettings.seo.pages, ...current.pages, [key]: { ...pages[key], ...patch } } }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void settings.save();
  };

  return (
    <section className="max-w-5xl">
      <AdminPageHeader eyebrow="Поисковая оптимизация" title="SEO шаблон" />
      <AdminSettingsNav />
      <form onSubmit={submit} className="grid gap-5 rounded-xl border border-slate-200 bg-white p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <h2 className="text-lg font-semibold">Главная и шаблон по умолчанию</h2>
          <p className="mt-1 text-sm text-slate-500">Используется на главной и везде, где у страницы не заполнены собственные SEO-поля.</p>
        </div>
        <label className="text-sm font-medium sm:col-span-2">
          Title
          <input value={settings.value.title} onChange={(event) => settings.setValue((current) => ({ ...current, title: event.target.value }))} className={inputClassName} />
        </label>
        <label className="text-sm font-medium sm:col-span-2">
          Description
          <textarea rows={4} value={settings.value.description} onChange={(event) => settings.setValue((current) => ({ ...current, description: event.target.value }))} className={inputClassName} />
        </label>
        <label className="text-sm font-medium sm:col-span-2">
          Keywords через запятую
          <KeywordsInput value={settings.value.keywords} onChange={(keywords) => settings.setValue((current) => ({ ...current, keywords }))} />
        </label>
        <AdminImageDropzone
          fieldName="seo-image"
          label="Изображение Open Graph (превью ссылки в мессенджерах)"
          images={settings.value.imageUrl ? [{ url: settings.value.imageUrl, title: "Open Graph" }] : []}
          isUploading={settings.isUploading}
          onUpload={async (file) => {
            const imageUrl = await settings.uploadImage(file);
            settings.setValue((current) => ({ ...current, imageUrl }));
          }}
          onRemove={() => settings.setValue((current) => ({ ...current, imageUrl: "" }))}
        />

        <div className="mt-4 border-t border-slate-200 pt-6 sm:col-span-2">
          <h2 className="text-lg font-semibold">Страницы сайта</h2>
          <p className="mt-1 text-sm text-slate-500">
            У этих страниц нет своей записи в разделе «Страницы», поэтому их метатеги задаются здесь.
            SEO товаров, категорий, новостей и страниц — в формах этих разделов.
          </p>
        </div>
        {systemPages.map((page) => (
          <fieldset key={page.key} className="grid gap-4 rounded-lg border border-slate-200 p-4 sm:col-span-2">
            <legend className="px-1 text-sm font-semibold">{page.label} <span className="font-normal text-slate-500">{page.path}</span></legend>
            <label className="text-sm font-medium">
              Title
              <input value={pages[page.key].title} onChange={(event) => setPage(page.key, { title: event.target.value })} className={inputClassName} />
            </label>
            <label className="text-sm font-medium">
              Description
              <textarea rows={3} value={pages[page.key].description} onChange={(event) => setPage(page.key, { description: event.target.value })} className={inputClassName} />
            </label>
            <label className="text-sm font-medium">
              Keywords через запятую
              <KeywordsInput value={pages[page.key].keywords} onChange={(keywords) => setPage(page.key, { keywords })} />
            </label>
          </fieldset>
        ))}

        {settings.message && <p className="text-sm text-slate-600 sm:col-span-2" aria-live="polite">{settings.message}</p>}
        <div className="sm:col-span-2">
          <button disabled={settings.isSaving || settings.isLoading || settings.isUploading} className="rounded-lg bg-[#009d0a] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-50">
            {settings.isSaving ? "Сохраняем…" : "Сохранить"}
          </button>
        </div>
      </form>
    </section>
  );
}
