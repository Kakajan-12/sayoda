"use client";

import { useEffect, useState } from "react";
import { BASE_API_URL } from "@/i18n/api";
import { useTranslations, useLocale } from "next-intl";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoMdCloseCircleOutline } from "react-icons/io";

interface Item {
  id: number;
  text_en: string;
  text_ru: string;
  text_tk: string;
}

export default function IncludesExcludes({ tourId }: { tourId: number }) {
  const t = useTranslations("TourPerPage");
  const locale = useLocale();
  const [includes, setIncludes] = useState<Item[]>([]);
  const [excludes, setExcludes] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [incRes, excRes] = await Promise.all([
          fetch(`${BASE_API_URL}/api/includes/tour/${tourId}`),
          fetch(`${BASE_API_URL}/api/excludes/tour/${tourId}`),
        ]);

        const incData = await incRes.json();
        const excData = await excRes.json();

        setIncludes(incData);
        setExcludes(excData);
      } catch (error) {
        console.error("Ошибка загрузки includes/excludes", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tourId]);

  const getLocalizedText = (item: Item) => {
    switch (locale) {
      case "tk":
        return item.text_tk;
      case "ru":
        return item.text_ru;
      case "en":
      default:
        return item.text_en;
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full bg-[#E3ECF5] py-10 lg:py-20">
      <div className="container mx-auto px-5 lg:px-32">
        <h2 className="text-xl lg:text-2xl 2xl:text-3xl font-bold">
          {t("whats")}
        </h2>

        <div className="flex flex-col mt-10 gap-y-12 md:gap-x-10 sm:flex-row sm:justify-between">
          <div className="flex flex-col gap-5 md:w-1/2 bg-white px-5 py-7 rounded-xl">
            <h3 className="text-lg font-semibold lg:text-xl">{t("include")}</h3>
            {includes.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <IoMdCheckmarkCircleOutline className="w-5 h-5 mt-1 shrink-0 text-mainLight" />
                <div
                  dangerouslySetInnerHTML={{ __html: getLocalizedText(item) }}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-5 md:w-1/2 bg-white px-5 py-7 rounded-xl">
            <h3 className="text-lg font-semibold lg:text-xl">
              {t("notincluded")}
            </h3>
            {excludes.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <IoMdCloseCircleOutline className="w-5 h-5 mt-1 shrink-0 text-mainLight" />
                <div
                  dangerouslySetInnerHTML={{ __html: getLocalizedText(item) }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
