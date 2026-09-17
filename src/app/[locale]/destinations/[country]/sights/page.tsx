import { notFound } from "next/navigation";
import { destField, getDestinationBySlug } from "@/lib/api/destinations";
import { ComfortaFont } from "@/components/ui/Fonts";
import { getTranslations, setRequestLocale } from "next-intl/server";
import DestinationSights from "@/components/destinations/DestinationSights";

export const revalidate = 300;

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

  return (
    <div className={ComfortaFont.className}>
      <h2 className="text-xl sm:text-2xl font-bold text-mainBlue break-words border-b-2 border-mainBlue pb-2 mb-6">
        {t("tabSights")} — {destField(destination, "name", locale)}
      </h2>

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
