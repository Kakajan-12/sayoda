import React from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SearchField from "@/components/search/SearchField";
import BlogsFilters from "@/components/blog/BlogsFilters";
import { QuicksandFont } from "@/components/ui/Fonts";
import { type TaxonomyItem } from "@/lib/api/catalog";
import { type Destination } from "@/lib/api/destinations";

/**
 * Панель над списком статей: поиск, фильтры и число найденного.
 *
 * Раньше кнопки категорий висели сами по себе между шапкой во весь экран
 * и заголовком «Блоги»: фильтр стоял выше раздела, к которому относится,
 * в полосе пустого места, и было непонятно, к чему он. Поиска не было
 * вовсе — при большом блоге это главный способ что-то найти.
 *
 * Панель повторяет ту, что у каталога туров: белая карточка приподнята на
 * обложку отрицательным отступом, у неё тень и светлая рамка. Так фильтр
 * читается как отдельный орган управления списком, а не как ещё одна
 * полоса текста между обложкой и карточками. Заодно два раздела сайта
 * перестали выглядеть сделанными разными руками.
 *
 * Поиск и фильтры стоят в один ряд на широком экране и столбиком на узком.
 * Раньше они были двумя ярусами и занимали лишние сто пикселей высоты —
 * на телефоне это выталкивало первую статью за нижний край.
 *
 * Сами фильтры устроены как у туров — выпадающие списки с галочками, а не
 * ряд кнопок-чипов, как было. Разница не только в виде: чипами выбиралась
 * ровно одна категория, а списками можно отметить несколько, и добавилась
 * вторая ось — страна.
 *
 * Поиск и фильтры живут в адресе и переносятся друг за другом: ищешь
 * внутри категории — категория остаётся, меняешь категорию — запрос
 * остаётся. Иначе каждое действие молча сбрасывало бы предыдущее.
 */
export default async function BlogToolbar({
  categories,
  destinations,
  activeCategories,
  activeDestinations,
  query,
  total,
}: {
  categories: TaxonomyItem[];
  destinations: Destination[];
  /** Отмеченные категории, как они пришли из адреса. */
  activeCategories: string[];
  activeDestinations: string[];
  query: string;
  total: number;
}) {
  const t = await getTranslations("Blog");

  const filtered = Boolean(
    activeCategories.length || activeDestinations.length || query,
  );

  return (
    <div className="relative z-20 container mx-auto -mt-8 mb-10 px-5 sm:-mt-10">
      <div className="rounded-2xl bg-white px-5 py-5 shadow-lg ring-1 ring-sand md:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          {/*
            Поиск занимает треть ряда и не ужимается ниже: строку запроса
            надо видеть целиком, а названия категорий короткие и переживут
            обрезку многоточием.
          */}
          <div className="w-full lg:w-[34%] lg:shrink-0">
            <SearchField
              compact
              initial={query}
              placeholder={t("searchPlaceholder")}
              label={t("searchLabel")}
              basePath="/blog"
              /*
                Отбор переносим в адрес вместе с запросом — списками через
                запятую, в том же виде, в каком его читает страница.
              */
              keep={{
                category: activeCategories.join(",") || undefined,
                destination: activeDestinations.join(",") || undefined,
              }}
            />
          </div>

          {/* Разделитель между поиском и фильтрами: они делают разное —
              один ищет по словам, другие сужают список по признакам. */}
          <div
            aria-hidden
            className="hidden h-8 w-px shrink-0 bg-sand lg:block"
          />

          <div className="min-w-0 flex-1">
            <BlogsFilters
              values={{
                category: activeCategories,
                destination: activeDestinations,
                q: query,
              }}
              categories={categories}
              destinations={destinations}
            />
          </div>
        </div>

        {/*
          Строку с числом показываем только когда список сужен. На полном
          списке «найдено: 12» ничего не сообщает — это и есть весь блог.

          Отделена чертой сверху: это итог действия, а не ещё одно поле
          управления, и без черты она читалась как подпись к фильтрам.
        */}
        {filtered && (
          <p
            className={`${QuicksandFont.className} mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-sand pt-3 text-sm text-inkMuted`}
          >
            <span className={total > 0 ? "text-ink" : "text-brick"}>
              {total > 0 ? t("foundCount", { count: total }) : t("nothingFound")}
            </span>
            <span aria-hidden>·</span>
            <Link
              href="/blog"
              className="text-tile underline underline-offset-2 transition-colors hover:text-tileLight"
            >
              {t("resetFilters")}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
