"use client";

import api from "@/api/client";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export type TrainerApplicationStatus = "PENDING" | "APPROVED" | "REJECTED" | "BLOCKED";

export type TrainerApplicationDetail = {
  id: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  city: string | null;
  socialLink: string | null;
  audienceSize: number | null;
  specialization: string;
  comment: string | null;
  termsAcceptedAt: string;
  status: TrainerApplicationStatus;
  adminComment: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  profile: {
    id: string;
    referralCode: string;
    commissionRate: string | number;
    status: TrainerApplicationStatus;
  } | null;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;
  const message = error.response?.data?.message;
  return Array.isArray(message) ? message.join(". ") : message ?? fallback;
}

export function useAdminTrainerApplication(id: string) {
  const [application, setApplication] = useState<TrainerApplicationDetail | null>(null);
  const [commissionRate, setCommissionRate] = useState("10");
  const [promoDiscount, setPromoDiscount] = useState("10");
  const [promoCode, setPromoCode] = useState("");
  const [adminComment, setAdminComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadApplication = useCallback(async (signal?: AbortSignal) => {
    const { data } = await api.get<TrainerApplicationDetail>(`/admin/trainer-applications/${id}`, { signal });
    setApplication(data);
    setAdminComment(data.adminComment ?? "");
    setError("");
  }, [id]);

  useEffect(() => {
    const requestController = new AbortController();
    api.get<TrainerApplicationDetail>(`/admin/trainer-applications/${id}`, { signal: requestController.signal })
      .then(({ data }) => {
        setApplication(data);
        setAdminComment(data.adminComment ?? "");
        setError("");
      })
      .catch((requestError: unknown) => {
        if (!requestController.signal.aborted) {
          setError(getErrorMessage(requestError, "Не удалось загрузить заявку"));
        }
      })
      .finally(() => {
        if (!requestController.signal.aborted) setIsLoading(false);
      });
    return () => requestController.abort();
  }, [id]);

  const approve = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      await api.patch(`/admin/trainer-applications/${id}/approve`, {
        commissionRate: Number(commissionRate),
        promoDiscount: Number(promoDiscount),
        promoCode: promoCode.trim() || undefined,
      });
      await loadApplication();
    } catch (approveError: unknown) {
      setError(getErrorMessage(approveError, "Не удалось одобрить заявку"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const reject = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      await api.patch(`/admin/trainer-applications/${id}/reject`, {
        adminComment: adminComment.trim() || undefined,
      });
      await loadApplication();
    } catch (rejectError: unknown) {
      setError(getErrorMessage(rejectError, "Не удалось отклонить заявку"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    application,
    commissionRate,
    promoDiscount,
    promoCode,
    adminComment,
    isLoading,
    isSubmitting,
    error,
    setCommissionRate,
    setPromoDiscount,
    setPromoCode,
    setAdminComment,
    approve,
    reject,
  };
}
