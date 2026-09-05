import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import SilkRoad from "@/Components/TourPerPage/SilkRoad";
import AccordionTour from "@/Components/TourPerPage/AccordionTour";
import IncludesExcludes from "@/Components/TourPerPage/IncludesExcludes";
import Gallery from "@/Components/TourPerPage/Gallery";
import Map from "@/Components/TourPerPage/Map";
import TourCta from "@/Components/TourPerPage/TourCta";
import { getContacts, whatsappHref } from "@/lib/api/contacts";
import { getSettings } from "@/lib/api/settings";
import TourJsonLd from "@/Components/Seo/TourJsonLd";
import BreadcrumbJsonLd from "@/Components/Seo/BreadcrumbJsonLd";
import {
  durationDays,
  getTour,
  getTours,
  localizedField,
  mediaUrl,
} from "@/lib/api/catalog";
import { SITE_NAME, alternatesFor } from "@/lib/site";
import { excerpt, plainText } from "@/lib/utils";
import { routing } from "@/i18n/routing";

// Литерал обязателен: конфиг сегмента разбирается статически.
export const revalidate = 300;

/** Предрендерим все туры во всех локалях — их десятки, не тысячи. */

/**
 * Числовой адрес — это старый /tours/16. Отдаём 404, а не страницу: иначе
 * один и тот же тур жил бы по двум адресам, и поисковик считал бы это
 * дублем. Редиректа нет намеренно — ссылки на числовые адреса никуда
 * не отправлялись.
 */
const isNumericId = (value: string) => /^\d+$/.test(value);

export async function generateStaticParams() {
  const tours = await getTours();
  // Запись без слага пропускаем: она не должна ронять сборку целиком.
  const withSlug = tours.filter((tour) => Boolean(tour.slug));
  return routing.locales.flatMap((locale) =>
    withSlug.map((tour) => ({ locale, slug: tour.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  if (isNumericId(slug)) return {};
  const tour = await getTour(slug);
  if (!tour) return {};

  const t = await getTranslations({ locale, namespace: "Seo" });
  const name = plainText(localizedField(tour, "title", locale));
  const days = durationDays(localizedField(tour, "duration", locale));

  // "Ancient Treasures of Turkmenistan — 3 Days in Turkmenistan"
  const country = plainText(localizedField(tour, "location", locale));
  const title = [name, days ? t("days", { count: days }) : null, country]
    .filter(Boolean)
    .join(" — ");

  const body = excerpt(localizedField(tour, "text", locale), 140);
  const description = tour.price
    ? `${body} From $${tour.price} per person.`
    : body || t("tourFallbackDescription");

  const image = mediaUrl(tour.image);
  const alternates = alternatesFor(locale, `tours/${tour.slug}`);

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      locale,
      url: alternates.canonical,
      title,
      description,
      images: image ? [{ url: image, alt: name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  if (isNumericId(slug)) notFound();
  const tour = await getTour(slug);
  if (!tour) notFound();

  const t = await getTranslations({ locale, namespace: "Header" });
  const tc = await getTranslations({ locale, namespace: "Contact" });
  const tourTitle = plainText(localizedField(tour, "title", locale));

  const [contacts, settings] = await Promise.all([
    getContacts(locale),
    getSettings(),
  ]);
  const whatsapp = whatsappHref(
    contacts,
    tc("whatsappTour", { tour: tourTitle }),
    settings.whatsapp,
  );

  return (
    <div className="pb-24">
      <TourJsonLd tour={tour} locale={locale} />
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: t("main"), path: "" },
          { name: t("tours"), path: "tours" },
          { name: tourTitle, path: `tours/${tour.slug}` },
        ]}
      />
      <SilkRoad data={tour} locale={locale} />
      <AccordionTour tourId={tour.id} />
      <IncludesExcludes tourId={tour.id} />
      <Gallery tourId={tour.id} />
      <Map data={tour} alt={`${tourTitle} — route map`} />
      <TourCta
        tourId={tour.id}
        tourTitle={tourTitle}
        whatsappHref={whatsapp}
      />
    </div>
  );
}
