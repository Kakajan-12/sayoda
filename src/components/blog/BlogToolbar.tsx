import React from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SearchField from "@/components/search/SearchField";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";
import { type TaxonomyItem, localizedField } from "@/lib/api/catalog";
import { plainText } from "@/lib/utils";

/**
 * Панель над списком статей: поиск, категории и число найденного.
 *
 * Раньше кнопки категорий висели сами по себе между шапкой во весь экран
 * и заголовком «Блоги»: фильтр стоял выше раздела, к которому относится,
 * в полосе пустого места, и было непонятно, к чему он. Поиска не было
 * вовсе — при большом блоге это главный способ что-то найти.
 *
 * Теперь всё в одном блоке на светлой подложке, сразу над карточками:
 * поле поиска, ряд категорий, строка с числом находок. Человек видит,
 * чем он сейчас сузил список и сколько получилось.
 *
 * Поиск и категория живут в адресе и переносятся друг за другом: ищешь
 * внутри категории — категория остаётся, меняешь категорию — запрос
 * остаётся. Иначе каждое действие молча сбрасывало бы предыдущее.
 */
export default async function BlogToolbar({
  categories,
  activeCategory,
  query,
  total,
  locale,
}: {
  categories: TaxonomyItem[];
  activeCategory: string;
  query: string;
  total: number;
  locale: string;
}) {
  const t = await getTranslations("Blog");

  const chip =
    "rounded-full border px-4 py-1.5 text-sm transition-colors whitespace-nowrap";
  const on = "border-tile bg-tile text-white";
  const off = "border-sand bg-white text-ink hover:border-tileLight";

  /** Адрес категории с сохранённым запросом. */
  const categoryHref = (id?: string) => {
    const params = new URLSearchParams();
    if (id) params.set("category", id);
    if (query) params.set("q", query);
    const search = params.toString();
    return search ? `/blog?${search}` : "/blog";
  };

  const filtered = Boolean(activeCategory || query);

  return (
    <section className="border-b border-sand bg-sandLight">
      <div className="container mx-auto px-5 py-6 md:py-8">
        <div className="max-w-2xl">
          <SearchField
            initial={query}
            placeholder={t("searchPlaceholder")}
            label={t("searchLabel")}
            basePath="/blog"
            keep={{ category: activeCategory || undefined }}
          />
        </div>

        {categories.length > 0 && (
          <nav className={`${PoppinFont.className} mt-5 flex flex-wrap gap-2`}>
            <Link
              href={categoryHref()}
              className={`${chip} ${activeCategory ? off : on}`}
            >
              {t("allCategories")}
            </Link>

            {categories.map((category) => {
              const id = String(category.id);
              const name = plainText(localizedField(category, "cat", locale));
              // Категория без названия на всех языках — в фильтре это пустая
              // кнопка, по которой непонятно, что откроется.
              if (!name) return null;

              return (
                <Link
                  key={id}
                  href={categoryHref(id)}
                  className={`${chip} ${activeCategory === id ? on : off}`}
                >
                  {name}
                </Link>
              );
            })}
          </nav>
        )}

        {/*
          Строку с числом показываем только когда список сужен. На полном
          списке «найдено: 12» ничего не сообщает — это и есть весь блог.
        */}
        {filtered && (
          <p className={`${QuicksandFont.className} mt-4 text-sm text-inkMuted`}>
            {total > 0 ? t("foundCount", { count: total }) : t("nothingFound")}
            {(query || activeCategory) && (
              <>
                {" · "}
                <Link href="/blog" className="text-tile underline">
                  {t("resetFilters")}
                </Link>
              </>
            )}
          </p>
        )}
      </div>
    </section>
  );
}
