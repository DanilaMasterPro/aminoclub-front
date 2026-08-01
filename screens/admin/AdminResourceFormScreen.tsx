"use client";

import api from "@/api/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { resourceConfigs, type ResourceField } from "./resource-config";

type Values = Record<string, unknown>;

export default function AdminResourceFormScreen({ resource, id }: { resource: string; id?: string }) {
  const config = resourceConfigs[resource];
  const router = useRouter();
  const [values, setValues] = useState<Values>({ isActive: true, status: "DRAFT", type: "PERCENT" });
  const [categories, setCategories] = useState<Array<{ id: string; title: string }>>([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (resource === "products") api.get<Array<{ id: string; title: string }>>("/admin/categories").then(({ data }) => setCategories(data));
  }, [resource]);
  useEffect(() => {
    if (!id || !config) return;
    api.get<Values>(`${config.endpoint}/${id}`).then(({ data }) => setValues(data)).catch(() => setError("Не удалось загрузить запись")).finally(() => setLoading(false));
  }, [config, id]);

  const fields = useMemo(() => (config?.fields ?? []).filter((field) => !(resource === "products" && id && field.name === "stockQuantity")), [config, id, resource]);
  if (!config) return <p>Раздел не найден.</p>;
  if (!config.fields) return <p>Редактирование этого типа выполняется из списка.</p>;

  function set(name: string, value: unknown) { setValues((current) => ({ ...current, [name]: value })); }

  async function upload(field: ResourceField, file: File) {
    const body = new FormData(); body.append("file", file);
    const { data } = await api.post<{ url: string }>("/admin/media", body);
    if (field.type === "file-list") {
      const current = Array.isArray(values[field.name]) ? values[field.name] as Array<{ url: string }> : [];
      set(field.name, [...current, { url: data.url, sortOrder: current.length }]);
    } else if (field.type === "certificate-list") {
      const current = Array.isArray(values[field.name]) ? values[field.name] as Array<{ title: string; fileUrl: string }> : [];
      set(field.name, [...current, { title: file.name, fileUrl: data.url, sortOrder: current.length }]);
    } else set(field.name, data.url);
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError("");
    const payload: Values = {};
    for (const field of fields) {
      const value = values[field.name];
      if (value === "" || value === undefined) continue;
      payload[field.name] = field.type === "number"
        ? Number(value)
        : field.type === "tags" && typeof value === "string"
          ? value.split(",").map((item) => item.trim()).filter(Boolean)
          : value;
    }
    try {
      if (id) await api.patch(`${config.endpoint}/${id}`, payload);
      else await api.post(config.endpoint, payload);
      router.push(`/admin/${resource}`);
      router.refresh();
    } catch (caught) {
      const message = axios.isAxiosError(caught) ? caught.response?.data?.message : null;
      setError(Array.isArray(message) ? message.join(". ") : message ?? "Не удалось сохранить запись");
    } finally { setSaving(false); }
  }

  return (
    <section className="max-w-4xl" data-testid={`admin-${resource}-form`}>
      <Link href={`/admin/${resource}`} className="text-sm text-slate-500 hover:text-slate-900">← Назад к списку</Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">{id ? `Редактировать ${config.singular}` : `Добавить ${config.singular}`}</h1>
      {loading ? <p className="mt-8 text-slate-500">Загрузка…</p> : <form onSubmit={submit} className="mt-7 grid gap-5 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:p-7">
        {fields.map((field) => {
          const value = values[field.name];
          const common = "mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#009d0a]";
          if (field.type === "checkbox") return <label key={field.name} className="flex items-center gap-3 text-sm font-medium sm:col-span-2"><input type="checkbox" checked={Boolean(value)} onChange={(e) => set(field.name, e.target.checked)} className="size-4 accent-[#009d0a]" />{field.label}</label>;
          if (field.type === "file-list" || field.type === "certificate-list") return <div key={field.name} className="sm:col-span-2"><span className="text-sm font-medium">{field.label}</span><input type="file" accept="image/*,.pdf" multiple onChange={(e) => [...(e.target.files ?? [])].forEach((file) => void upload(field, file))} className={common} /><div className="mt-2 flex flex-wrap gap-2">{(Array.isArray(value) ? value : []).map((item: { url?: string; fileUrl?: string; title?: string }, index: number) => <span key={`${item.url ?? item.fileUrl}-${index}`} className="rounded bg-slate-100 px-2 py-1 text-xs">{item.title ?? item.url ?? item.fileUrl}</span>)}</div></div>;
          const isImage = /image|cover/i.test(field.name);
          return <label key={field.name} className={`block text-sm font-medium ${field.type === "textarea" ? "sm:col-span-2" : ""}`}>{field.label}
            {field.name === "categoryId" ? <select required={field.required} value={String(value ?? "")} onChange={(e) => set(field.name, e.target.value)} className={common}><option value="">Выберите категорию</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}</select>
            : field.type === "textarea" ? <textarea required={field.required} rows={field.name === "content" || field.name === "description" ? 10 : 4} value={String(value ?? "")} onChange={(e) => set(field.name, e.target.value)} className={common} />
            : field.type === "select" ? <select required={field.required} value={String(value ?? "")} onChange={(e) => set(field.name, e.target.value)} className={common}>{field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
            : <><input required={field.required} type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"} step={field.type === "number" ? "any" : undefined} value={field.type === "tags" && Array.isArray(value) ? value.join(", ") : String(value ?? "")} onChange={(e) => set(field.name, e.target.value)} className={common} />{isImage && <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && void upload(field, e.target.files[0])} className="mt-2 block w-full text-xs text-slate-500" />}</>}
          </label>;
        })}
        {error && <p role="alert" className="text-sm text-red-600 sm:col-span-2">{error}</p>}
        <div className="flex gap-3 sm:col-span-2"><button data-testid="resource-save" disabled={saving} className="rounded-lg bg-[#009d0a] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Сохраняем…" : "Сохранить"}</button><Link href={`/admin/${resource}`} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium">Отмена</Link></div>
      </form>}
    </section>
  );
}
