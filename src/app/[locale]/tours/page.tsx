import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import DiscoverMain from "@/Components/Discover/DiscoverMain";
import ToursCatalog from "@/Components/Tours/ToursCatalog";
import BreadcrumbJsonLd from "@/Components/Seo/BreadcrumbJsonLd";
import {
  getTourCategories,
  getTourLocations,
  getTours,
} from "@/lib/api/catalog";
import { SITE_NAME, alternatesFor } from "@/lib/site";
import { routing } from "@/i18n/routing";

// Next разбирает конфиг сегмента статически, поэтому здесь обязателен литерал —
// импортированную константу собрать не получится (см. CATALOG_REVALIDATE).
export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  const alternates = alternatesFor(locale, "tours");

  return {
    title: t("tours.title"),
    description: t("tours.description"),
    alternates,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale,
      url: alternates.canonical,
      title: t("tours.title"),
      description: t("tours.description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("tours.title"),
      description: t("tours.description"),
    },
  };
}

export default async function ToursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Данные читаются на сервере, поэтому карточки попадают в HTML —
  // фильтры поверх них остаются клиентскими.
  const [tours, categories, locations] = await Promise.all([
    getTours(),
    getTourCategories(),
    getTourLocations(),
  ]);

  const nav = await getTranslations({ locale, namespace: "Header" });

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
      <ToursCatalog
        tours={tours}
        categories={categories}
        locations={locations}
      />
    </>
  );
}
