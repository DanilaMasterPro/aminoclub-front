"use client";

import type { SocialLinkSetting } from "@/api/types";
import { FormEvent } from "react";
import AdminImageDropzone from "./components/AdminImageDropzone";
import AdminPageHeader from "./components/AdminPageHeader";
import AdminSettingsNav from "./components/AdminSettingsNav";
import { useAdminSettingSection } from "./hooks/useAdminSettings";

const inputClassName = "mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#009d0a]";

export default function AdminSettingsScreen() {
  const settings = useAdminSettingSection("general", { phone: "", email: "", logoUrl: "", socialLinks: [] });

  const updateSocialLink = (id: string, patch: Partial<SocialLinkSetting>) => {
    settings.setValue((current) => ({
      ...current,
      socialLinks: current.socialLinks.map((link) => link.id === id ? { ...link, ...patch } : link),
    }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void settings.save();
  };

  return (
    <section className="max-w-5xl">
      <AdminPageHeader eyebrow="Системные параметры" title="Общие настройки" />
      <AdminSettingsNav />
      <form onSubmit={submit} className="space-y-6">
        <div className="grid gap-5 rounded-xl border border-slate-200 bg-white p-6 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Номер телефона
            <input type="tel" value={settings.value.phone} onChange={(event) => settings.setValue((current) => ({ ...current, phone: event.target.value }))} className={inputClassName} />
          </label>
          <label className="text-sm font-medium">
            Email
            <input type="email" value={settings.value.email} onChange={(event) => settings.setValue((current) => ({ ...current, email: event.target.value }))} className={inputClassName} />
          </label>
          <AdminImageDropzone
            fieldName="site-logo"
            label="Логотип"
            images={settings.value.logoUrl ? [{ url: settings.value.logoUrl, title: "Логотип сайта" }] : []}
            isUploading={settings.isUploading}
            onUpload={async (file) => {
              const logoUrl = await settings.uploadImage(file);
              settings.setValue((current) => ({ ...current, logoUrl }));
            }}
            onRemove={() => settings.setValue((current) => ({ ...current, logoUrl: "" }))}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Социальные сети</h2>
              <p className="mt-1 text-sm text-slate-500">Ссылки и иконки отображаются в футере в заданном порядке.</p>
            </div>
            <button
              type="button"
              onClick={() => settings.setValue((current) => ({
                ...current,
                socialLinks: [...current.socialLinks, { id: crypto.randomUUID(), label: "", url: "", iconUrl: "" }],
              }))}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:border-[#009d0a]"
            >
              Добавить
            </button>
          </div>

          <div className="space-y-5">
            {settings.value.socialLinks.map((link, index) => (
              <div key={link.id} className="rounded-xl border border-slate-200 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <strong className="text-sm">Социальная сеть {index + 1}</strong>
                  <button type="button" onClick={() => settings.setValue((current) => ({ ...current, socialLinks: current.socialLinks.filter((item) => item.id !== link.id) }))} className="text-sm text-red-600">
                    Удалить
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium">
                    Название
                    <input value={link.label} onChange={(event) => updateSocialLink(link.id, { label: event.target.value })} className={inputClassName} />
                  </label>
                  <label className="text-sm font-medium">
                    Ссылка
                    <input value={link.url} onChange={(event) => updateSocialLink(link.id, { url: event.target.value })} placeholder="https://" className={inputClassName} />
                  </label>
                  <AdminImageDropzone
                    fieldName={`social-${link.id}`}
                    label="Иконка"
                    images={link.iconUrl ? [{ url: link.iconUrl, title: link.label || "Иконка" }] : []}
                    isUploading={settings.isUploading}
                    onUpload={async (file) => updateSocialLink(link.id, { iconUrl: await settings.uploadImage(file) })}
                    onRemove={() => updateSocialLink(link.id, { iconUrl: "" })}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {settings.message && <p className="text-sm text-slate-600" aria-live="polite">{settings.message}</p>}
        <button disabled={settings.isSaving || settings.isLoading || settings.isUploading} className="rounded-lg bg-[#009d0a] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-50">
          {settings.isSaving ? "Сохраняем…" : "Сохранить"}
        </button>
      </form>
    </section>
  );
}
