/**
 * Loads the Yandex Maps JS API 2.1 once per page. The key comes from NEXT_PUBLIC_YANDEX_MAPS_API_KEY (Yandex
 * developer cabinet, «JavaScript API и HTTP Геокодер»); without it the map still works for development,
 * but production must have a key under the free-use terms.
 */

type Coordinates = [number, number];

export type YandexEvent = { get(name: "objectId"): string };

export type YandexObjectManager = {
  add(collection: unknown): void;
  getBounds(): [Coordinates, Coordinates] | null;
  objects: {
    options: { set(options: Record<string, unknown>): void };
    events: { add(type: "click", handler: (event: YandexEvent) => void): void };
  };
  clusters: { options: { set(options: Record<string, unknown>): void } };
};

export type YandexMap = {
  geoObjects: { add(object: YandexObjectManager): void; remove(object: YandexObjectManager): void };
  /** Asynchronous with `checkZoomRange`: the next view change must wait for it, or placemarks end up off the map. */
  setBounds(bounds: [Coordinates, Coordinates], options?: Record<string, unknown>): PromiseLike<void>;
  getZoom(): number;
  setZoom(zoom: number): void;
  destroy(): void;
};

export type YandexMaps = {
  ready(callback: () => void): void;
  Map: new (container: HTMLElement, state: Record<string, unknown>, options?: Record<string, unknown>) => YandexMap;
  ObjectManager: new (options: Record<string, unknown>) => YandexObjectManager;
};

declare global {
  interface Window { ymaps?: YandexMaps }
}

let loading: Promise<YandexMaps> | null = null;

export function loadYandexMaps(): Promise<YandexMaps> {
  if (loading) return loading;
  loading = new Promise<YandexMaps>((resolve, reject) => {
    const key = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;
    const script = document.createElement("script");
    script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU${key ? `&apikey=${encodeURIComponent(key)}` : ""}`;
    script.async = true;
    script.onload = () => (window.ymaps ? window.ymaps.ready(() => resolve(window.ymaps as YandexMaps)) : reject(new Error("Yandex Maps did not load")));
    script.onerror = () => reject(new Error("Yandex Maps did not load"));
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    loading = null; // let the next attempt retry
    throw error;
  });
  return loading;
}
