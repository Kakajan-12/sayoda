import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  if (country !== "turkmenistan") notFound();
  const t = await getTranslations({ locale, namespace: "Visa" });

  return (
    <>
      <h2 className="text-2xl font-bold text-mainBlue border-b-2 border-mainBlue pb-2 mb-6">
        {t("crossingBorders")}
      </h2>
      <p className="text-gray-700 leading-relaxed">{t("crossingBordersText")}</p>
    </>
  );
}
