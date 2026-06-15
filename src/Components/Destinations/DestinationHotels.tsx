"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getHotels, getLocalizedHotelField, type Hotel } from "@/api/getHotels";
import { hotelsFallback } from "@/Components/Hotels/hotelsFallback";
import HotelCard from "@/Components/Hotels/HotelCard";
import { BarLoader } from "react-spinners";

export default function DestinationHotels({ country }: { country: string }) {
  const t = useTranslations("Hotels");
  const locale = useLocale();

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCity, setActiveCity] = useState<string | null>(null);

  useEffect(() => {
    getHotels()
      .then((data) => {
        const source = data.length ? data : hotelsFallback;
        // keep only hotels belonging to this destination
        setHotels(source.filter((h) => h.country === country));
      })
      .finally(() => setLoading(false));
  }, [country]);

  // Distinct cities derived from the hotels themselves (keyed by English name so
  // the filter stays stable across locales, shown in the active locale).
  const cities = useMemo(() => {
    const map = new Map<string, string>();
    hotels.forEach((h) => {
      if (h.city_en)
        map.set(h.city_en, getLocalizedHotelField(h, locale, "city"));
    });
    return Array.from(map, ([key, label]) => ({ key, label }));
  }, [hotels, locale]);

  const filtered = activeCity
    ? hotels.filter((h) => h.city_en === activeCity)
    : hotels;

  if (loading) {
    return (
      <p className="flex justify-center items-center py-10">
        <BarLoader color="#245483" />
      </p>
    );
  }

  if (!hotels.length) {
    return <p className="py-10 text-center text-gray-500">{t("notFound")}</p>;
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* City filter */}
      <aside className="h-fit w-full shrink-0 rounded-2xl border border-gray-200 bg-white p-2 lg:sticky lg:top-32 lg:w-56 lg:self-start">
        <ul className="flex flex-row flex-wrap gap-1 lg:flex-col">
          <li className="lg:w-full">
            <button
              onClick={() => setActiveCity(null)}
              className={`w-full rounded-lg px-4 py-3 text-left font-medium transition-colors ${
                activeCity === null
                  ? "bg-mainForBackground text-mainBlue"
                  : "text-gray-600 hover:bg-mainForBackground/60"
              }`}
            >
              {t("all")}
            </button>
          </li>
          {cities.map((city) => (
            <li key={city.key} className="lg:w-full">
              <button
                onClick={() => setActiveCity(city.key)}
                className={`w-full rounded-lg px-4 py-3 text-left font-medium transition-colors ${
                  activeCity === city.key
                    ? "bg-mainForBackground text-mainBlue"
                    : "text-gray-600 hover:bg-mainForBackground/60"
                }`}
              >
                {city.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Hotels list */}
      <div className="flex flex-1 flex-col gap-4">
        {filtered.length ? (
          filtered.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)
        ) : (
          <p className="py-10 text-center text-gray-500">{t("notFound")}</p>
        )}
      </div>
    </div>
  );
}
