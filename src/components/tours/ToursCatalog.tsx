"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import ReactPaginate from "react-paginate";
import { FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import TourCards from "@/components/home/TourCards";
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

  const offset = currentPage * ITEMS_PER_PAGE;
  const displayTours = filtered.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    filtersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filterForm = (
    <div className="flex flex-col lg:flex-row justify-between items-center w-full space-y-4 md:space-y-0 md:space-x-4">
      <select
        aria-label={t("all-tours")}
        value={filters.popular === null ? "" : filters.popular ? "1" : "0"}
        onChange={(e) =>
          set("popular", e.target.value === "" ? null : e.target.value === "1")
        }
        className="border p-2 rounded-md w-56 h-12"
      >
        <option value="">{t("all-tours")}</option>
        <option value="1">{t("popular")}</option>
      </select>

      <select
        aria-label={t("all-types")}
        value={filters.tourType ?? ""}
        onChange={(e) =>
          set("tourType", e.target.value ? Number(e.target.value) : null)
        }
        className="border p-2 rounded-md w-56 h-12"
      >
        <option value="">{t("all-types")}</option>
        {tourTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.label}
          </option>
        ))}
      </select>

      <select
        aria-label={t("all-categories")}
        value={filters.category ?? ""}
        onChange={(e) =>
          set("category", e.target.value ? Number(e.target.value) : null)
        }
        className="border p-2 rounded-md w-56 h-12"
      >
        <option value="">{t("all-categories")}</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat[`cat_${locale}`] ?? cat.cat_en}
          </option>
        ))}
      </select>

      <select
        aria-label={t("all-locations")}
        value={filters.location ?? ""}
        onChange={(e) =>
          set("location", e.target.value ? Number(e.target.value) : null)
        }
        className="border p-2 rounded-md w-56 h-12"
      >
        <option value="">{t("all-locations")}</option>
        {locations.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {loc[`location_${locale}`] ?? loc.location_en}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => setFilters(EMPTY_FILTERS)}
        className="border w-full py-2 rounded-md h-12 main-background-color text-white"
      >
        {t("reset")}
      </button>
    </div>
  );

  return (
    <>
      <div ref={filtersRef} className="scroll-mt-24">
        <div className="hidden lg:flex container mx-auto px-5 justify-center -mt-16 z-20 relative mb-10">
          <div className="flex justify-center w-full max-w-[1200px] space-x-4 bg-white shadow rounded py-10 px-5">
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
              aria-label={t("reset")}
              className="absolute top-3 right-3 text-gray-500"
              onClick={() => setMobileFilterOpen(false)}
            >
              <IoClose size={28} />
            </button>
            <h2 className="text-lg font-bold mb-4">{t("filter")}</h2>
            {filterForm}
            <button
              type="button"
              className="mt-4 w-full py-2 rounded bg-mainBlue text-white"
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
