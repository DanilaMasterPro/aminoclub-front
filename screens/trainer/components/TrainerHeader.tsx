"use client";

import type { AuthUser } from "@/api/types";
import DashboardHeader from "@/components/DashboardHeader";
import { useLogout } from "@/hooks/useLogout";
import Link from "next/link";

export default function TrainerHeader({ user }: { user: AuthUser }) {
  const { logout, isLoggingOut } = useLogout();

  return (
    <DashboardHeader contained email={user.email} isLoggingOut={isLoggingOut} onLogout={logout}>
      <Link href="/" className="font-black text-[#009d0a]">
        AMINOCLUB
      </Link>
    </DashboardHeader>
  );
}
