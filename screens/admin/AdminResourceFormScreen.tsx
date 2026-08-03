"use client";

import { FormEvent } from "react";
import Link from "next/link";
import AdminPageHeader from "./components/AdminPageHeader";
import AdminResourceField from "./components/AdminResourceField";
import { useAdminResourceForm } from "./hooks/useAdminResourceForm";

export default function AdminResourceFormScreen({ resource, id }: { resource: string; id?: string }) {
  const {
    config,
    values,
    categories,
    fields,
    isLoading,
    isSaving,
    isUploading,
    error,
    setValue,
    upload,
    removeFile,
    save,
  } = useAdminResourceForm(resource, id);

  if (!config) return <p>Раздел не найден.</p>;
  if (!config.fields) return <p>Редактирование этого типа выполняется из списка.</p>;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void save();
  };

  return (
    <section className="max-w-4xl" data-testid={`admin-${resource}-form`}>
      <AdminPageHeader
        backHref={`/admin/${resource}`}
        title={id ? `Редактировать ${config.singular}` : `Добавить ${config.singular}`}
      />
      {isLoading ? (
        <p className="mt-8 text-slate-500">Загрузка…</p>
      ) : (
        <form onSubmit={submit} className="grid gap-5 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:p-7">
          {fields.map((field) => (
            <AdminResourceField
              key={field.name}
              field={field}
              value={values[field.name]}
              categories={categories}
              onChange={(value) => setValue(field.name, value)}
              onUpload={(file) => upload(field, file)}
              onRemove={(index) => removeFile(field, index)}
              isUploading={isUploading}
            />
          ))}
          {error && <p role="alert" className="text-sm text-red-600 sm:col-span-2">{error}</p>}
          <div className="flex gap-3 sm:col-span-2">
            <button data-testid="resource-save" disabled={isSaving || isUploading} className="rounded-lg bg-[#009d0a] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
              {isUploading ? "Загружаем изображения…" : isSaving ? "Сохраняем…" : "Сохранить"}
            </button>
            <Link href={`/admin/${resource}`} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium">Отмена</Link>
          </div>
        </form>
      )}
    </section>
  );
}
