"use client";

import axios from "axios";
import { useCallback, useState } from "react";
import api from "@/api/client";
import { formatRuPhone, isCompleteRuPhone } from "@/utils/phone";

export type CallbackMessenger = "telegram" | "whatsapp" | "max" | "nickname";

export function useCallbackForm() {
  const [phone, setPhoneValue] = useState("");
  const [messenger, setMessenger] = useState<CallbackMessenger | "">("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const setPhone = (value: string) => setPhoneValue(formatRuPhone(value));

  async function submit(form: HTMLFormElement) {
    if (!isCompleteRuPhone(phone)) {
      setError("Введите номер телефона полностью");
      return;
    }
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? "").trim() || undefined;
    setStatus("sending");
    setError("");
    try {
      await api.post("/callback", {
        phone,
        name: text("name"),
        comment: text("comment"),
        messenger: messenger && messenger !== "nickname" ? messenger : undefined,
        nickname: messenger === "nickname" ? text("nickname") : undefined,
        consent: data.get("consent") === "on",
      });
      setStatus("sent");
    } catch (requestError) {
      setStatus("idle");
      setError(axios.isAxiosError(requestError) && requestError.response?.status === 429
        ? "Слишком много заявок подряд. Попробуйте через минуту."
        : "Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.");
    }
  }

  const reset = useCallback(() => {
    setPhoneValue("");
    setMessenger("");
    setStatus("idle");
    setError("");
  }, []);

  return { phone, setPhone, messenger, setMessenger, status, error, submit, reset };
}
