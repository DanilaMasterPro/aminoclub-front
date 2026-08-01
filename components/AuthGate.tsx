"use client";

import api from "@/api/client";
import type { AuthUser, UserRole } from "@/api/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGate({
  role,
  children,
}: {
  role: UserRole;
  children: (user: AuthUser) => React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let active = true;
    api.get<AuthUser>("/auth/me")
      .then(({ data }) => {
        if (!active) return;
        if (data.role !== role) router.replace(data.role === "ADMIN" ? "/admin" : "/trainer");
        else setUser(data);
      })
      .catch(() => router.replace(`/login?next=${role === "ADMIN" ? "/admin" : "/trainer"}`));
    return () => { active = false; };
  }, [role, router]);

  if (!user) {
    return <div className="grid min-h-screen place-items-center bg-[#f4f5f7] text-sm text-slate-500">Проверяем доступ…</div>;
  }
  return children(user);
}
