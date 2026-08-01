import type { ReactNode } from "react";

type AdminTableProps = {
  headers: ReactNode[];
  children: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  minWidthClassName?: string;
};

export default function AdminTable({
  headers,
  children,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "Записей пока нет.",
  minWidthClassName = "min-w-[760px]",
}: AdminTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className={`w-full ${minWidthClassName} border-collapse text-left text-sm`}>
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="border-b border-slate-200 px-4 py-3 font-semibold">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      {isLoading && <p className="p-8 text-center text-sm text-slate-500">Загрузка…</p>}
      {!isLoading && isEmpty && <p className="p-8 text-center text-sm text-slate-500">{emptyMessage}</p>}
    </div>
  );
}
