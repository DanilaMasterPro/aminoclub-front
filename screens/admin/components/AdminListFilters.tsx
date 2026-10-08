"use client";

import { FormEvent } from "react";

type StatusOption = { label: string; value: string };

type AdminListFiltersProps = {
  search?: { value: string; onChange: (value: string) => void };
  status?: { value: string; options: StatusOption[]; onChange: (value: string) => void };
  onSubmit: () => void;
};

/** Search + status filter bar above admin tables. Renders nothing when the list has no filters. */
export default function AdminListFilters({ search, status, onSubmit }: AdminListFiltersProps) {
  if (!search && !status) return null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={submit} className="mb-4 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4">
      {search && (
        <input type="search" aria-label="Поиск" value={search.value} onChange={(event) => search.onChange(event.target.value)} placeholder="Поиск…" className="min-w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#009d0a]" />
      )}
      {status && (
        <select aria-label="Статус" value={status.value} onChange={(event) => status.onChange(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="">Все статусы</option>
          {status.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      )}
      <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium">Применить</button>
    </form>
  );
}
