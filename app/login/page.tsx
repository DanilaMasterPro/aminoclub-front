import LoginScreen from "@/screens/auth/LoginScreen";
import { Suspense } from "react";

export default function LoginPage() {
  return <Suspense fallback={<div className="grid min-h-screen place-items-center">Загрузка…</div>}><LoginScreen /></Suspense>;
}
