"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useRouter } from "@/i18n/navigation";
import MultiSelect from "@/components/ui/MultiSelect";
import { PoppinFont } from "@/components/ui/Fonts";
import type { TaxonomyItem } from "@/lib/api/catalog";

/**
 * Фильтры каталога туров.
 *
 * Отбор идёт на сервере: фильтр меняет адрес, а страницу с нужными турами
 * собирает сервер. Иначе фильтровать было бы нечего — браузер видит только
 * текущую страницу выдачи, а не весь каталог. Побочная польза: отобранный
 * список получил собственный адрес, его можно отправить клиенту в переписке.
 *
 * Значений на оси может быть несколько: отметив два типа тура, человек видит
 * оба. В адресе они идут через запятую — ?type=8,9, — а на сервере
 * складываются в IN. Между осями по-прежнему И: «природные или активные, но
 * только в Туркменистане».
 *
 * На широком экране списки применяются сразу по отметке. В мобильной
 * модалке — только по кнопке «Искать»: иначе каждая галочка уходила бы на
 * сервер отдельным запросом, а список под модалкой перестраивался бы, пока
 * её ещё не закрыли.
 *
 * При смене любого условия номер страницы сбрасывается: на четвёртой
 * странице прежней выборки в новой может не быть ничего, и человек попадал
 * бы на пустой экран. Сбрасывается он сам собой — page не входит в набор
 * условий и в новый адрес просто не переносится.
 *
 * Фильтр стоит в двух местах: в общем каталоге и на вкладке «Туры» у
 * направления. Отличаются они двумя вещами — адресом, куда уходит отбор, и
 * тем, что во вкладке нет оси стран: страна там задана самим адресом.
 */

export interface ToursFilterValues {
  type: string[];
  cat: string[];
  destination: string[];
  /**
   * Сервер понимает, управления на странице нет.
   *
   * Из двенадцати туров популярными отмечены девять — такой отбор ничего не
   * отбирает. Адрес ?popular=1 оставлен рабочим, чтобы не ломать закладки.
   */
  popular: string;
  /**
   * Запрос из поиска по сайту.
   *
   * Поля для него в фильтре нет — каталог только не теряет его при смене
   * условий. Объявлен явно, чтобы не потерялся при первой же правке.
   */
  q?: string;
}

interface Props {
  values: ToursFilterValues;
  types: { id: number; label: string }[];
  categories: TaxonomyItem[];
  /**
   * Ось стран. Не передаётся там, где страна уже задана адресом: на вкладке
   * «Туры» у направления выбирать её второй раз незачем, а выбрать чужую —
   * и вовсе означало бы уйти со страницы, на которой стоишь.
   */
  destinations?: TaxonomyItem[];
  /**
   * Куда уходит отбор. По умолчанию общий каталог; вкладка страны передаёт
   * свой адрес, чтобы фильтр не выкидывал из направления.
   */
  basePath?: string;
  /**
   * Врезка в готовую вёрстку.
   *
   * В каталоге панель лежит поверх обложки — отсюда отрицательный отступ и
   * собственный контейнер. Внутри вкладки и то, и другое лишнее: контейнер
   * уже есть, а наезжать не на что.
   */
  inset?: boolean;
}

const EMPTY = { type: [], cat: [], destination: [] };

export default function ToursFilters({
  values,
  types,
  categories,
  destinations,
  basePath = "/tours",
  inset = false,
}: Props) {
  const t = useTranslations("Filter");
  const locale = useLocale();
  const router = useRouter();
  const [isMobileOpen, setMobileOpen] = useState(false);
  // Черновик модалки: копится, пока человек расставляет галочки.
  const [draft, setDraft] = useState<ToursFilterValues>(values);

  const apply = (next: Partial<ToursFilterValues>) => {
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
    router.push(query ? `${basePath}?${query}` : basePath, { scroll: false });
  };

  const openMobile = () => {
    // Черновик каждый раз начинается с того, что уже применено: иначе
    // модалка показывала бы «все туры» при включённом фильтре.
    setDraft(values);
    setMobileOpen(true);
  };

  const typeOptions = types.map((item) => ({
    value: String(item.id),
    label: item.label,
  }));
  const catOptions = categories.map((cat) => ({
    value: String(cat.id),
    label: String(cat[`cat_${locale}`] ?? cat.cat_en ?? ""),
  }));
  const destinationOptions = (destinations ?? []).map((item) => ({
    value: String(item.id),
    label: String(item[`location_${locale}`] ?? item.location_en ?? ""),
  }));

  /**
   * Одна и та же разметка на оба случая. Различается только то, куда уходит
   * выбор: сразу в адрес или в черновик.
   */
  const renderForm = (
    current: ToursFilterValues,
    onChange: (next: Partial<ToursFilterValues>) => void,
  ) => {
    const isFiltered = Boolean(
      current.type.length || current.cat.length || current.destination.length,
    );
    const hasDestinations = destinationOptions.length > 0;

    return (
      <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
        <MultiSelect
          label={t("group-type")}
          emptyLabel={t("all-types")}
          values={current.type}
          options={typeOptions}
          onChange={(value) => onChange({ type: value })}
        />

        <MultiSelect
          label={t("group-category")}
          emptyLabel={t("all-categories")}
          values={current.cat}
          options={catOptions}
          onChange={(value) => onChange({ cat: value })}
        />

        {hasDestinations && (
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

  return (
    <>
      <div className="scroll">
        <div
          className={
            inset
              ? "mb-6 hidden lg:block"
              : "hidden lg:flex container mx-auto px-5 justify-center z-20 relative mb-10 -mt-9"
          }
        >
          <div
            className={
              inset
                ? "rounded-xl bg-white px-5 py-4 ring-1 ring-sand"
                : "w-full max-w-[1200px] rounded-xl bg-white px-6 py-5 shadow-lg ring-1 ring-sand"
            }
          >
            {renderForm(values, apply)}
          </div>
        </div>

        <div
          className={`flex lg:hidden justify-end ${inset ? "mb-4" : "px-5 mt-4"}`}
        >
          <button
            type="button"
            aria-label={t("filter")}
            onClick={openMobile}
            className="p-2 border rounded-full"
          >
            <FiFilter size={24} />
          </button>
        </div>
      </div>

      {/* bg-black/50 вместо пары bg-black + bg-opacity-50: утилиты
          *-opacity-* в v4 удалены, и прозрачность фона просто переставала бы
          работать — подложка вышла бы сплошной чёрной. */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 p-6 rounded-lg relative">
            <button
              type="button"
              aria-label={t("close")}
              className="absolute top-3 right-3 text-inkMuted transition-colors hover:text-ink"
              onClick={() => setMobileOpen(false)}
            >
              <IoClose size={28} />
            </button>
            <h2
              className={`${PoppinFont.className} mb-4 text-lg font-bold text-ink`}
            >
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
