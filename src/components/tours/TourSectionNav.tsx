import React from "react";
import { getTranslations } from "next-intl/server";

/**
 * Ссылки на разделы страницы тура.
 *
 * Такая полоса есть у stantrips («itinerary / what is included / trip map»)
 * и решает простую задачу: страница тура длинная, а вопрос у человека
 * обычно один — что по дням или что входит в цену. Пролистывать всё ради
 * этого не нужно.
 *
 * Полоса не липкая намеренно. Шапка сайта прилипает сверху и меняет высоту
 * при прокрутке, так что вторая липкая полоса под ней требует точного
 * отступа, который без проверки в браузере угадывать нельзя — наехавшая на
 * меню панель хуже, чем её отсутствие. Отступ scroll-mt у самих разделов
 * при этом учитывает прилипшую шапку, так что переходы попадают точно.
 */
export default async function TourSectionNav({
  locale,
  hasItinerary,
  hasIncluded,
  hasDepartures,
  hasGallery,
  hasMap,
}: {
  locale: string;
  hasItinerary: boolean;
  hasIncluded: boolean;
  hasDepartures: boolean;
  hasGallery: boolean;
  hasMap: boolean;
}) {
  const t = await getTranslations({ locale, namespace: "SectionTitle" });
  const tp = await getTranslations({ locale, namespace: "TourPerPage" });

  const links = [
    hasItinerary && { href: "#itinerary", label: t("itinerary") },
    hasIncluded && { href: "#included", label: tp("include") },
    hasDepartures && { href: "#departures", label: tp("dates") },
    hasGallery && { href: "#gallery", label: t("gallery") },
    hasMap && { href: "#map", label: t("map") },
  ].filter(Boolean) as { href: string; label: string }[];

  // Одна ссылка — это не навигация, а лишняя полоса.
  if (links.length < 2) return null;

  return (
    <nav
      aria-label={tp("overview")}
      className="container mx-auto mt-8 px-4"
    >
      {/* Горизонтальная прокрутка вместо переноса: на телефоне четыре
          вкладки в столбик заняли бы пол-экрана перед содержимым. */}
      <ul className="flex gap-2 overflow-x-auto border-b border-sand pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {links.map((link) => (
          <li key={link.href} className="shrink-0">
            <a
              href={link.href}
              className="block whitespace-nowrap border-b-2 border-transparent px-4 py-3 font-medium text-inkMuted transition-colors hover:border-brick hover:text-tile focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tileLight"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
