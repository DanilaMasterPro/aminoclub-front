"use client";

import api from "@/api/client";
import { FormEvent, useEffect, useState } from "react";

const defaults: Record<string, string> = { shop: "", notifications: "", seo: "" };

export default function AdminSettingsScreen() {
  const [values, setValues] = useState(defaults);
  const [message, setMessage] = useState("");
  useEffect(() => { api.get<Array<{ key: string; value: object }>>("/admin/settings").then(({ data }) => setValues((current) => ({ ...current, ...Object.fromEntries(data.map((item) => [item.key, JSON.stringify(item.value, null, 2)])) }))); }, []);
  async function save(event: FormEvent) {
    event.preventDefault(); setMessage("");
    try { await Promise.all(Object.entries(values).map(([key, raw]) => api.patch(`/admin/settings/${key}`, { value: raw.trim() ? JSON.parse(raw) : {} }))); setMessage("Настройки сохранены"); }
    catch { setMessage("Проверьте JSON в полях"); }
  }
  return <section className="max-w-4xl"><p className="text-sm text-slate-500">Системные параметры</p><h1 className="mt-1 text-3xl font-semibold">Настройки</h1><form onSubmit={save} className="mt-7 space-y-5 rounded-xl border border-slate-200 bg-white p-6">{Object.entries(values).map(([key, value]) => <label key={key} className="block text-sm font-medium">{key}<textarea value={value} onChange={(e) => setValues((current) => ({ ...current, [key]: e.target.value }))} rows={6} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs outline-none focus:border-[#009d0a]" /></label>)}{message && <p className="text-sm text-slate-600">{message}</p>}<button className="rounded-lg bg-[#009d0a] px-5 py-2.5 text-sm font-semibold text-white">Сохранить</button></form></section>;
}
