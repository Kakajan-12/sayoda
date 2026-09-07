"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useRouter } from "@/i18n/navigation";
import Dropdown from "@/components/ui/Dropdown";
import { PoppinFont } from "@/components/ui/Fonts";
import type { TaxonomyItem } from "@/lib/api/catalog";

/**
 * Фильтры каталога туров.
 *
 * Отбор перенесён на сервер, поэтому фильтр больше не просеивает массив в
 * браузере — он меняет адрес, а страницу с нужными турами собирает сервер.
 * Иначе фильтровать было бы нечего: браузер видит только текущие двенадцать
 * карточек, а не весь каталог.
 *
 * Побочная польза: отобранный список получил собственный адрес — его можно
 * отправить клиенту в переписке, и он откроется тем же самым.
 *
 * При смене любого условия номер страницы сбрасывается: на четвёртой
 * странице прежней выборки в новой может не быть ничего, и человек попадал
 * бы на пустой экран.
 */

export interface ToursFilterValues {
  type: string;
  cat: string;
  destination: string;
  popular: string;
}

interface Props {
  values: ToursFilterValues;
  types: { id: number; label: string }[];
  categories: TaxonomyItem[];
  destinations: TaxonomyItem[];
}

export default function ToursFilters({
  values,
  types,
  categories,
  destinations,
}: Props) {
  const t = useTranslations("Filter");
  const locale = useLocale();
  const router = useRouter();
  const [isMobileOpen, setMobileOpen] = useState(false);

  const isFiltered = Object.values(values).some(Boolean);

  const apply = (next: Partial<ToursFilterValues>) => {
    const merged = { ...values, ...next };
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(merged)) {
      if (value) search.set(key, value);
    }
    const query = search.toString();
    // scroll: false — список сам подставится под фильтром, а перескок
    // страницы наверх сбивает при переборе вариантов.
    router.push(query ? `/tours?${query}` : "/tours", { scroll: false });
  };

  const form = (
    <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
      <Dropdown
        label={t("all-tours")}
        value={values.popular}
        options={[
          { value: "", label: t("all-tours") },
          { value: "1", label: t("popular") },
        ]}
        onChange={(value) => apply({ popular: value })}
      />

      <Dropdown
        label={t("all-types")}
        value={values.type}
        options={[
          { value: "", label: t("all-types") },
          ...types.map((item) => ({
            value: String(item.id),
            label: item.label,
          })),
        ]}
        onChange={(value) => apply({ type: value })}
      />

      <Dropdown
        label={t("all-categories")}
        value={values.cat}
        options={[
          { value: "", label: t("all-categories") },
          ...categories.map((cat) => ({
            value: String(cat.id),
            label: String(cat[`cat_${locale}`] ?? cat.cat_en ?? ""),
          })),
        ]}
        onChange={(value) => apply({ cat: value })}
      />

      <Dropdown
        label={t("all-locations")}
        value={values.destination}
        options={[
          { value: "", label: t("all-locations") },
          ...destinations.map((item) => ({
            value: String(item.id),
            label: String(item[`location_${locale}`] ?? item.location_en ?? ""),
          })),
        ]}
        onChange={(value) => apply({ destination: value })}
      />

      <button
        type="button"
        onClick={() =>
          apply({ type: "", cat: "", destination: "", popular: "" })
        }
        disabled={!isFiltered}
        className={`${PoppinFont.className} shrink-0 rounded-full border border-tile px-6 py-2.5 text-sm text-tile transition-colors hover:bg-tile hover:text-white disabled:cursor-default disabled:border-sand disabled:text-inkMuted disabled:hover:bg-transparent disabled:hover:text-inkMuted`}
      >
        {t("reset")}
      </button>
    </div>
  );

  return (
    <>
      <div className="scroll-mt-24">
        <div className="hidden lg:flex container mx-auto px-5 justify-center -mt-16 z-20 relative mb-10">
          <div className="w-full max-w-[1200px] rounded-xl bg-white px-6 py-5 shadow-lg ring-1 ring-sand">
            {form}
          </div>
        </div>

        <div className="flex lg:hidden justify-end px-5 mt-4">
          <button
            type="button"
            aria-label={t("filter")}
            onClick={() => setMobileOpen(true)}
            className="p-2 border rounded-full"
          >
            <FiFilter size={24} />
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 p-6 rounded-lg relative">
            <button
              type="button"
              aria-label={t("close")}
              className="absolute top-3 right-3 text-inkMuted transition-colors hover:text-ink"
              onClick={() => setMobileOpen(false)}
            >
              <IoClose size={28} />
            </button>
            <h2
              className={`${PoppinFont.className} mb-4 text-lg font-bold text-ink`}
            >
              {t("filter")}
            </h2>
            {form}
            <button
              type="button"
              className={`${PoppinFont.className} mt-5 w-full rounded-full bg-tile py-2.5 text-sm text-white transition-colors hover:bg-tileDark`}
              onClick={() => setMobileOpen(false)}
            >
              {t("search")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
