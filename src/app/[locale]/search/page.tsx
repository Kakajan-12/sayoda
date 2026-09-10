import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SearchField from "@/components/search/SearchField";
import TourCards from "@/components/home/TourCards";
import BlogsList from "@/components/blog/BlogsList";
import { PoppinFont } from "@/components/ui/Fonts";
import { getBlogsPage, getToursPage } from "@/lib/api/catalog";
import { pageMetadata } from "@/lib/metadata";

/**
 * Поиск по сайту.
 *
 * Ищет сразу в двух разделах — турах и статьях, — потому что человек
 * набирает «Дарваза», не задумываясь, тур это или рассказ. Разводить
 * поиск по разделам значило бы заставлять его выбирать заранее.
 *
 * Запрос живёт в адресной строке, а не в состоянии React: результат
 * можно отправить в переписке, открыть в новой вкладке и вернуться к
 * нему кнопкой «назад».
 *
 * Постраничной разбивки здесь нет намеренно. Поиск отвечает на вопрос
 * «есть ли у вас про это», а не заменяет каталог: нашлось много —
 * человек уточнит запрос, а не пойдёт на седьмую страницу. Поэтому
 * берём первые несколько находок в каждом разделе и показываем общее
 * число.
 */

export const revalidate = 300;

/** Сколько находок показываем в каждом разделе. */
const LIMIT = 6;

type Search = Record<string, string | string[] | undefined>;

const readQuery = (search: Search) => {
  const raw = Array.isArray(search.q) ? search.q[0] : search.q;
  // Обрезаем длину: строка приходит из адреса, и тащить в запрос к базе
  // килобайт текста незачем.
  return String(raw ?? "").trim().slice(0, 100);
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const base = await pageMetadata(locale, "search", "search");
  /*
   * Страницу поиска из индекса убираем. Это не содержание сайта, а ответ
   * на разовый запрос: с каждым новым словом получается новый адрес, и
   * поисковик набьёт индекс тысячами почти пустых страниц.
   */
  return { ...base, robots: { index: false, follow: true } };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Search>;
}) {
  const { locale } = await params;
  const q = readQuery(await searchParams);
  const t = await getTranslations("Search");

  // Пустой запрос до базы не доводим: показываем только поле ввода.
  const [tours, blogs] = q
    ? await Promise.all([
        getToursPage({ page: 1, perPage: LIMIT, q }),
        getBlogsPage(1, LIMIT, { q }),
      ])
    : [
        { items: [], total: 0 },
        { items: [], total: 0 },
      ];

  const found = tours.total + blogs.total;

  return (
    <div className="bg-sandLight py-10 md:py-16">
      <div className="container mx-auto px-5">
        <h1
          className={`${PoppinFont.className} text-2xl font-bold text-tile sm:text-3xl`}
        >
          {t("title")}
        </h1>

        <div className="mt-5 max-w-2xl">
          <SearchField initial={q} placeholder={t("placeholder")} label={t("title")} />
        </div>

        {q && (
          <p className="mt-4 text-sm text-inkMuted">
            {found > 0 ? t("found", { count: found, query: q }) : t("nothing", { query: q })}
          </p>
        )}
      </div>

      {q && tours.total > 0 && (
        <section className="mt-6">
          <TourCards tours={tours.items} />
        </section>
      )}

      {q && blogs.total > 0 && (
        <section className="mt-2">
          <BlogsList blogs={blogs.items} />
        </section>
      )}
    </div>
  );
}
