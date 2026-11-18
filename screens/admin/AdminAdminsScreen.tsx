"use client";

import { FormEvent } from "react";
import AdminPageHeader from "./components/AdminPageHeader";
import AdminSettingsNav from "./components/AdminSettingsNav";
import AdminTable from "./components/AdminTable";
import { type AdminAccount, useAdminAdmins } from "./hooks/useAdminAdmins";

const inputClassName = "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#009d0a]";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function AdminAdminsScreen() {
  const admins = useAdminAdmins();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void admins.add();
  };

  const toggle = (admin: AdminAccount) => {
    if (admin.status === "BLOCKED") return void admins.setStatus(admin, "ACTIVE");
    if (window.confirm(`Отключить доступ для ${admin.email}? Администратор сразу выйдет из админки.`)) void admins.setStatus(admin, "BLOCKED");
  };

  return (
    <section className="max-w-5xl">
      <AdminPageHeader eyebrow="Системные параметры" title="Администраторы" />
      <AdminSettingsNav />

      <form onSubmit={submit} className="mb-6 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold">Добавить администратора</h2>
        <p className="mt-1 text-sm text-slate-500">
          Пароль не нужен: администратор входит на странице /login по одноразовому коду, который приходит на этот email. Мы отправим ему приглашение.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <label className="min-w-[260px] flex-1">
            <span className="sr-only">Email администратора</span>
            <input type="email" required maxLength={254} placeholder="name@example.com" value={admins.email} onChange={(event) => admins.setEmail(event.target.value)} className={inputClassName} />
          </label>
          <button disabled={admins.isAdding} className="rounded-lg bg-[#009d0a] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-50">
            {admins.isAdding ? "Добавляем…" : "Добавить"}
          </button>
        </div>
      </form>

      {admins.error && <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{admins.error}</p>}
      {admins.notice && <p role="status" className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">{admins.notice}</p>}

      <AdminTable headers={["Email", "Статус", "Добавлен", "Последний вход", ""]} isLoading={admins.isLoading} isEmpty={!admins.isLoading && admins.admins.length === 0} emptyMessage="Администраторов пока нет.">
        {admins.admins.map((admin) => (
          <tr key={admin.id} className="border-b border-slate-100 last:border-0">
            <td className="px-4 py-3 font-medium">
              {admin.email}
              {admin.isCurrentUser && <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-normal whitespace-nowrap text-slate-500">это вы</span>}
            </td>
            <td className="px-4 py-3">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${admin.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                {admin.status === "ACTIVE" ? "Активен" : "Доступ отключён"}
              </span>
            </td>
            <td className="px-4 py-3 text-slate-600">{formatDate(admin.createdAt)}</td>
            <td className="px-4 py-3 text-slate-600">{formatDate(admin.lastLoginAt)}</td>
            <td className="px-4 py-3 text-right whitespace-nowrap">
              {!admin.isCurrentUser && (
                <button
                  type="button"
                  disabled={admins.updatingId === admin.id}
                  onClick={() => toggle(admin)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${admin.status === "ACTIVE" ? "border-red-200 text-red-700 hover:bg-red-50" : "border-slate-300 text-slate-700 hover:border-[#009d0a]"}`}
                >
                  {admin.status === "ACTIVE" ? "Отключить доступ" : "Восстановить доступ"}
                </button>
              )}
            </td>
          </tr>
        ))}
      </AdminTable>
    </section>
  );
}
