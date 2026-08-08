"use client";

import { useEffect } from "react";
import api from "@/api/client";

const REFERRAL_KEY = "aminoclub_referral_v1";
const VISITOR_KEY = "aminoclub_visitor_v1";
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

type StoredReferral = { code: string; expiresAt: number };

export function getStoredReferralCode() {
  if (typeof window === "undefined") return undefined;
  try {
    const value = JSON.parse(window.localStorage.getItem(REFERRAL_KEY) || "null") as StoredReferral | null;
    if (!value || value.expiresAt <= Date.now()) {
      window.localStorage.removeItem(REFERRAL_KEY);
      return undefined;
    }
    return value.code;
  } catch {
    window.localStorage.removeItem(REFERRAL_KEY);
    return undefined;
  }
}

export function useReferralAttribution() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = (params.get("ref") || params.get("referral"))?.trim().toLowerCase();
    if (!code) return;

    window.localStorage.setItem(REFERRAL_KEY, JSON.stringify({
      code,
      expiresAt: Date.now() + THIRTY_DAYS,
    } satisfies StoredReferral));

    let visitorId = window.localStorage.getItem(VISITOR_KEY);
    if (!visitorId) {
      visitorId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
      window.localStorage.setItem(VISITOR_KEY, visitorId);
    }

    api.post("/referral/track-click", {
      referralCode: code,
      visitorId,
      landingPath: `${window.location.pathname}${window.location.search}`,
    }).catch(() => undefined);
  }, []);
}
