"use client";

import { FormEvent } from "react";
import AdminPageHeader from "./components/AdminPageHeader";
import { useAdminSettings } from "./hooks/useAdminSettings";

export default function AdminSettingsScreen() {
  const { values, setValue, saveSettings, isSaving, message } = useAdminSettings();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void saveSettings();
  };

  return (
    <section className="max-w-4xl">
      <AdminPageHeader eyebrow="Системные параметры" title="Настройки" />
      <form onSubmit={submit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        {Object.entries(values).map(([key, value]) => (
          <label key={key} className="block text-sm font-medium">
            {key}
            <textarea value={value} onChange={(event) => setValue(key, event.target.value)} rows={6} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs outline-none focus:border-[#009d0a]" />
          </label>
        ))}
        {message && <p className="text-sm text-slate-600" aria-live="polite">{message}</p>}
        <button disabled={isSaving} className="rounded-lg bg-[#009d0a] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-50">
          {isSaving ? "Сохраняем…" : "Сохранить"}
        </button>
      </form>
    </section>
  );
}
