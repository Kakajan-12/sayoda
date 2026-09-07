import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import TourHero from "@/components/tours/TourHero";
import TourHighlights from "@/components/tours/TourHighlights";
import TourDepartures from "@/components/tours/TourDepartures";
import TourSectionNav from "@/components/tours/TourSectionNav";
import TourItinerary from "@/components/tours/TourItinerary";
import TourBookingCard from "@/components/tours/TourBookingCard";
import IncludesExcludes from "@/components/tours/IncludesExcludes";
import Gallery from "@/components/tours/Gallery";
import Map from "@/components/tours/Map";
import RelatedTours from "@/components/tours/RelatedTours";
import TourCta from "@/components/tours/TourCta";
import { PoppinFont } from "@/components/ui/Fonts";
import { getContacts, whatsappHref } from "@/lib/api/contacts";
import { getSettings } from "@/lib/api/settings";
import TourJsonLd from "@/components/seo/TourJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import {
  durationDays,
  getDepartures,
  getExcludes,
  getHighlights,
  getIncludes,
  getItinerary,
  getTour,
  getTourGallery,
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
  const tp = await getTranslations({ locale, namespace: "TourPerPage" });
  const tc = await getTranslations({ locale, namespace: "Contact" });
  const tourTitle = plainText(localizedField(tour, "title", locale));

  /*
   * Программа, состав цены и галерея теперь забираются здесь, а не тремя
   * запросами из браузера каждого посетителя. Всё уходит одной пачкой:
   * запросы независимы, и выстраивать их в очередь незачем.
   */
  const [
    contacts,
    settings,
    itinerary,
    includes,
    excludes,
    photos,
    highlights,
    departures,
  ] = await Promise.all([
    getContacts(locale),
    getSettings(),
    getItinerary(tour.id),
    getIncludes(tour.id),
    getExcludes(tour.id),
    getTourGallery(tour.id),
    getHighlights(tour.id),
    getDepartures(tour.id),
  ]);

  const whatsapp = whatsappHref(
    contacts,
    tc("whatsappTour", { tour: tourTitle }),
    settings.whatsapp,
  );

  const summary = localizedField(tour, "text", locale);
  const days = durationDays(localizedField(tour, "duration", locale));

  return (
    <div className="pb-20">
      <TourJsonLd tour={tour} locale={locale} />
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: t("main"), path: "" },
          { name: t("tours"), path: "tours" },
          { name: tourTitle, path: `tours/${tour.slug}` },
        ]}
      />

      <TourHero tour={tour} locale={locale} />

      <TourHighlights items={highlights} locale={locale} />

      <TourSectionNav
        locale={locale}
        hasItinerary={itinerary.length > 0}
        hasIncluded={includes.length > 0 || excludes.length > 0}
        hasDepartures={departures.length > 0}
        hasGallery={photos.length > 0}
        hasMap={Boolean(tour.map)}
      />

      {/*
        Описание и программа слева, карточка брони справа. Раньше правая
        половина под программой просто пустовала, а кнопка заявки лежала
        в самом низу страницы — за галереей и картой.

        На узких экранах карточка идёт первой (order), чтобы цена и кнопка
        попадались раньше длинного текста программы.
      */}
      <div className="container mx-auto mt-10 px-4">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <div className="order-2 min-w-0 flex-1 lg:order-1">
            {summary && (
              <section className="mb-12">
                <h2
                  className={`${PoppinFont.className} text-2xl font-bold text-tile md:text-3xl 2xl:text-4xl`}
                >
                  {tp("overview")}
                </h2>
                {/*
                  Описание выводится один раз. Прежде в разметке лежали два
                  блока с одним и тем же текстом — один для телефона, другой
                  для десктопа: скринридер читал его дважды, поисковик
                  засчитывал как повтор.
                */}
                <div
                  className="cms-text mt-5 text-base/relaxed text-ink lg:text-lg/relaxed"
                  dangerouslySetInnerHTML={{ __html: summary }}
                />
              </section>
            )}

            <TourItinerary days={itinerary} locale={locale} />
          </div>

          <aside className="order-1 w-full lg:order-2 lg:sticky lg:top-24 lg:w-[340px] lg:shrink-0">
            <TourBookingCard
              tourId={tour.id}
              tourTitle={tourTitle}
              price={tour.price}
              days={days}
              whatsappHref={whatsapp}
            />
          </aside>
        </div>
      </div>

      <div className="mt-14">
        <IncludesExcludes
          includes={includes}
          excludes={excludes}
          locale={locale}
        />
      </div>

      {/* Расписание идёт следом за составом цены: к этому месту человек уже
          знает, что входит в поездку, и вопрос у него один — когда ехать. */}
      <TourDepartures
        departures={departures}
        tourId={tour.id}
        tourTitle={tourTitle}
        tourPrice={tour.price}
        days={days}
        locale={locale}
      />

      <Gallery images={photos} tourTitle={tourTitle} />

      <Map data={tour} alt={`${tourTitle} — ${tp("routeOnMap")}`} locale={locale} />

      <RelatedTours tour={tour} locale={locale} />

      <div className="mt-14">
        <TourCta
          tourId={tour.id}
          tourTitle={tourTitle}
          whatsappHref={whatsapp}
        />
      </div>
    </div>
  );
}
