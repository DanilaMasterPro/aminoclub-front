"use client";

import { useReferralAttribution } from "@/hooks/useReferralAttribution";

export default function ReferralTracker() {
  useReferralAttribution();
  return null;
}
