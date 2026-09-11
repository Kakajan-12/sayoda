import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import DiscoverMain from "@/components/destinations/DiscoverMain";
import ToursFilters from "@/components/tours/ToursFilters";
import TourCards from "@/components/home/TourCards";
import PageLinks from "@/components/ui/PageLinks";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import {
  PER_PAGE,
  getTourCategories,
  getTourLocations,
  getTourTypes,
  getToursPage,
} from "@/lib/api/catalog";
import { SITE_NAME, alternatesFor } from "@/lib/site";

// Литерал обязателен: конфиг сегмента разбирается статически.
export const revalidate = 300;

/*
 * generateStaticParams убран намеренно.
 *
 * Страница читает параметры отбора из адреса, поэтому заранее собрать её
 * нельзя — вариантов столько же, сколько сочетаний фильтров. Карточки
 * по-прежнему попадают в серверную разметку, так что для краулера ничего
 * не изменилось: динамический рендер и пустая страница — разные вещи.
 */

type Search = Record<string, string | string[] | undefined>;

/** Берём первое значение: ?type=1&type=2 не должно ломать разбор. */
const one = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? "";

const asId = (value: string) => {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
};

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Search>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = Math.max(1, Number.parseInt(one((await searchParams).page), 10) || 1);
  const t = await getTranslations({ locale, namespace: "Seo" });
  const alternates = alternatesFor(locale, "tours");

  /*
   * У второй и дальше страниц заголовок с номером, а канонический адрес —
   * их собственный. Указывать канонической первую страницу нельзя: тогда
   * поисковик считает содержимое дублем и вторая половина каталога
   * выпадает из выдачи.
   */
  const title = page > 1 ? `${t("tours.title")} — ${page}` : t("tours.title");
  const canonical =
    page > 1 ? `${alternates.canonical}?page=${page}` : alternates.canonical;

  return {
    title,
    description: t("tours.description"),
    alternates: { ...alternates, canonical },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale,
      url: canonical,
      title,
      description: t("tours.description"),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: t("tours.description"),
    },
  };
}

export default async function ToursPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Search>;
}) {
  const { locale } = await params;
  const search = await searchParams;

  const values = {
    type: one(search.type),
    cat: one(search.cat),
    destination: one(search.destination),
    popular: one(search.popular),
    /*
     * Запрос из поиска по сайту. Каталог принимает его наравне с
     * фильтрами, чтобы ссылка «показать все туры» со страницы поиска
     * вела в каталог с тем же отбором, а не сбрасывала его.
     *
     * Длину режем: значение приходит из адреса.
     */
    q: one(search.q).slice(0, 100),
  };
  const page = Math.max(1, Number.parseInt(one(search.page), 10) || 1);

  /*
   * Сервер отбирает и режет на страницы сам. Раньше сюда приезжал весь
   * каталог, а браузер показывал из него восемь карточек: пока туров
   * десяток — незаметно, на сотнях это лишняя работа при каждом заходе.
   */
  const [{ items, total }, types, categories, destinations] = await Promise.all([
    getToursPage({
      page,
      perPage: PER_PAGE,
      type: asId(values.type),
      cat: asId(values.cat),
      destination: asId(values.destination),
      popular: values.popular === "1",
      q: values.q,
    }),
    getTourTypes(),
    getTourCategories(),
    getTourLocations(),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / PER_PAGE));
  const nav = await getTranslations({ locale, namespace: "Header" });
  const common = await getTranslations({ locale, namespace: "Common" });
  const filterLabels = await getTranslations({ locale, namespace: "Filter" });

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: nav("main"), path: "" },
          { name: nav("tours"), path: "tours" },
        ]}
      />
      <DiscoverMain />

      <ToursFilters
        values={values}
        types={types.map((item) => ({
          id: Number(item.id),
          label: String(item[`type_${locale}`] ?? item.type_en ?? ""),
        }))}
        categories={categories}
        destinations={destinations}
      />

      <div className="container mx-auto py-2 px-5">
        {items.length ? (
          <TourCards tours={items} />
        ) : (
          <p className="text-center py-10 text-gray-500">{common("noTours")}</p>
        )}
      </div>

      <PageLinks
        page={page}
        pageCount={pageCount}
        basePath="/tours"
        params={values}
        label={filterLabels("filter")}
      />
    </>
  );
}
