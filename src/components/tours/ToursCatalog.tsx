"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import ReactPaginate from "react-paginate";
import { FiChevronDown, FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import TourCards from "@/components/home/TourCards";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";
import type { Tour, TaxonomyItem } from "@/lib/api/catalog";

/**
 * Клиентская обвязка каталога: фильтры, пагинация, модалка фильтров на мобиле.
 *
 * Туры приходят пропсом из Server Component и уже отрисованы в серверном HTML —
 * компонент их только фильтрует. Раньше список грузился в useEffect, поэтому
 * краулеры видели страницу без единой карточки.
 *
 * `useSearchParams` здесь намеренно не используется: он переводит маршрут в
 * динамический рендер, и карточки снова пропали бы из статического HTML.
 * Параметр ?location= из ссылок футера читается один раз после монтирования.
 */

const ITEMS_PER_PAGE = 8;

/**
 * Поля берут оформление у формы заявки на главной: те же border-sand,
 * rounded-lg и подсветка фокуса. Раньше здесь стояли голые `border rounded-md`
 * с системной стрелкой — на фоне остального сайта это выглядело чужим.
 *
 * appearance-none убирает нативную стрелку, вместо неё рисуется своя, иначе
 * в каждом браузере она своя и по-разному выпирает.
 */
const selectClass = `${QuicksandFont.className} w-full appearance-none rounded-lg border border-sand bg-white px-4 py-2.5 pr-10 text-sm text-ink outline-none transition focus:border-tileLight`;

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  // w-full — для колонки в модалке на телефоне; flex-1 с min-w-0 — для строки
  // на десктопе: поля делят ширину поровну и не распирают контейнер длинным
  // названием локации.
  return (
    <div className="relative w-full lg:min-w-0 lg:flex-1">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
      >
        {children}
      </select>
      <FiChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-inkMuted"
      />
    </div>
  );
}

interface Filters {
  popular: boolean | null;
  tourType: number | null;
  category: number | null;
  location: number | null;
}

const EMPTY_FILTERS: Filters = {
  popular: null,
  tourType: null,
  category: null,
  location: null,
};

interface Props {
  tours: Tour[];
  categories: TaxonomyItem[];
  locations: TaxonomyItem[];
}

export default function ToursCatalog({ tours, categories, locations }: Props) {
  const t = useTranslations("Filter");
  const tc = useTranslations("Common");
  const locale = useLocale();

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);

  // Ссылки вида /tours?location=2 ведут из футера и с карточек направлений.
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("location");
    if (value !== null && value !== "") {
      setFilters((prev) => ({ ...prev, location: Number(value) }));
    }
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [filters]);

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  // Типы туров в API отдельным эндпоинтом не отдаются — собираем из самих туров.
  const tourTypes = useMemo(() => {
    const seen = new Map<number, Tour>();
    for (const tour of tours) {
      if (!seen.has(tour.tour_type_id)) seen.set(tour.tour_type_id, tour);
    }
    return Array.from(seen.values()).map((tour) => ({
      id: tour.tour_type_id,
      label:
        (tour[`type_${locale}` as keyof Tour] as string) || tour.type_en || "",
    }));
  }, [tours, locale]);

  const filtered = useMemo(
    () =>
      tours.filter(
        (tour) =>
          (filters.popular === null ||
            tour.popular === (filters.popular ? 1 : 0)) &&
          (filters.tourType === null ||
            Number(tour.tour_type_id) === filters.tourType) &&
          (filters.category === null ||
            Number(tour.tour_cat_id) === filters.category) &&
          (filters.location === null ||
            Number(tour.location_id) === filters.location),
      ),
    [tours, filters],
  );

  const isFiltered = Object.values(filters).some((value) => value !== null);

  const offset = currentPage * ITEMS_PER_PAGE;
  const displayTours = filtered.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    filtersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /*
   * Размеры задаются через gap и flex-1, а не через space-x/space-y и
   * фиксированную w-56. Прежняя разметка меняла направление на lg, а отступы —
   * на md, поэтому между 768 и 1024 пикселями поля стояли столбиком с нулевым
   * зазором и лишним отступом слева. Поля теперь делят ширину поровну, и строка
   * держится ровно независимо от длины перевода.
   */
  const filterForm = (
    <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
      <SelectField
        label={t("all-tours")}
        value={filters.popular === null ? "" : filters.popular ? "1" : "0"}
        onChange={(value) =>
          set("popular", value === "" ? null : value === "1")
        }
      >
        <option value="">{t("all-tours")}</option>
        <option value="1">{t("popular")}</option>
      </SelectField>

      <SelectField
        label={t("all-types")}
        value={filters.tourType ?? ""}
        onChange={(value) => set("tourType", value ? Number(value) : null)}
      >
        <option value="">{t("all-types")}</option>
        {tourTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.label}
          </option>
        ))}
      </SelectField>

      <SelectField
        label={t("all-categories")}
        value={filters.category ?? ""}
        onChange={(value) => set("category", value ? Number(value) : null)}
      >
        <option value="">{t("all-categories")}</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat[`cat_${locale}`] ?? cat.cat_en}
          </option>
        ))}
      </SelectField>

      <SelectField
        label={t("all-locations")}
        value={filters.location ?? ""}
        onChange={(value) => set("location", value ? Number(value) : null)}
      >
        <option value="">{t("all-locations")}</option>
        {locations.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {loc[`location_${locale}`] ?? loc.location_en}
          </option>
        ))}
      </SelectField>

      {/*
       * Сброс — действие второстепенное, поэтому контурная кнопка, а не
       * заливка. Раньше стояло w-full: в строке это разворачивало её на всю
       * свободную ширину, и кнопка получалась крупнее всех полей вместе.
       * shrink-0 держит её по размеру текста, а в колонке (модалка на телефоне)
       * она растягивается сама.
       * Пока ничего не выбрано, сбрасывать нечего — кнопка неактивна.
       */}
      <button
        type="button"
        onClick={() => setFilters(EMPTY_FILTERS)}
        disabled={!isFiltered}
        className={`${PoppinFont.className} shrink-0 rounded-full border border-tile px-6 py-2.5 text-sm text-tile transition-colors hover:bg-tile hover:text-white disabled:cursor-default disabled:border-sand disabled:text-inkMuted disabled:hover:bg-transparent disabled:hover:text-inkMuted`}
      >
        {t("reset")}
      </button>
    </div>
  );

  return (
    <>
      <div ref={filtersRef} className="scroll-mt-24">
        {/*
         * Панель висит над нижним краем баннера. py-10 делали её выше, чем сама
         * строка полей, из-за чего карточка выглядела пустой коробкой;
         * достаточно ровных отступов вокруг одной строки.
         */}
        <div className="hidden lg:flex container mx-auto px-5 justify-center -mt-16 z-20 relative mb-10">
          <div className="w-full max-w-[1200px] rounded-xl bg-white px-6 py-5 shadow-lg ring-1 ring-sand">
            {filterForm}
          </div>
        </div>

        <div className="flex lg:hidden justify-end px-5 mt-4">
          <button
            type="button"
            aria-label={t("filter")}
            onClick={() => setMobileFilterOpen(true)}
            className="p-2 border rounded-full"
          >
            <FiFilter size={24} />
          </button>
        </div>
      </div>

      {isMobileFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 p-6 rounded-lg relative">
            <button
              type="button"
              // Крестик закрывает окно, а озвучивался как «Сбросить фильтры» —
              // для читающих с экрана это была противоположная по смыслу команда.
              aria-label={t("close")}
              className="absolute top-3 right-3 text-inkMuted transition-colors hover:text-ink"
              onClick={() => setMobileFilterOpen(false)}
            >
              <IoClose size={28} />
            </button>
            <h2 className={`${PoppinFont.className} mb-4 text-lg font-bold text-ink`}>
              {t("filter")}
            </h2>
            {filterForm}
            <button
              type="button"
              className={`${PoppinFont.className} mt-5 w-full rounded-full bg-tile py-2.5 text-sm text-white transition-colors hover:bg-tileDark`}
              onClick={() => setMobileFilterOpen(false)}
            >
              {t("search")}
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto py-2 px-5">
        {displayTours.length ? (
          <TourCards tours={displayTours} />
        ) : (
          <p className="text-center py-10 text-gray-500">{tc("noTours")}</p>
        )}
      </div>

      {pageCount > 1 && (
        <div className="flex justify-center my-8">
          <ReactPaginate
            pageCount={pageCount}
            forcePage={currentPage}
            onPageChange={handlePageClick}
            containerClassName="flex space-x-2"
            pageClassName="border rounded cursor-pointer"
            pageLinkClassName="block px-3 py-1 cursor-pointer"
            previousClassName={
              currentPage > 0 ? "border rounded cursor-pointer" : "hidden"
            }
            previousLinkClassName="block px-3 py-1 cursor-pointer"
            nextClassName={
              currentPage < pageCount - 1
                ? "border rounded cursor-pointer"
                : "hidden"
            }
            nextLinkClassName="block px-3 py-1 cursor-pointer"
            breakClassName="px-3 py-1"
            activeClassName="main-background-color text-white"
            previousLabel={currentPage > 0 ? "<" : null}
            nextLabel={currentPage < pageCount - 1 ? ">" : null}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
          />
        </div>
      )}
    </>
  );
}
