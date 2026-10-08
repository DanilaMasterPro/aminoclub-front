import type { Metadata } from "next";
import LoginScreen from "@/screens/auth/LoginScreen";
import { Suspense } from "react";

// Service page: not for search engines.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function LoginPage() {
  return <Suspense fallback={<div className="grid min-h-screen place-items-center">Загрузка…</div>}><LoginScreen /></Suspense>;
}
