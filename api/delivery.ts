import api from "./client";
import type { DeliveryLocation, DeliveryPayload, DeliveryQuote, PickupPoint } from "./types";

export async function findLocations(query: string, signal?: AbortSignal) {
  const { data } = await api.get<DeliveryLocation[]>("/delivery/locations", { params: { query }, signal });
  return data;
}

export async function findPickupPoints(geoId: number, search: string, signal?: AbortSignal) {
  const { data } = await api.get<{ total: number; items: PickupPoint[] }>("/delivery/pickup-points", {
    params: { geoId, search: search || undefined },
    signal,
  });
  return data;
}

/** All matching points with coordinates, for the map (the list endpoint returns only the first 50). */
export async function findMapPickupPoints(geoId: number, search: string, signal?: AbortSignal) {
  const { data } = await api.get<{ items: PickupPoint[] }>("/delivery/pickup-points/map", {
    params: { geoId, search: search || undefined },
    signal,
  });
  return data.items;
}

export async function quoteDelivery(
  items: Array<{ productId: string; quantity: number }>,
  delivery: DeliveryPayload,
  signal?: AbortSignal,
) {
  const { data } = await api.post<DeliveryQuote>("/delivery/quote", { items, delivery }, { signal });
  return data;
}
