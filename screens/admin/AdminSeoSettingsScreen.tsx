"use client";

import { FormEvent } from "react";
import AdminImageDropzone from "./components/AdminImageDropzone";
import AdminPageHeader from "./components/AdminPageHeader";
import AdminSettingsNav from "./components/AdminSettingsNav";
import { useAdminSettingSection } from "./hooks/useAdminSettings";

const inputClassName = "mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#009d0a]";

export default function AdminSeoSettingsScreen() {
  const settings = useAdminSettingSection("seo", { title: "", description: "", keywords: [], imageUrl: "" });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void settings.save();
  };

  return (
    <section className="max-w-5xl">
      <AdminPageHeader eyebrow="Поисковая оптимизация" title="SEO шаблон" />
      <AdminSettingsNav />
      <form onSubmit={submit} className="grid gap-5 rounded-xl border border-slate-200 bg-white p-6 sm:grid-cols-2">
        <label className="text-sm font-medium sm:col-span-2">
          Title
          <input value={settings.value.title} onChange={(event) => settings.setValue((current) => ({ ...current, title: event.target.value }))} className={inputClassName} />
        </label>
        <label className="text-sm font-medium sm:col-span-2">
          Description
          <textarea rows={5} value={settings.value.description} onChange={(event) => settings.setValue((current) => ({ ...current, description: event.target.value }))} className={inputClassName} />
        </label>
        <label className="text-sm font-medium sm:col-span-2">
          Keywords
          <input value={settings.value.keywords.join(", ")} onChange={(event) => settings.setValue((current) => ({ ...current, keywords: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) }))} placeholder="протеин, спортивное питание" className={inputClassName} />
        </label>
        <AdminImageDropzone
          fieldName="seo-image"
          label="Изображение Open Graph"
          images={settings.value.imageUrl ? [{ url: settings.value.imageUrl, title: "Open Graph" }] : []}
          isUploading={settings.isUploading}
          onUpload={async (file) => {
            const imageUrl = await settings.uploadImage(file);
            settings.setValue((current) => ({ ...current, imageUrl }));
          }}
          onRemove={() => settings.setValue((current) => ({ ...current, imageUrl: "" }))}
        />
        <p className="text-sm text-slate-500 sm:col-span-2">Шаблон применяется, если у конкретной страницы не заполнены собственные SEO-поля.</p>
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
