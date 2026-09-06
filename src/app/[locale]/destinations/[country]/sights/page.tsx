import { notFound } from "next/navigation";
import { destField, getDestinationBySlug } from "@/lib/api/destinations";
import { ComfortaFont } from "@/components/ui/Fonts";
import { getTranslations } from "next-intl/server";
import DestinationSights from "@/components/destinations/DestinationSights";

const stripHtml = (s: string) => s.replace(/<[^>]+>/g, "");

export const revalidate = 300;

export default async function SightsPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  const destination = await getDestinationBySlug(country);
  if (!destination) notFound();
  const t = await getTranslations("Destinations");

  // У статей в базе нет привязки к стране, поэтому отбор идёт по вхождению
  // названия страны в текст. Страны без своих статей показывают пустой блок.
  // Это единственное оставшееся сопоставление по тексту: чтобы убрать и его,
  // нужно поле «страна» у статьи — отдельная задача.
  const keywords = Array.from(
    new Set(
      [
        destination.slug,
        destField(destination, "name", "en"),
        destField(destination, "name", "ru"),
        destField(destination, "name", "tk"),
      ]
        .map((value) => stripHtml(value).toLowerCase().trim())
        .filter(Boolean),
    ),
  );

  return (
    <div className={ComfortaFont.className}>
      <h2 className="text-xl sm:text-2xl font-bold text-mainBlue break-words border-b-2 border-mainBlue pb-2 mb-6">
        {t("tabSights")} — {destField(destination, "name", locale)}
      </h2>

      <DestinationSights keywords={keywords} emptyLabel={t("noSights")} />
    </div>
  );
}
