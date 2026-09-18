import type { Metadata } from "next";
import { destinationMetadata } from "@/lib/destinationMeta";
import { notFound } from "next/navigation";
import { destField, getDestinationBySlug } from "@/lib/api/destinations";
import { ComfortaFont } from "@/components/ui/Fonts";
import { getTranslations, setRequestLocale } from "next-intl/server";
import DestinationSights from "@/components/destinations/DestinationSights";

export const revalidate = 300;

/**
 * Свой заголовок и свой канонический адрес.
 *
 * Без них вкладка наследовала заголовок страны и указывала канонической
 * страницу обзора — пять разных вкладок объявляли себя одной страницей.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}): Promise<Metadata> {
  const { locale, country } = await params;
  return destinationMetadata({ locale, country, tab: "sights", path: "sights" });
}

export default async function SightsPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  setRequestLocale(locale);
  const destination = await getDestinationBySlug(country);
  if (!destination) notFound();
  const t = await getTranslations("Destinations");
  const seo = await getTranslations({ locale, namespace: "Seo" });

  return (
    <div className={ComfortaFont.className}>
      {/* Заголовок первого уровня страницы: обложка над ним — общая на всю
          страну и главным заголовком быть не может, см. HeroHeading. */}
      <h1 className="text-xl sm:text-2xl font-bold text-mainBlue break-words border-b-2 border-mainBlue pb-2 mb-6">
        {seo("destinationTab.sights.heading", {
          country: destField(destination, "name", locale),
        })}
      </h1>

      {/* Статья привязана к стране полем в админке — раньше здесь собирался
          список названий страны на трёх языках, по которым потом искали
          вхождения в тексте. Это было последнее сопоставление по тексту. */}
      <DestinationSights
        destinationId={destination.id}
        emptyLabel={t("noSights")}
      />
    </div>
  );
}
