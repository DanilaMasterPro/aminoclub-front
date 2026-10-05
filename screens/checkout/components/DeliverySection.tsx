"use client";

import type { DeliveryAddress } from "@/api/types";
import { formatPrice } from "@/utils/formatPrice";
import type { DeliveryFormState } from "../hooks/useDeliveryForm";

const inputClass = "h-12 w-full rounded-lg border border-transparent bg-white px-5 text-sm outline-none transition focus:border-[#15191a]";

const addressFields: Array<{ name: keyof DeliveryAddress; placeholder: string; wide?: boolean; required?: boolean }> = [
  { name: "street", placeholder: "Улица", wide: true, required: true },
  { name: "house", placeholder: "Дом, корпус", required: true },
  { name: "apartment", placeholder: "Квартира / офис" },
  { name: "porch", placeholder: "Подъезд" },
  { name: "floor", placeholder: "Этаж" },
  { name: "intercom", placeholder: "Домофон" },
  { name: "postalCode", placeholder: "Индекс" },
];

function pluralDays(days: number) {
  const mod10 = days % 10;
  const mod100 = days % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "дня";
  return "дней";
}

export default function DeliverySection({ delivery }: { delivery: DeliveryFormState }) {
  const showSuggestions = !delivery.location && delivery.cityQuery.trim().length >= 3;

  return (
    <fieldset className="mt-10">
      <legend className="mb-7 text-sm font-bold uppercase">Доставка — Яндекс Доставка</legend>

      <div className="relative">
        <input
          className={inputClass}
          value={delivery.cityQuery}
          onChange={(event) => delivery.setCityQuery(event.target.value)}
          placeholder="Город или населённый пункт"
          autoComplete="off"
          aria-label="Город доставки"
          data-testid="delivery-city"
        />
        {showSuggestions && (
          <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg">
            {delivery.isSearchingCity && <p className="px-5 py-3 text-[#747978]">Ищем…</p>}
            {!delivery.isSearchingCity && !delivery.suggestions.length && <p className="px-5 py-3 text-[#747978]">Ничего не найдено</p>}
            {delivery.suggestions.map((variant) => (
              <button
                key={`${variant.geoId}-${variant.address}`}
                type="button"
                onClick={() => delivery.selectLocation(variant)}
                className="block w-full px-5 py-3 text-left hover:bg-[#f5f3ed]"
              >
                {variant.address}
              </button>
            ))}
          </div>
        )}
      </div>

      {delivery.location && (
        <>
          <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-white p-1 text-sm" role="radiogroup" aria-label="Способ доставки">
            {([["PICKUP_POINT", "Пункт выдачи"], ["COURIER", "Курьером до двери"]] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={delivery.method === value}
                onClick={() => delivery.setMethod(value)}
                className={`rounded-lg px-4 py-3 font-medium transition ${delivery.method === value ? "bg-[#15191a] text-white" : "text-[#15191a] hover:bg-[#f5f3ed]"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {delivery.method === "PICKUP_POINT" ? (
            <div className="mt-5">
              {delivery.pickupPoint ? (
                <div className="rounded-xl border border-[#009d0a] bg-white p-5 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{delivery.pickupPoint.name}</p>
                      <p className="mt-1">{delivery.pickupPoint.address}</p>
                      {delivery.pickupPoint.schedule && <p className="mt-1 text-[#747978]">{delivery.pickupPoint.schedule}</p>}
                    </div>
                    <button type="button" onClick={() => delivery.setPickupPoint(null)} className="shrink-0 text-xs font-semibold text-[#009d0a]">Изменить</button>
                  </div>
                </div>
              ) : (
                <>
                  <input
                    className={inputClass}
                    value={delivery.pointSearch}
                    onChange={(event) => delivery.setPointSearch(event.target.value)}
                    placeholder="Поиск пункта по улице или метро"
                    aria-label="Поиск пункта выдачи"
                  />
                  <div className="mt-3 max-h-80 overflow-auto rounded-xl bg-white text-sm" data-testid="pickup-points">
                    {delivery.isLoadingPoints && <p className="px-5 py-4 text-[#747978]">Загружаем пункты выдачи…</p>}
                    {!delivery.isLoadingPoints && !delivery.points.items.length && (
                      <p className="px-5 py-4 text-[#747978]">Пункты выдачи не найдены. Попробуйте другой запрос или доставку курьером.</p>
                    )}
                    {delivery.points.items.map((point) => (
                      <button
                        key={point.id}
                        type="button"
                        onClick={() => delivery.setPickupPoint(point)}
                        className="block w-full border-b border-[#f5f3ed] px-5 py-4 text-left last:border-0 hover:bg-[#f5f3ed]"
                      >
                        <span className="block font-medium">{point.address}</span>
                        <span className="mt-1 block text-xs text-[#747978]">
                          {point.type === "terminal" ? "Постамат" : point.name}{point.schedule ? ` · ${point.schedule}` : ""}
                        </span>
                      </button>
                    ))}
                    {delivery.points.total > delivery.points.items.length && (
                      <p className="px-5 py-3 text-xs text-[#747978]">Показаны {delivery.points.items.length} из {delivery.points.total}. Уточните поиск.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
              {addressFields.map((field) => (
                <input
                  key={field.name}
                  className={`${inputClass} ${field.wide ? "col-span-2 max-[600px]:col-span-1" : ""}`}
                  value={delivery.address[field.name] ?? ""}
                  onChange={(event) => delivery.setAddress(field.name, event.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  aria-label={field.placeholder}
                />
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-5 min-h-6 text-sm" aria-live="polite">
        {delivery.isQuoting && <p className="text-[#747978]">Рассчитываем стоимость доставки…</p>}
        {delivery.quoteError && <p className="text-red-600">{delivery.quoteError}</p>}
        {delivery.quote && (
          <p data-testid="delivery-quote">
            Доставка: <strong>{formatPrice(delivery.quote.amount)}</strong>
            {delivery.quote.deliveryDays ? `, ${delivery.quote.deliveryDays} ${pluralDays(delivery.quote.deliveryDays)}` : ""}
            {delivery.quote.isEstimate && <span className="text-[#747978]"> (ориентировочно)</span>}
          </p>
        )}
      </div>
    </fieldset>
  );
}
