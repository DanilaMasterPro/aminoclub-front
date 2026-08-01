"use client";

import api from "@/api/client";
import axios from "axios";
import { useState } from "react";

export type AffiliateApplicationValues = {
  name: string;
  surname: string;
  phone: string;
  email: string;
  city: string;
  socialLink: string;
  audienceSize: string;
  specialization: string;
  comment: string;
  termsAccepted: boolean;
};

const initialValues: AffiliateApplicationValues = {
  name: "",
  surname: "",
  phone: "",
  email: "",
  city: "",
  socialLink: "",
  audienceSize: "",
  specialization: "",
  comment: "",
  termsAccepted: false,
};

function getErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) return "Не удалось отправить заявку. Попробуйте ещё раз.";
  const message = error.response?.data?.message;
  return Array.isArray(message) ? message.join(". ") : message ?? "Не удалось отправить заявку. Попробуйте ещё раз.";
}

export function useAffiliateApplication() {
  const [values, setValues] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const setValue = <Key extends keyof AffiliateApplicationValues>(key: Key, value: AffiliateApplicationValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const submit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      await api.post("/trainers/apply", {
        ...values,
        audienceSize: Number(values.audienceSize),
      });
      setValues(initialValues);
      setIsSubmitted(true);
    } catch (submitError: unknown) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { values, setValue, submit, isSubmitting, isSubmitted, error };
}
