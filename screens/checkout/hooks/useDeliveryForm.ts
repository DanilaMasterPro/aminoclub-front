"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { findLocations, findPickupPoints, quoteDelivery } from "@/api/delivery";
import type { DeliveryAddress, DeliveryLocation, DeliveryMethod, DeliveryPayload, DeliveryQuote, PickupPoint } from "@/api/types";

type CheckoutLine = { productId: string; quantity: number };
type Keyed<T> = { key: string; value: T };

function errorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;
  const message = error.response?.data?.message;
  return (Array.isArray(message) ? message[0] : message) ?? fallback;
}

export function useDeliveryForm(lines: CheckoutLine[]) {
  const [cityQuery, setCityQueryValue] = useState("");
  const [location, setLocation] = useState<DeliveryLocation | null>(null);
  const [suggestions, setSuggestions] = useState<Keyed<DeliveryLocation[]>>({ key: "", value: [] });
  const [method, setMethodValue] = useState<DeliveryMethod>("PICKUP_POINT");
  const [pointSearch, setPointSearch] = useState("");
  const [points, setPoints] = useState<Keyed<{ total: number; items: PickupPoint[] }>>({ key: "", value: { total: 0, items: [] } });
  const [pickupPoint, setPickupPoint] = useState<PickupPoint | null>(null);
  const [address, setAddressValue] = useState<DeliveryAddress>({ street: "", house: "" });
  const [quoteState, setQuoteState] = useState<Keyed<{ quote: DeliveryQuote | null; error: string }>>({ key: "", value: { quote: null, error: "" } });

  const cityKey = !location && cityQuery.trim().length >= 3 ? cityQuery.trim() : "";
  const pointsKey = location && method === "PICKUP_POINT" ? `${location.geoId}|${pointSearch.trim()}` : "";

  const payload = useMemo<DeliveryPayload | null>(() => {
    if (!location) return null;
    const base = { city: location.address, ...(location.geoId ? { geoId: location.geoId } : {}) };
    if (method === "PICKUP_POINT") return pickupPoint ? { ...base, method, pickupPointId: pickupPoint.id } : null;
    if (address.street.trim().length < 2 || !address.house.trim()) return null;
    const trimmed = Object.fromEntries(Object.entries(address).map(([key, value]) => [key, value?.trim() || undefined]));
    return { ...base, method, address: trimmed as unknown as DeliveryAddress };
  }, [address, location, method, pickupPoint]);

  const quoteKey = payload && lines.length ? JSON.stringify([payload, lines]) : "";

  useEffect(() => {
    if (!cityKey) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      findLocations(cityKey, controller.signal)
        .then((value) => setSuggestions({ key: cityKey, value }))
        .catch(() => { if (!controller.signal.aborted) setSuggestions({ key: cityKey, value: [] }); });
    }, 300);
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [cityKey]);

  useEffect(() => {
    if (!pointsKey || !location) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      findPickupPoints(location.geoId, pointSearch.trim(), controller.signal)
        .then((value) => setPoints({ key: pointsKey, value }))
        .catch(() => { if (!controller.signal.aborted) setPoints({ key: pointsKey, value: { total: 0, items: [] } }); });
    }, 300);
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [location, pointSearch, pointsKey]);

  useEffect(() => {
    if (!quoteKey || !payload) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      quoteDelivery(lines, payload, controller.signal)
        .then((quote) => setQuoteState({ key: quoteKey, value: { quote, error: "" } }))
        .catch((error: unknown) => {
          if (controller.signal.aborted) return;
          setQuoteState({ key: quoteKey, value: { quote: null, error: errorMessage(error, "Не удалось рассчитать доставку") } });
        });
    }, 500);
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [lines, payload, quoteKey]);

  const setCityQuery = (value: string) => {
    setCityQueryValue(value);
    setLocation(null);
    setPickupPoint(null);
  };

  const selectLocation = (value: DeliveryLocation) => {
    setLocation(value);
    setCityQueryValue(value.address);
    setPickupPoint(null);
    setPointSearch("");
  };

  const setMethod = (value: DeliveryMethod) => setMethodValue(value);
  const setAddress = (field: keyof DeliveryAddress, value: string) => setAddressValue((current) => ({ ...current, [field]: value }));

  const currentQuote = quoteState.key === quoteKey ? quoteState.value : null;

  return {
    cityQuery,
    location,
    suggestions: cityKey && suggestions.key === cityKey ? suggestions.value : [],
    isSearchingCity: Boolean(cityKey) && suggestions.key !== cityKey,
    method,
    pointSearch,
    points: points.key === pointsKey ? points.value : { total: 0, items: [] },
    isLoadingPoints: Boolean(pointsKey) && points.key !== pointsKey,
    pickupPoint,
    address,
    payload,
    quote: currentQuote?.quote ?? null,
    quoteError: currentQuote?.error ?? "",
    isQuoting: Boolean(quoteKey) && !currentQuote,
    setCityQuery,
    selectLocation,
    setMethod,
    setPointSearch,
    setPickupPoint,
    setAddress,
  };
}

export type DeliveryFormState = ReturnType<typeof useDeliveryForm>;
