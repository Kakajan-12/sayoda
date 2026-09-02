import React from "react";
import { getTranslations } from "next-intl/server";
import { PoppinFont } from "@/Ui/Fonts";
import TourCards from "./TourCards";
import type { Tour } from "@/lib/api/catalog";

/**
 * Блок «Популярное» на главной. Server Component: туры приходят пропсом,
 * поэтому карточки есть в HTML. Раньше они грузились в useEffect и главная
 * отдавалась краулерам вообще без ссылок на туры.
 */
export default async function PopularCards({ tours }: { tours: Tour[] }) {
  const t = await getTranslations("SectionTitle");

  if (!tours.length) return null;

  return (
    <div className="container mx-auto px-5 py-10 md:py-20">
      <h2
        className={`${PoppinFont.className} md:mb-14 mb-10 font-bold text-xl md:text-2xl xl:text-3xl`}
      >
        {t("popular")}
      </h2>
      <TourCards tours={tours} />
    </div>
  );
}
