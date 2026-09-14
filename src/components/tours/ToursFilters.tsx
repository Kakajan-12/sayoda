"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
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
 * Вместо выпадающих списков — видимые чипы, и это главное здесь решение.
 *
 * Списков было четыре, и на мобильном они жили в модалке: чтобы поставить
 * один фильтр, человек делал четыре касания (иконка, список, значение,
 * «Искать»), и всё это ради каталога из двенадцати туров. Чипы дают одно
 * касание и заодно показывают, что вообще бывает, — при трёх-пяти значениях
 * на ось прятать их за кнопкой незачем.
 *
 * Модалки больше нет: чипы помещаются на странице на любой ширине, а окно
 * поверх содержимого нужно было только для того, чтобы вместить списки.
 *
 * Фильтра «Популярные» тоже нет. Из двенадцати туров популярными отмечены
 * девять — такой отбор ничего не отбирает. Адрес ?popular=1 сервер по-прежнему
 * понимает, старые ссылки не ломаются.
 *
 * При смене любого условия номер страницы сбрасывается: на четвёртой
 * странице прежней выборки в новой может не быть ничего, и человек попадал
 * бы на пустой экран.
 */

export interface ToursFilterValues {
  type: string;
  cat: string;
  destination: string;
  /** Сервер понимает, управления на странице нет — см. комментарий выше. */
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
  destinations: TaxonomyItem[];
}

type Option = { value: string; label: string };

export default function ToursFilters({
  values,
  types,
  categories,
  destinations,
}: Props) {
  const t = useTranslations("Filter");
  const locale = useLocale();
  const router = useRouter();

  const isFiltered = Boolean(values.type || values.cat || values.destination);

  const apply = (next: Partial<ToursFilterValues>) => {
    const merged = { ...values, ...next };
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(merged)) {
      if (value) search.set(key, value);
    }
    const query = search.toString();
    // scroll: false — список сам подставится под фильтром, а перескок
    // страницы наверх сбивает при переборе вариантов.
    router.push(query ? `/tours?${query}` : "/tours", { scroll: false });
  };

  const group = (
    label: string,
    current: string,
    options: Option[],
    onPick: (value: string) => void,
  ) => {
    // Одно значение фильтровать нечем: колонка чипов только отнимает место.
    if (options.length < 2) return null;

    return (
      <div key={label} className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-inkMuted">
          {label}
        </span>
        {/*
          role="group": для скринридера это набор переключателей одной оси,
          а не россыпь одиночных кнопок. Состояние — через aria-pressed.

          На узком экране ось — одна прокручиваемая дорожка, с sm — обычный
          перенос. Измерено на ширине 360: с переносом три оси занимали девять
          рядов, почти пол-экрана до первой карточки, — а ради этого фильтр и
          вынимали из модалки. Дорожками те же три оси умещаются в три ряда.

          Отрицательные поля с таким же padding: дорожка доезжает до края
          карточки, и обрезанный чип у границы видно — это и подсказывает,
          что вбок можно листать.
        */}
        <div
          role="group"
          aria-label={label}
          className="-mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:overflow-x-visible sm:px-0"
        >
          {[{ value: "", label: t("all") }, ...options].map((option) => {
            const active = current === option.value;
            return (
              <button
                key={option.value || "all"}
                type="button"
                aria-pressed={active}
                onClick={() => onPick(option.value)}
                // shrink-0: внутри дорожки без переноса флекс иначе сжал бы
                // чипы до нечитаемых столбиков вместо прокрутки.
                className={`shrink-0 rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                  active
                    ? "border-tile bg-tile text-white"
                    : "border-sand text-ink hover:border-tileLight hover:text-tileLight"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    /* Наложение на обложку только с lg: там карточка узкая и ложится поверх
       красиво, а на телефоне тремя рядами чипов она закрыла бы её целиком. */
    <div className="container mx-auto px-5 mb-10 mt-6 lg:relative lg:z-20 lg:-mt-9 lg:flex lg:justify-center">
      <div className="w-full max-w-[1200px] rounded-xl bg-white px-5 py-5 shadow-lg ring-1 ring-sand sm:px-6">
        <div className={`${PoppinFont.className} flex flex-col gap-5`}>
          {group(t("group-type"), values.type, types.map((item) => ({
            value: String(item.id),
            label: item.label,
          })), (value) => apply({ type: value }))}

          {group(t("group-category"), values.cat, categories.map((cat) => ({
            value: String(cat.id),
            label: String(cat[`cat_${locale}`] ?? cat.cat_en ?? ""),
          })), (value) => apply({ cat: value }))}

          {group(t("group-location"), values.destination, destinations.map((item) => ({
            value: String(item.id),
            label: String(item[`location_${locale}`] ?? item.location_en ?? ""),
          })), (value) => apply({ destination: value }))}

          {/* Кнопка появляется, только когда есть что сбрасывать: «Все» в
              каждой группе и так снимает свою ось, а вечно висящая неактивная
              кнопка — лишний шум. */}
          {isFiltered && (
            <div>
              <button
                type="button"
                onClick={() => apply({ type: "", cat: "", destination: "" })}
                className="rounded-full border border-tile px-6 py-2 text-sm text-tile transition-colors hover:bg-tile hover:text-white"
              >
                {t("reset")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
