"use client";

import type { ReactNode } from "react";

type DashboardHeaderProps = {
  children: ReactNode;
  email: string;
  isLoggingOut?: boolean;
  onLogout: () => void;
  contained?: boolean;
  sticky?: boolean;
};

export default function DashboardHeader({
  children,
  email,
  isLoggingOut = false,
  onLogout,
  contained = false,
  sticky = false,
}: DashboardHeaderProps) {
  return (
    <header className={`${sticky ? "sticky top-0 z-10" : ""} border-b border-slate-200 bg-white`}>
      <div className={`${contained ? "mx-auto max-w-7xl" : "w-full"} flex h-16 items-center justify-between gap-4 px-5 lg:px-8`}>
        <div className="flex min-w-0 items-center gap-4">{children}</div>
        <div className="flex shrink-0 items-center gap-4 text-sm">
          <span className="hidden max-w-64 truncate text-slate-500 sm:inline">{email}</span>
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={onLogout}
            className="font-medium text-slate-600 hover:text-slate-950 disabled:cursor-wait disabled:opacity-50"
          >
            {isLoggingOut ? "Выходим…" : "Выйти"}
          </button>
        </div>
      </div>
    </header>
  );
}
