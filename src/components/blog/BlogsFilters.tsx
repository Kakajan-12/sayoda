"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useRouter } from "@/i18n/navigation";
import MultiSelect from "@/components/ui/MultiSelect";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";
import type { TaxonomyItem } from "@/lib/api/catalog";
import { destField, type Destination } from "@/lib/api/destinations";

/**
 * Фильтры блога — устроены так же, как у туров.
 *
 * Раньше категории были рядом кнопок-чипов: выбрать можно было только одну,
 * и с ростом их числа ряд расползался на несколько строк. Теперь выпадающие
 * списки с галочками, и отметить можно сколько угодно: «города или еда».
 *
 * Вторая ось — страна. Она появилась вместе с привязкой статьи к
 * направлению (миграция 023) и до сих пор нигде не показывалась: вкладка
 * «Достопримечательности» ею пользуется, а в самом блоге отобрать статьи по
 * стране было нельзя.
 *
 * Отбор идёт на сервере: фильтр меняет адрес, страницу собирает сервер.
 * Иначе фильтровать было бы нечего — браузер видит только текущую страницу
 * выдачи, а не весь блог. Побочная польза: у отобранного списка появляется
 * собственный адрес, его можно отправить в переписке.
 *
 * На широком экране списки применяются сразу по отметке. В мобильной
 * модалке — только по кнопке «Искать»: иначе каждая галочка уходила бы на
 * сервер отдельным запросом, а список под модалкой перестраивался бы, пока
 * её ещё не закрыли.
 *
 * Поисковый запрос живёт рядом и не теряется при смене фильтров: он не
 * входит в набор осей, но переносится в новый адрес отдельно. Номер
 * страницы, наоборот, сбрасывается — на четвёртой странице прежней выборки
 * в новой может не быть ничего.
 */

export interface BlogsFilterValues {
  /** Категории статьи. Списком: отмечено может быть несколько. */
  category: string[];
  /** Страны. Тоже списком. */
  destination: string[];
  /**
   * Запрос из поля поиска. Поля для него в самом фильтре нет — фильтр
   * только не теряет его при смене условий.
   */
  q?: string;
}

const EMPTY = { category: [], destination: [] };

export default function BlogsFilters({
  values,
  categories,
  destinations,
}: {
  values: BlogsFilterValues;
  categories: TaxonomyItem[];
  destinations: Destination[];
}) {
  const t = useTranslations("Filter");
  const tb = useTranslations("Blog");
  const locale = useLocale();
  const router = useRouter();
  const [isMobileOpen, setMobileOpen] = useState(false);
  // Черновик модалки: копится, пока человек расставляет галочки.
  const [draft, setDraft] = useState<BlogsFilterValues>(values);

  const apply = (next: Partial<BlogsFilterValues>) => {
    const merged = { ...values, ...next };
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(merged)) {
      // Массив уходит списком через запятую, строка — как есть.
      const text = Array.isArray(value) ? value.join(",") : value;
      if (text) search.set(key, text);
    }
    const query = search.toString();
    // scroll: false — список сам подставится под фильтром, а перескок
    // страницы наверх сбивает при переборе вариантов.
    router.push(query ? `/blog?${query}` : "/blog", { scroll: false });
  };

  const openMobile = () => {
    // Черновик каждый раз начинается с того, что уже применено: иначе
    // модалка показывала бы «весь блог» при включённом фильтре.
    setDraft(values);
    setMobileOpen(true);
  };

  const catOptions = categories
    .map((item) => ({
      value: String(item.id),
      label: String(item[`cat_${locale}`] ?? item.cat_en ?? ""),
    }))
    // Категория без названия на всех языках — пустая строка в списке, по
    // которой непонятно, что откроется.
    .filter((item) => item.label.trim());

  // Названия берём тем же помощником, что и остальные страницы: у направления
  // свой тип с полями name_ru / name_en / name_tk и запасным языком.
  const destinationOptions = destinations
    .map((item) => ({
      value: String(item.id),
      label: destField(item, "name", locale),
    }))
    .filter((item) => item.label.trim());

  /**
   * Одна и та же разметка на оба случая. Различается только то, куда уходит
   * выбор: сразу в адрес или в черновик.
   */
  const renderForm = (
    current: BlogsFilterValues,
    onChange: (next: Partial<BlogsFilterValues>) => void,
  ) => {
    const isFiltered = Boolean(
      current.category.length || current.destination.length,
    );

    return (
      <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
        {catOptions.length > 0 && (
          <MultiSelect
            label={tb("categoryLabel")}
            emptyLabel={t("all-categories")}
            values={current.category}
            options={catOptions}
            onChange={(value) => onChange({ category: value })}
          />
        )}

        {destinationOptions.length > 0 && (
          <MultiSelect
            label={t("group-location")}
            emptyLabel={t("all-locations")}
            values={current.destination}
            options={destinationOptions}
            onChange={(value) => onChange({ destination: value })}
          />
        )}

        <button
          type="button"
          onClick={() => onChange(EMPTY)}
          disabled={!isFiltered}
          className={`${PoppinFont.className} shrink-0 rounded-full border border-tile px-6 py-2.5 text-sm text-tile transition-colors hover:bg-tile hover:text-white disabled:cursor-default disabled:border-sand disabled:text-inkMuted disabled:hover:bg-transparent disabled:hover:text-inkMuted`}
        >
          {t("reset")}
        </button>
      </div>
    );
  };

  // Ни одной оси с вариантами — показывать нечего.
  if (!catOptions.length && !destinationOptions.length) return null;

  /** Сколько галочек стоит сейчас — для подписи мобильной кнопки. */
  const выбрано = values.category.length + values.destination.length;

  return (
    <>
      <div className="hidden lg:block">{renderForm(values, apply)}</div>

      {/*
        На узком экране — одна кнопка во всю ширину вместо значка в углу.
        Значок читался как украшение: по нему не было видно ни что он
        открывает, ни того, что фильтр уже включён. Теперь есть подпись, а
        число выбранного показано кружком — как в списках выше.
      */}
      <button
        type="button"
        onClick={openMobile}
        className={`${QuicksandFont.className} flex w-full items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm transition-colors lg:hidden ${
          выбрано
            ? "border-tile text-tile"
            : "border-sand text-ink hover:border-tileLight"
        }`}
      >
        <FiFilter size={18} aria-hidden />
        {t("filter")}
        {выбрано > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-tile px-1.5 text-xs font-semibold text-white">
            {выбрано}
          </span>
        )}
      </button>

      {/* bg-black/50 вместо пары bg-black + bg-opacity-50: утилиты
          *-opacity-* в v4 удалены, и прозрачность фона просто переставала бы
          работать — подложка вышла бы сплошной чёрной. */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-11/12 rounded-lg bg-white p-6">
            <button
              type="button"
              aria-label={t("close")}
              className="absolute right-3 top-3 text-inkMuted transition-colors hover:text-ink"
              onClick={() => setMobileOpen(false)}
            >
              <IoClose size={28} />
            </button>
            <h2 className={`${PoppinFont.className} mb-4 text-lg font-bold text-ink`}>
              {t("filter")}
            </h2>

            {renderForm(draft, (next) =>
              setDraft((prev) => ({ ...prev, ...next })),
            )}

            <button
              type="button"
              className={`${PoppinFont.className} mt-5 w-full rounded-full bg-tile py-2.5 text-sm text-white transition-colors hover:bg-tileDark`}
              onClick={() => {
                apply(draft);
                setMobileOpen(false);
              }}
            >
              {t("search")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
