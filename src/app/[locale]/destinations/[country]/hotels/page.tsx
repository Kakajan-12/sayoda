import { notFound } from "next/navigation";
import { destField, getDestinationBySlug } from "@/lib/api/destinations";
import { ComfortaFont } from "@/components/ui/Fonts";
import { getTranslations } from "next-intl/server";
import DestinationHotels from "@/components/destinations/DestinationHotels";

export const revalidate = 300;

export default async function HotelsPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  const destination = await getDestinationBySlug(country);
  if (!destination) notFound();
  const t = await getTranslations("Destinations");

  return (
    <div className={ComfortaFont.className}>
      <h2 className="text-xl sm:text-2xl font-bold text-mainBlue break-words border-b-2 border-mainBlue pb-2 mb-6">
        {t("tabHotels")} — {destField(destination, "name", locale)}
      </h2>

      <DestinationHotels country={country} />
    </div>
  );
}
