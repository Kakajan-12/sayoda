import React from "react";
import { getTranslations } from "next-intl/server";
import { IoMdCheckmarkCircleOutline, IoMdCloseCircleOutline } from "react-icons/io";
import { PoppinFont } from "@/components/ui/Fonts";
import { localizedField, type TourListItem } from "@/lib/api/catalog";

/**
 * Состав цены тура: что входит и что оплачивается отдельно.
 *
 * Серверный компонент. Раньше оба списка запрашивались из браузера, а до
 * ответа на месте секции крутилась полоса загрузки — в серверном HTML не
 * было ни заголовка, ни строк. Для туриста это первый вопрос после цены,
 * и оба сайта-референса печатают эти списки прямо в разметке.
 */
function List({
  title,
  items,
  locale,
  variant,
}: {
  title: string;
  items: TourListItem[];
  locale: string;
  variant: "include" | "exclude";
}) {
  if (!items.length) return null;

  const included = variant === "include";
  // Галочка и крестик когда-то красились одним цветом, и списки визуально
  // не различались — цвет здесь несёт смысл, а не украшает.
  const Icon = included ? IoMdCheckmarkCircleOutline : IoMdCloseCircleOutline;

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-xl bg-white px-5 py-7 ring-1 ring-sand">
      <h3 className="text-lg font-semibold text-tile lg:text-xl">{title}</h3>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <Icon
              aria-hidden
              className={`mt-0.5 h-5 w-5 shrink-0 ${included ? "text-tileMid" : "text-inkMuted"}`}
            />
            <div
              className="cms-text text-sm/relaxed lg:text-base/relaxed"
              dangerouslySetInnerHTML={{
                __html: localizedField(item, "text", locale),
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function IncludesExcludes({
  includes,
  excludes,
  locale,
}: {
  includes: TourListItem[];
  excludes: TourListItem[];
  locale: string;
}) {
  // Секция целиком без данных — мёртвый блок с двумя пустыми карточками.
  if (!includes.length && !excludes.length) return null;

  const t = await getTranslations({ locale, namespace: "TourPerPage" });

  return (
    <section id="included" className="w-full scroll-mt-24 bg-tileTint py-12 lg:py-20">
      <div className="container mx-auto px-4">
        <h2
          className={`${PoppinFont.className} text-2xl font-bold text-tile md:text-3xl 2xl:text-4xl`}
        >
          {t("whats")}
        </h2>

        {/* gap задаёт расстояние в обе стороны сразу: раньше горизонтальный
            зазор появлялся только с 768px, и между 640 и 768 карточки
            смыкались, как только текст в них становился длиннее.

            items-stretch, а не items-start: пунктов «включено» почти всегда
            больше, чем «не включено», и при выравнивании по верху правая
            карточка кончалась заметно выше левой — на классическом туре
            это 316 пикселей против 430. Два блока одного раздела, стоящие
            рядом, должны быть одной высоты. */}
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-stretch">
          <List
            title={t("include")}
            items={includes}
            locale={locale}
            variant="include"
          />
          <List
            title={t("notincluded")}
            items={excludes}
            locale={locale}
            variant="exclude"
          />
        </div>
      </div>
    </section>
  );
}
