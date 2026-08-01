"use client";

import api from "@/api/client";
import type { Paginated } from "@/api/types";
import axios from "axios";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { resourceConfigs } from "./resource-config";

type Row = Record<string, unknown> & { id: string; status?: string };

function nested(row: Row, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined, row);
}

function format(value: unknown) {
  if (typeof value === "boolean") return value ? "Да" : "Нет";
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" && /^\d{4}-\d\d-\d\dT/.test(value)) return new Date(value).toLocaleDateString("ru-RU");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function AdminResourceListScreen({ resource }: { resource: string }) {
  const config = resourceConfigs[resource];
  const [items, setItems] = useState<Row[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!config) return;
    try {
      const { data } = await api.get<Paginated<Row> | Row[]>(config.endpoint, { params: { page, limit: 20, search: search || undefined, status: status || undefined } });
      setItems(Array.isArray(data) ? data : data.items);
      setPages(Array.isArray(data) ? 1 : data.pages);
    } catch (caught) {
      setError(axios.isAxiosError(caught) ? caught.response?.data?.message ?? "Не удалось загрузить данные" : "Не удалось загрузить данные");
    } finally { setLoading(false); }
  }, [config, page, search, status]);

  useEffect(() => {
    if (!config) return;
    let active = true;
    api.get<Paginated<Row> | Row[]>(config.endpoint, {
      params: { page, limit: 20, search: search || undefined, status: status || undefined },
    }).then(({ data }) => {
      if (!active) return;
      setItems(Array.isArray(data) ? data : data.items);
      setPages(Array.isArray(data) ? 1 : data.pages);
    }).catch((caught) => {
      if (active) setError(axios.isAxiosError(caught) ? caught.response?.data?.message ?? "Не удалось загрузить данные" : "Не удалось загрузить данные");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [config, page, search, status]);
  if (!config) return <p>Раздел не найден.</p>;

  async function action(row: Row, value: string) {
    if (!value) return;
    if (resource === "trainer-applications") {
      await api.patch(`${config.endpoint}/${row.id}/${value}`, value === "approve" ? { commissionRate: 10, promoDiscount: 10 } : {});
    } else if (resource === "trainers") {
      await api.patch(`${config.endpoint}/${row.id}/block`);
    } else if (resource === "orders" || resource === "payouts") {
      await api.patch(`${config.endpoint}/${row.id}/status`, { status: value });
    }
    await load();
  }

  async function remove(row: Row) {
    if (!window.confirm(`Удалить ${config.singular}?`)) return;
    try { await api.delete(`${config.endpoint}/${row.id}`); await load(); }
    catch (caught) { setError(axios.isAxiosError(caught) ? caught.response?.data?.message ?? "Не удалось удалить запись" : "Не удалось удалить запись"); }
  }

  function submitSearch(event: FormEvent) { event.preventDefault(); setLoading(true); setPage(1); void load(); }

  return (
    <section data-testid={`admin-${resource}`}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm text-slate-500">Управление</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">{config.title}</h1></div>
        {config.createable && <Link href={`/admin/${resource}/new`} className="rounded-lg bg-[#009d0a] px-4 py-2.5 text-sm font-semibold text-white">Добавить</Link>}
      </div>
      <form onSubmit={submitSearch} className="mb-4 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4">
        {config.searchable && <input aria-label="Поиск" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск…" className="min-w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#009d0a]" />}
        {config.statusFilter && <select aria-label="Статус" value={status} onChange={(e) => { setLoading(true); setStatus(e.target.value); setPage(1); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm"><option value="">Все статусы</option>{config.statusFilter.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>}
        {(config.searchable || config.statusFilter) && <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium">Применить</button>}
      </form>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{config.columns.map((column) => <th key={column.key} className="border-b border-slate-200 px-4 py-3 font-semibold">{column.label}</th>)}<th className="border-b border-slate-200 px-4 py-3">Действия</th></tr></thead>
          <tbody>{!loading && items.map((row) => <tr key={row.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">{config.columns.map((column) => <td key={column.key} className="max-w-64 truncate px-4 py-3">{format(nested(row, column.key))}</td>)}<td className="px-4 py-3">
            {config.editable && <Link href={`/admin/${resource}/${row.id}`} className="mr-3 font-medium text-[#008609]">Открыть</Link>}
            {config.createable && !["trainers", "orders"].includes(resource) && <button onClick={() => void remove(row)} className="mr-3 text-red-600">Удалить</button>}
            {resource === "trainer-applications" && row.status === "PENDING" && <select aria-label="Обработать заявку" defaultValue="" onChange={(e) => void action(row, e.target.value)} className="rounded border border-slate-300 px-2 py-1"><option value="" disabled>Решение</option><option value="approve">Одобрить</option><option value="reject">Отклонить</option></select>}
            {resource === "trainers" && row.status !== "BLOCKED" && <button onClick={() => void action(row, "block")} className="text-red-600">Блокировать</button>}
            {(resource === "orders" || resource === "payouts") && <select aria-label="Изменить статус" value={row.status} onChange={(e) => void action(row, e.target.value)} className="rounded border border-slate-300 px-2 py-1"><option value={row.status}>{row.status}</option>{config.statusFilter?.filter((option) => option.value !== row.status).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>}
          </td></tr>)}</tbody>
        </table>
        {loading && <p className="p-8 text-center text-sm text-slate-500">Загрузка…</p>}
        {!loading && !items.length && <p className="p-8 text-center text-sm text-slate-500">Записей пока нет.</p>}
      </div>
      {pages > 1 && <div className="mt-4 flex items-center justify-end gap-3 text-sm"><button disabled={page === 1} onClick={() => { setLoading(true); setPage((value) => value - 1); }} className="rounded border border-slate-300 px-3 py-2 disabled:opacity-40">Назад</button><span>{page} / {pages}</span><button disabled={page === pages} onClick={() => { setLoading(true); setPage((value) => value + 1); }} className="rounded border border-slate-300 px-3 py-2 disabled:opacity-40">Далее</button></div>}
    </section>
  );
}
