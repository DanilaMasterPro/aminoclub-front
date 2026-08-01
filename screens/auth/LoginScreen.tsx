"use client";

import api from "@/api/client";
import type { AuthUser } from "@/api/types";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (step === "email") {
        const { data } = await api.post<{ accepted: boolean; devCode?: string }>("/auth/otp/request", { email });
        setDevCode(data.devCode ?? null);
        setStep("code");
      } else {
        const { data } = await api.post<{ user: AuthUser }>("/auth/otp/verify", { email, code });
        const requested = searchParams.get("next");
        const fallback = data.user.role === "ADMIN" ? "/admin" : "/trainer";
        router.replace(requested?.startsWith("/") ? requested : fallback);
      }
    } catch (caught) {
      setError(axios.isAxiosError(caught) ? caught.response?.data?.message ?? "Не удалось войти" : "Не удалось войти");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f5f7] px-5">
      <section className="w-full max-w-[420px] rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <Link href="/" className="mb-8 block text-xl font-black tracking-tight text-[#009d0a]">AMINOCLUB</Link>
        <p className="mb-2 text-sm font-medium text-[#009d0a]">Вход для команды</p>
        <h1 className="text-3xl font-semibold tracking-tight">{step === "email" ? "Получить код" : "Введите код"}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {step === "email" ? "Отправим одноразовый код на рабочую почту." : `Код отправлен на ${email}.`}
        </p>
        <form className="mt-8 space-y-4" onSubmit={submit}>
          {step === "email" ? (
            <label className="block text-sm font-medium">Email
              <input data-testid="login-email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-[#009d0a]" />
            </label>
          ) : (
            <label className="block text-sm font-medium">Код из письма
              <input data-testid="login-code" required inputMode="numeric" maxLength={6} pattern="\d{6}" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-center text-2xl tracking-[0.35em] outline-none focus:border-[#009d0a]" />
            </label>
          )}
          {devCode && <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">Dev-код: <strong>{devCode}</strong></p>}
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button data-testid="login-submit" disabled={busy} className="w-full rounded-lg bg-[#009d0a] px-4 py-3 font-semibold text-white disabled:opacity-50">
            {busy ? "Подождите…" : step === "email" ? "Отправить код" : "Войти"}
          </button>
          {step === "code" && <button type="button" onClick={() => { setStep("email"); setCode(""); }} className="w-full text-sm text-slate-500">Изменить email</button>}
        </form>
      </section>
    </main>
  );
}
