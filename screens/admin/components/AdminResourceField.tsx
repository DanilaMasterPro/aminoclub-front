"use client";

import type { ResourceField } from "../resource-config";
import type { AdminCategoryOption } from "../hooks/useAdminResourceForm";

type AttachedFile = { url?: string; fileUrl?: string; title?: string };

type AdminResourceFieldProps = {
  field: ResourceField;
  value: unknown;
  categories: AdminCategoryOption[];
  onChange: (value: unknown) => void;
  onUpload: (file: File) => Promise<void>;
};

const inputClassName = "mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#009d0a]";

export default function AdminResourceField({ field, value, categories, onChange, onUpload }: AdminResourceFieldProps) {
  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-3 text-sm font-medium sm:col-span-2">
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} className="size-4 accent-[#009d0a]" />
        {field.label}
      </label>
    );
  }

  if (field.type === "file-list" || field.type === "certificate-list") {
    const files = Array.isArray(value) ? value as AttachedFile[] : [];
    return (
      <div className="sm:col-span-2">
        <span className="text-sm font-medium">{field.label}</span>
        <input
          type="file"
          accept={field.type === "file-list" ? "image/*" : "image/*,.pdf"}
          multiple
          onChange={(event) => void Promise.all([...(event.target.files ?? [])].map(onUpload))}
          className={inputClassName}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <span key={`${file.url ?? file.fileUrl}-${index}`} className="rounded bg-slate-100 px-2 py-1 text-xs">
              {file.title ?? file.url ?? file.fileUrl}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const isImage = /image|cover/i.test(field.name);
  const wide = field.type === "textarea" ? "sm:col-span-2" : "";

  return (
    <label className={`block text-sm font-medium ${wide}`}>
      {field.label}
      {field.name === "categoryId" ? (
        <select required={field.required} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} className={inputClassName}>
          <option value="">Выберите категорию</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}
        </select>
      ) : field.type === "textarea" ? (
        <textarea required={field.required} rows={field.name === "content" || field.name === "description" ? 10 : 4} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} className={inputClassName} />
      ) : field.type === "select" ? (
        <select required={field.required} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} className={inputClassName}>
          {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      ) : (
        <>
          <input
            required={field.required}
            type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
            step={field.type === "number" ? "any" : undefined}
            value={field.type === "tags" && Array.isArray(value) ? value.join(", ") : String(value ?? "")}
            onChange={(event) => onChange(event.target.value)}
            className={inputClassName}
          />
          {isImage && <input type="file" accept="image/*" onChange={(event) => event.target.files?.[0] && void onUpload(event.target.files[0])} className="mt-2 block w-full text-xs text-slate-500" />}
        </>
      )}
    </label>
  );
}
