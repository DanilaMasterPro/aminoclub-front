"use client";

import api from "@/api/client";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

type TrainerStatus = "PENDING" | "APPROVED" | "REJECTED" | "BLOCKED";

export type AdminTrainerDetail = {
  id: string;
  name: string;
  surname: string;
  phone: string;
  city: string | null;
  socialLink: string | null;
  specialization: string;
  audienceSize: number | null;
  bio: string | null;
  status: TrainerStatus;
  referralCode: string;
  commissionRate: string | number;
  createdAt: string;
  updatedAt: string;
  user: { email: string };
  application: {
    id: string;
    comment: string | null;
    termsAcceptedAt: string;
    createdAt: string;
    reviewedAt: string | null;
  } | null;
  promoCodes: Array<{
    id: string;
    code: string;
    type: "PERCENT" | "FIXED";
    value: string | number;
    isActive: boolean;
    usageCount: number;
    usageLimit: number | null;
  }>;
  payoutAccount: { displayHint: string; details: string; updatedAt: string } | null;
  stats: {
    referralClicks: number;
    orders: { _count: number; _sum: { finalAmount: string | number | null } };
    commissions: Array<{ status: string; _sum: { amount: string | number | null } }>;
    payouts: Array<{
      status: string;
      _count: number;
      _sum: { amount: string | number | null };
    }>;
  };
};

export type AdminTrainerEditValues = {
  name: string;
  surname: string;
  email: string;
  phone: string;
  city: string;
  socialLink: string;
  specialization: string;
  audienceSize: string;
  bio: string;
  commissionRate: string;
  referralCode: string;
};

function editValuesFromTrainer(trainer: AdminTrainerDetail): AdminTrainerEditValues {
  return {
    name: trainer.name,
    surname: trainer.surname,
    email: trainer.user.email,
    phone: trainer.phone,
    city: trainer.city ?? "",
    socialLink: trainer.socialLink ?? "",
    specialization: trainer.specialization,
    audienceSize: trainer.audienceSize?.toString() ?? "",
    bio: trainer.bio ?? trainer.application?.comment ?? "",
    commissionRate: trainer.commissionRate.toString(),
    referralCode: trainer.referralCode,
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;
  const message = error.response?.data?.message;
  return Array.isArray(message) ? message.join(". ") : message ?? fallback;
}

export function useAdminTrainer(id: string) {
  const [trainer, setTrainer] = useState<AdminTrainerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editValues, setEditValues] = useState<AdminTrainerEditValues | null>(null);
  const [error, setError] = useState("");

  const loadTrainer = useCallback(async (signal?: AbortSignal) => {
    const { data } = await api.get<AdminTrainerDetail>(`/admin/trainers/${id}`, { signal });
    setTrainer(data);
    setEditValues(editValuesFromTrainer(data));
    setError("");
  }, [id]);

  useEffect(() => {
    const requestController = new AbortController();
    api.get<AdminTrainerDetail>(`/admin/trainers/${id}`, { signal: requestController.signal })
      .then(({ data }) => {
        setTrainer(data);
        setEditValues(editValuesFromTrainer(data));
        setError("");
      })
      .catch((requestError: unknown) => {
        if (!requestController.signal.aborted) {
          setError(getErrorMessage(requestError, "Не удалось загрузить профиль тренера"));
        }
      })
      .finally(() => {
        if (!requestController.signal.aborted) setIsLoading(false);
      });
    return () => requestController.abort();
  }, [id]);

  const block = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      await api.patch(`/admin/trainers/${id}/block`);
      await loadTrainer();
    } catch (blockError: unknown) {
      setError(getErrorMessage(blockError, "Не удалось заблокировать тренера"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEditing = () => {
    if (trainer) setEditValues(editValuesFromTrainer(trainer));
    setError("");
  };

  const setEditValue = <Key extends keyof AdminTrainerEditValues>(key: Key, value: AdminTrainerEditValues[Key]) => {
    setEditValues((current) => current ? { ...current, [key]: value } : current);
  };

  const save = async () => {
    if (!editValues) return;
    setIsSubmitting(true);
    setError("");
    try {
      const { data } = await api.patch<AdminTrainerDetail>(`/admin/trainers/${id}`, {
        ...editValues,
        audienceSize: Number(editValues.audienceSize),
        commissionRate: Number(editValues.commissionRate),
      });
      setTrainer(data);
      setEditValues(editValuesFromTrainer(data));
    } catch (saveError: unknown) {
      setError(getErrorMessage(saveError, "Не удалось сохранить профиль тренера"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    trainer,
    editValues,
    isLoading,
    isSubmitting,
    error,
    block,
    cancelEditing,
    setEditValue,
    save,
  };
}
