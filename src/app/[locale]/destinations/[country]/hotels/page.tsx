import { notFound } from "next/navigation";
import { getDestination, localize } from "@/data/destinations";
import { ComfortaFont } from "@/Ui/Fonts";
import { getTranslations } from "next-intl/server";
import DestinationHotels from "@/Components/Destinations/DestinationHotels";

export default async function HotelsPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  const destination = getDestination(country);
  if (!destination) notFound();
  const t = await getTranslations("Destinations");

  return (
    <div className={ComfortaFont.className}>
      <h2 className="text-2xl font-bold text-mainBlue border-b-2 border-mainBlue pb-2 mb-6">
        {t("tabHotels")} — {localize(destination.name, locale)}
      </h2>

      <DestinationHotels country={country} />
    </div>
  );
}
