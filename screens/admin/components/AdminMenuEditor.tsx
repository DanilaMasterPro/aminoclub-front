"use client";

import type { CmsPage, MenuItemSetting } from "@/api/types";

type AdminMenuEditorProps = {
  title: string;
  description: string;
  items: MenuItemSetting[];
  pages: CmsPage[];
  showGroups?: boolean;
  onChange: (items: MenuItemSetting[]) => void;
};

const inputClassName = "mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#009d0a]";

export default function AdminMenuEditor({ title, description, items, pages, showGroups = false, onChange }: AdminMenuEditorProps) {
  const updateItem = (id: string, patch: Partial<MenuItemSetting>) => {
    onChange(items.map((item) => item.id === id ? { ...item, ...patch } : item));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const nextItems = [...items];
    [nextItems[index], nextItems[targetIndex]] = [nextItems[targetIndex], nextItems[index]];
    onChange(nextItems);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => onChange([...items, { id: crypto.randomUUID(), label: "", href: "" }])}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:border-[#009d0a]"
        >
          Добавить пункт
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => {
          const selectedPage = pages.find((page) => page.id === item.pageId);
          return (
            <div key={item.id} className="rounded-xl border border-slate-200 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <strong className="text-sm">Пункт {index + 1}</strong>
                <div className="flex items-center gap-2">
                  <button type="button" disabled={index === 0} onClick={() => moveItem(index, -1)} className="rounded border border-slate-300 px-2.5 py-1 text-sm disabled:opacity-30" aria-label="Переместить выше">↑</button>
                  <button type="button" disabled={index === items.length - 1} onClick={() => moveItem(index, 1)} className="rounded border border-slate-300 px-2.5 py-1 text-sm disabled:opacity-30" aria-label="Переместить ниже">↓</button>
                  <button type="button" onClick={() => onChange(items.filter((current) => current.id !== item.id))} className="ml-2 text-sm text-red-600">Удалить</button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  Текст ссылки
                  <input required value={item.label} onChange={(event) => updateItem(item.id, { label: event.target.value })} className={inputClassName} />
                </label>
                <label className="text-sm font-medium">
                  Тип ссылки
                  <select
                    value={item.pageId ? "page" : "custom"}
                    onChange={(event) => {
                      const page = pages[0];
                      updateItem(item.id, event.target.value === "page" && page
                        ? { pageId: page.id, href: `/${page.slug}`, label: item.label || page.title }
                        : { pageId: undefined });
                    }}
                    className={inputClassName}
                  >
                    <option value="custom">Произвольная ссылка</option>
                    <option value="page" disabled={pages.length === 0}>Страница из базы</option>
                  </select>
                </label>

                {item.pageId ? (
                  <label className="text-sm font-medium sm:col-span-2">
                    Страница
                    <select
                      required
                      value={item.pageId}
                      onChange={(event) => {
                        const page = pages.find((current) => current.id === event.target.value);
                        if (page) updateItem(item.id, { pageId: page.id, href: `/${page.slug}`, label: item.label || page.title });
                      }}
                      className={inputClassName}
                    >
                      {pages.map((page) => <option key={page.id} value={page.id}>{page.title} ({page.status})</option>)}
                    </select>
                    {selectedPage && selectedPage.status !== "PUBLISHED" && <span className="mt-1 block text-xs text-amber-700">Страница пока не опубликована.</span>}
                  </label>
                ) : (
                  <label className="text-sm font-medium sm:col-span-2">
                    Ссылка
                    <input required value={item.href} onChange={(event) => updateItem(item.id, { href: event.target.value })} placeholder="/affiliate или https://example.com" className={inputClassName} />
                  </label>
                )}

                {showGroups && (
                  <label className="text-sm font-medium sm:col-span-2">
                    Группа в футере
                    <input value={item.group ?? ""} onChange={(event) => updateItem(item.id, { group: event.target.value })} placeholder="Например: Документы" className={inputClassName} />
                  </label>
                )}
              </div>
            </div>
          );
        })}
        {items.length === 0 && <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">В этом меню пока нет пунктов.</p>}
      </div>
    </div>
  );
}
