import { notFound } from "next/navigation";
import { destField, getDestinationBySlug } from "@/lib/api/destinations";
import { ComfortaFont } from "@/Ui/Fonts";
import { getTranslations } from "next-intl/server";

export const revalidate = 300;

export default async function VisaOverviewPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  const destination = await getDestinationBySlug(country);
  if (!destination) notFound();
  const t = await getTranslations("Destinations");

  return (
    <article className={`max-w-3xl ${ComfortaFont.className}`}>
      <h2 className="text-2xl font-bold text-mainBlue border-b-2 border-mainBlue pb-2 mb-6">
        {t("tabVisa")} — {destField(destination, "name", locale)}
      </h2>
      <div
        className="rich-content text-gray-700 leading-relaxed space-y-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2"
        dangerouslySetInnerHTML={{ __html: destField(destination, "visa", locale) }}
      />
    </article>
  );
}
