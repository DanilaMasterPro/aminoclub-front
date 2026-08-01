import Link from "next/link";
import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  backHref?: string;
};

export default function AdminPageHeader({ title, eyebrow, action, backHref }: AdminPageHeaderProps) {
  return (
    <div className="mb-7">
      {backHref && (
        <Link href={backHref} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4" stroke="currentColor" strokeWidth="1.8">
            <path d="m12.5 15-5-5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Назад к списку
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {eyebrow && <p className="text-sm text-slate-500">{eyebrow}</p>}
          <h1 className={`${eyebrow ? "mt-1" : ""} text-3xl font-semibold tracking-tight`}>{title}</h1>
        </div>
        {action}
      </div>
    </div>
  );
}
