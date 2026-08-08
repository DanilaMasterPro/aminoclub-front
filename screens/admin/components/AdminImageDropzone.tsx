"use client";

import { resolveMediaUrl } from "@/api/media";
import { useId, useState } from "react";

type ImagePreview = { url: string; title?: string };

type AdminImageDropzoneProps = {
  fieldName: string;
  label: string;
  images: ImagePreview[];
  multiple?: boolean;
  required?: boolean;
  isUploading?: boolean;
  onUpload: (file: File) => Promise<void>;
  onRemove: (index: number) => void;
};

export default function AdminImageDropzone({
  fieldName,
  label,
  images,
  multiple = false,
  required = false,
  isUploading = false,
  onUpload,
  onRemove,
}: AdminImageDropzoneProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  const uploadFiles = (files: FileList | File[]) => {
    const selected = [...files].filter((file) => file.type.startsWith("image/"));
    const uploads = multiple ? selected : selected.slice(0, 1);
    void Promise.all(uploads.map(onUpload));
  };

  return (
    <div className="sm:col-span-2" data-testid={`image-dropzone-${fieldName}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{label}{required && <span className="text-red-600"> *</span>}</span>
        {multiple && <span className="text-xs text-slate-500">Можно добавить несколько</span>}
      </div>
      <label
        htmlFor={inputId}
        onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
        onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
        onDragLeave={(event) => { event.preventDefault(); setIsDragging(false); }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          uploadFiles(event.dataTransfer.files);
        }}
        className={`mt-2 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-7 text-center transition ${isDragging ? "border-[#009d0a] bg-green-50" : "border-slate-300 bg-slate-50 hover:border-[#009d0a] hover:bg-green-50/50"}`}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-8 text-[#009d0a]">
          <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14.5v3A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="mt-3 text-sm font-semibold text-slate-800">
          {isUploading ? "Оптимизируем и загружаем…" : "Перетащите изображение сюда"}
        </span>
        <span className="mt-1 text-xs text-slate-500">или нажмите для выбора · JPG, PNG, WebP, AVIF, GIF, SVG · до 10 МБ</span>
        <span className="mt-1 text-xs text-slate-400">Файл автоматически сохранится в WebP</span>
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
        multiple={multiple}
        disabled={isUploading}
        onChange={(event) => {
          if (event.target.files) uploadFiles(event.target.files);
          event.target.value = "";
        }}
        className="sr-only"
      />

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <div key={`${image.url}-${index}`} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div
                role="img"
                aria-label={image.title || `Изображение ${index + 1}`}
                className="aspect-square bg-slate-100 bg-cover bg-center"
                style={{ backgroundImage: `url(${JSON.stringify(resolveMediaUrl(image.url))})` }}
              />
              <div className="truncate px-3 py-2 text-xs text-slate-500">{image.title || image.url.split("/").at(-1)}</div>
              <button
                type="button"
                aria-label={`Удалить изображение ${index + 1}`}
                onClick={() => onRemove(index)}
                className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/95 text-lg text-red-600 shadow-sm transition hover:bg-red-50"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
