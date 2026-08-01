"use client";

import Link from "next/link";
import { FormEvent } from "react";
import AdminPageHeader from "./components/AdminPageHeader";
import AdminTable from "./components/AdminTable";
import { useAdminResourceList, type AdminResourceRow } from "./hooks/useAdminResourceList";
import { resourceConfigs } from "./resource-config";

function getNestedValue(row: AdminResourceRow, path: string): unknown {
  return path.split(".").reduce<unknown>(
    (value, key) => value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined,
    row,
  );
}

function formatValue(value: unknown) {
  if (typeof value === "boolean") return value ? "Да" : "Нет";
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" && /^\d{4}-\d\d-\d\dT/.test(value)) return new Date(value).toLocaleDateString("ru-RU");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function AdminResourceListScreen({ resource }: { resource: string }) {
  const config = resourceConfigs[resource];
  const {
    items, page, pages, searchDraft, status, isLoading, error,
    setSearchDraft, applySearch, setStatus, goToPage, performAction, remove,
  } = useAdminResourceList(resource, config);

  if (!config) return <p>Раздел не найден.</p>;

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    applySearch();
  };

  const confirmRemove = (row: AdminResourceRow) => {
    if (window.confirm(`Удалить ${config.singular}?`)) void remove(row);
  };

  const createAction = config.createable ? (
    <Link href={`/admin/${resource}/new`} className="rounded-lg bg-[#009d0a] px-4 py-2.5 text-sm font-semibold text-white">Добавить</Link>
  ) : undefined;

  return (
    <section data-testid={`admin-${resource}`}>
      <AdminPageHeader eyebrow="Управление" title={config.title} action={createAction} />
      <form onSubmit={submitSearch} className="mb-4 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4">
        {config.searchable && (
          <input aria-label="Поиск" value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} placeholder="Поиск…" className="min-w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#009d0a]" />
        )}
        {config.statusFilter && (
          <select aria-label="Статус" value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="">Все статусы</option>
            {config.statusFilter.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        )}
        {(config.searchable || config.statusFilter) && <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium">Применить</button>}
      </form>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <AdminTable
        headers={[...config.columns.map((column) => column.label), "Действия"]}
        isLoading={isLoading}
        isEmpty={!items.length}
      >
        {!isLoading && items.map((row) => (
          <tr key={row.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
            {config.columns.map((column) => (
              <td key={column.key} className="max-w-64 truncate px-4 py-3">{formatValue(getNestedValue(row, column.key))}</td>
            ))}
            <td className="px-4 py-3">
              {(config.editable || resource === "trainer-applications") && <Link href={`/admin/${resource}/${row.id}`} className="mr-3 font-medium text-[#008609]">Открыть</Link>}
              {config.createable && !["trainers", "orders"].includes(resource) && <button type="button" onClick={() => confirmRemove(row)} className="mr-3 text-red-600">Удалить</button>}
              {resource === "trainers" && row.status !== "BLOCKED" && <button type="button" onClick={() => void performAction(row, "block")} className="text-red-600">Блокировать</button>}
              {(resource === "orders" || resource === "payouts") && (
                <select aria-label="Изменить статус" value={row.status ?? ""} onChange={(event) => void performAction(row, event.target.value)} className="rounded border border-slate-300 px-2 py-1">
                  <option value={row.status}>{row.status}</option>
                  {config.statusFilter?.filter((option) => option.value !== row.status).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              )}
            </td>
          </tr>
        ))}
      </AdminTable>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-3 text-sm">
          <button type="button" disabled={page === 1} onClick={() => goToPage(page - 1)} className="rounded border border-slate-300 px-3 py-2 disabled:opacity-40">Назад</button>
          <span>{page} / {pages}</span>
          <button type="button" disabled={page === pages} onClick={() => goToPage(page + 1)} className="rounded border border-slate-300 px-3 py-2 disabled:opacity-40">Далее</button>
        </div>
      )}
    </section>
  );
}
