"use client";

import api from "@/api/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useLogout() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await api.post("/auth/logout");
    } finally {
      router.replace("/login");
    }
  };

  return { logout, isLoggingOut };
}
