import { notFound } from "next/navigation";
import { getDestination, localize } from "@/data/destinations";
import { ComfortaFont } from "@/Ui/Fonts";
import { getTranslations } from "next-intl/server";
import DestinationSights from "@/Components/Destinations/DestinationSights";

const stripHtml = (s: string) => s.replace(/<[^>]+>/g, "");

export default async function SightsPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  const destination = getDestination(country);
  if (!destination) notFound();
  const t = await getTranslations("Destinations");

  // Blogs are not country-tagged in the API, so we match strictly on the
  // country name (en/ru/tk) and slug. Countries without their own articles
  // (currently every country except Turkmenistan) show an empty state.
  const keywords = Array.from(
    new Set(
      [destination.slug, ...Object.values(destination.name)]
        .map((value) => stripHtml(value).toLowerCase().trim())
        .filter(Boolean),
    ),
  );

  return (
    <div className={ComfortaFont.className}>
      <h2 className="text-2xl font-bold text-mainBlue border-b-2 border-mainBlue pb-2 mb-6">
        {t("tabSights")} — {localize(destination.name, locale)}
      </h2>

      <DestinationSights keywords={keywords} emptyLabel={t("noSights")} />
    </div>
  );
}
