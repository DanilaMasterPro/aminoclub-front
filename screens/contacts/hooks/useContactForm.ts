"use client";

import { useState } from "react";
import api from "@/api/client";

export function useContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function submit(form: HTMLFormElement) {
    const data = new FormData(form);
    setStatus("sending");
    try {
      await api.post("/contact", { email: data.get("email"), name: data.get("name"), message: data.get("message") });
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }
  return { status, submit };
}
