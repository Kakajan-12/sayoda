import React from "react";
import { Link } from "@/i18n/navigation";
import { PoppinFont } from "@/components/ui/Fonts";
import type { TaxonomyItem } from "@/lib/api/catalog";
import { localizedField } from "@/lib/api/catalog";
import { plainText } from "@/lib/utils";

/**
 * Отбор статей по категории.
 *
 * Ссылками, а не кнопками с обработчиком: у каждой категории собственный
 * адрес, поэтому её видит поисковик, её можно отправить в переписке и
 * открыть в новой вкладке. По той же причине здесь нет состояния React —
 * выбранное живёт в адресной строке, и после перезагрузки не теряется.
 *
 * Номер страницы в ссылки не переносится намеренно: сменив категорию,
 * человек начинает новый список, и седьмая страница прежнего отбора в нём
 * почти наверняка пуста.
 *
 * Пустой справочник прячет фильтр целиком: полоска с одной кнопкой «Все»
 * ничего не даёт, а место занимает.
 */
export default function BlogCategoryFilter({
  categories,
  active,
  locale,
  allLabel,
}: {
  categories: TaxonomyItem[];
  /** Выбранная категория из адреса; пусто — показаны все. */
  active?: string;
  locale: string;
  allLabel: string;
}) {
  if (!categories.length) return null;

  const chip =
    "rounded-full border px-4 py-1.5 text-sm transition-colors whitespace-nowrap";
  const on = "border-tile bg-tile text-white";
  const off = "border-sand text-ink hover:border-tileLight";

  return (
    <nav className={`${PoppinFont.className} mb-8 flex flex-wrap gap-2`}>
      <Link href="/blog" className={`${chip} ${active ? off : on}`}>
        {allLabel}
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
            href={`/blog?category=${id}`}
            className={`${chip} ${active === id ? on : off}`}
          >
            {name}
          </Link>
        );
      })}
    </nav>
  );
}
