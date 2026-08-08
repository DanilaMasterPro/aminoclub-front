"use client";

import { useEffect, useState } from "react";
import type { AppliedPromo } from "@/api/types";
import { applyPromoCode } from "@/api/checkout";

const STORAGE_KEY = "aminoclub_promo_v1";
type StoredPromo = { subtotal: number; promo: AppliedPromo };

export function usePromoCode(subtotal: number) {
  const [code, setCode] = useState("");
  const [promo, setPromo] = useState<AppliedPromo | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null") as StoredPromo | null;
        if (stored?.subtotal === subtotal) {
          setPromo(stored.promo);
          setCode(stored.promo.code);
        } else {
          window.localStorage.removeItem(STORAGE_KEY);
          setPromo(null);
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [subtotal]);

  async function apply() {
    if (!code.trim()) return;
    setIsApplying(true);
    setError("");
    try {
      const applied = await applyPromoCode(code.trim(), subtotal);
      setPromo(applied);
      setCode(applied.code);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ subtotal, promo: applied } satisfies StoredPromo));
    } catch {
      setPromo(null);
      setError("Промокод недействителен");
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsApplying(false);
    }
  }

  function clearPromo() {
    setPromo(null);
    setCode("");
    setError("");
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return { code, setCode, promo, isApplying, error, apply, clearPromo };
}
