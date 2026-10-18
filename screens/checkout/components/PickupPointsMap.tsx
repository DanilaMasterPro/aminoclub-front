"use client";

import { useEffect, useRef, useState } from "react";
import type { PickupPoint } from "@/api/types";
import { loadYandexMaps, type YandexMap, type YandexMaps, type YandexObjectManager } from "@/utils/yandexMaps";

type PickupPointsMapProps = {
  points: PickupPoint[];
  onSelect: (point: PickupPoint) => void;
};

/** Pickup points of the city on Yandex Maps, clustered; a click on a point selects it (same as in the list). */
export default function PickupPointsMap({ points, onSelect }: PickupPointsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ymapsRef = useRef<YandexMaps | null>(null);
  const mapRef = useRef<YandexMap | null>(null);
  const managerRef = useRef<YandexObjectManager | null>(null);
  // View changes run one after another (see YandexMap.setBounds).
  const viewRef = useRef<Promise<void>>(Promise.resolve());
  // The click handler is bound once, so it reads the latest points and callback through refs.
  const pointsRef = useRef(points);
  const onSelectRef = useRef(onSelect);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    pointsRef.current = points;
    onSelectRef.current = onSelect;
  }, [onSelect, points]);

  useEffect(() => {
    let cancelled = false;
    loadYandexMaps()
      .then((ymaps) => {
        if (cancelled || !containerRef.current) return;
        ymapsRef.current = ymaps;
        mapRef.current = new ymaps.Map(containerRef.current, { center: [59.94, 30.31], zoom: 10, controls: ["zoomControl", "geolocationControl"] });
        setStatus("ready");
      })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => {
      cancelled = true;
      mapRef.current?.destroy();
      mapRef.current = null;
      managerRef.current = null;
    };
  }, []);

  // A fresh object manager for every new set of points: refilling the old one with removeAll() + add()
  // leaves points that were inside a cluster drawn far off the map.
  useEffect(() => {
    const ymaps = ymapsRef.current;
    const map = mapRef.current;
    if (status !== "ready" || !ymaps || !map) return;
    if (managerRef.current) map.geoObjects.remove(managerRef.current);
    const manager = new ymaps.ObjectManager({ clusterize: true, gridSize: 64 });
    manager.objects.options.set({ preset: "islands#circleDotIcon", iconColor: "#009d0a" });
    manager.clusters.options.set({ preset: "islands#invertedGreenClusterIcons", clusterIconColor: "#009d0a" });
    manager.objects.events.add("click", (event) => {
      const point = pointsRef.current.find((item) => item.id === event.get("objectId"));
      if (point) onSelectRef.current(point);
    });
    manager.add({
      type: "FeatureCollection",
      features: points.map((point) => ({
        type: "Feature",
        id: point.id,
        geometry: { type: "Point", coordinates: [point.latitude, point.longitude] },
        properties: { hintContent: `${point.address}${point.schedule ? ` · ${point.schedule}` : ""}` },
      })),
    });
    map.geoObjects.add(manager);
    managerRef.current = manager;
    const fitPoints = async () => {
      const bounds = manager.getBounds();
      if (!bounds || mapRef.current !== map) return;
      await map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 24 });
      if (mapRef.current === map && map.getZoom() > 15) map.setZoom(15); // a single point: street level, not max zoom
    };
    viewRef.current = viewRef.current.then(fitPoints, fitPoints);
  }, [points, status]);

  if (status === "error") return null; // the list below still works

  return (
    // data-lenis-prevent: the mouse wheel zooms the map instead of scrolling the page.
    <div data-lenis-prevent className="relative mt-3 h-[360px] overflow-hidden rounded-xl bg-white max-[600px]:h-[300px]">
      <div ref={containerRef} className="size-full" aria-label="Карта пунктов выдачи" />
      {status === "loading" && <p className="absolute inset-0 grid place-items-center text-sm text-[#747978]">Загружаем карту…</p>}
    </div>
  );
}
