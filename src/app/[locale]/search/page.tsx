import React from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import SearchField from "@/components/search/SearchField";
import TourCards from "@/components/home/TourCards";
import BlogCard from "@/components/blog/BlogCard";
import { Link } from "@/i18n/navigation";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";
import { getBlogsPage, getToursPage } from "@/lib/api/catalog";
import { pageMetadata } from "@/lib/metadata";

/**
 * Поиск по сайту.
 *
 * Ищет сразу в двух разделах — турах и статьях, — потому что человек
 * набирает «Мерв», не задумываясь, тур это или рассказ. Разводить поиск
 * по разделам значило бы заставлять его выбирать заранее.
 *
 * Разметку страница держит сама и не полагается на готовые блоки с
 * других страниц. Первая сборка так и делала — ставила подряд TourCards
 * и BlogsList, — и получился бардак: TourCards это голая сетка без
 * контейнера (его задаёт родитель на главной и в каталоге), поэтому
 * карточки туров расползались во всю ширину окна, обрезаясь по краям,
 * а BlogsList со своим контейнером стоял ровно. Два блока по разным
 * правилам, без единой подписи, где туры, а где статьи.
 *
 * Теперь оба списка лежат в одном контейнере, у каждого свой заголовок
 * с числом находок, и разделы отделены линией.
 *
 * Запрос живёт в адресной строке, а не в состоянии React: результат
 * можно отправить в переписке, открыть в новой вкладке и вернуться к
 * нему кнопкой «назад».
 *
 * Постраничной разбивки здесь нет намеренно. Поиск отвечает на вопрос
 * «есть ли у вас про это», а не заменяет каталог: показываем первые
 * находки, а под ними ссылку в раздел с тем же запросом.
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
  setRequestLocale(locale);
  const q = readQuery(await searchParams);
  const t = await getTranslations("Search");
  const section = await getTranslations("SectionTitle");

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
  const encoded = encodeURIComponent(q);

  /** Заголовок раздела с числом находок. */
  const Heading = ({ title, count }: { title: string; count: number }) => (
    <h2
      className={`${PoppinFont.className} mb-5 flex items-center gap-3 text-xl font-bold text-tile md:text-2xl`}
    >
      {title}
      {/*
        Число в кружке, а не серой цифрой рядом: так оно читается как
        счётчик находок, а не как часть заголовка. Тот же приём, что у
        кнопки фильтра в блоге.
      */}
      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-tileTint px-2 text-sm font-semibold text-tile">
        {count}
      </span>
    </h2>
  );

  /*
   * Примеры запросов для пустой страницы и для случая «ничего не нашлось».
   *
   * Названия мест, а не общие слова: «тур» найдёт всё подряд и ничему не
   * научит, а «Дарваза» показывает, что искать стоит конкретное место.
   * Список короткий и одинаковый на всех языках — это имена собственные.
   */
  const примеры = ["Darvaza", "Merv", "Ashgabat", "Kopetdag"];

  const подсказки = (
    <ul className={`${QuicksandFont.className} mt-3 flex flex-wrap gap-2`}>
      {примеры.map((слово) => (
        <li key={слово}>
          <Link
            href={`/search?q=${encodeURIComponent(слово)}`}
            className="inline-block rounded-full border border-sand bg-white px-4 py-1.5 text-sm text-ink transition-colors hover:border-tileLight hover:text-tile"
          >
            {слово}
          </Link>
        </li>
      ))}
    </ul>
  );

  /** Две крупные ссылки в разделы — выход со страницы, когда искать нечего. */
  const разделы = (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link
        href="/tours"
        className={`${PoppinFont.className} rounded-full bg-tile px-6 py-2.5 text-sm text-white transition-colors hover:bg-tileDark`}
      >
        {t("goTours")}
      </Link>
      <Link
        href="/blog"
        className={`${PoppinFont.className} rounded-full border border-tile px-6 py-2.5 text-sm text-tile transition-colors hover:bg-tile hover:text-white`}
      >
        {t("goBlog")}
      </Link>
    </div>
  );

  return (
    <div>
      {/*
        Шапка поиска на подложке: так поле отделено от результатов и не
        выглядит частью первой карточки.

        Поле стоит по левому краю вместе с заголовком, а не по центру
        полосы: раньше заголовок был слева, поле по центру, а строка с
        числом находок снова слева — три элемента по трём разным осям.
      */}
      <div className="border-b border-sand bg-sandLight">
        <div className="container mx-auto px-5 py-8 md:py-10">
          <h1
            className={`${PoppinFont.className} text-2xl font-bold text-tile sm:text-3xl`}
          >
            {t("title")}
          </h1>

          <div className="mt-5 max-w-2xl">
            <SearchField
              initial={q}
              placeholder={t("placeholder")}
              label={t("title")}
            />
          </div>

          {q && (
            <p className={`${QuicksandFont.className} mt-4 text-sm text-inkMuted`}>
              {found > 0
                ? t("found", { count: found, query: q })
                : t("nothing", { query: q })}
            </p>
          )}
        </div>
      </div>

      {/*
        Пустая страница без запроса.

        Раньше здесь было белое поле до самого подвала: человек открывал
        поиск и видел поле ввода посреди пустоты. Теперь страница сама
        подсказывает, с чего начать, и даёт выход в разделы.
      */}
      {!q && (
        <section className="container mx-auto px-5 py-10 md:py-14">
          <div className="max-w-2xl">
            <h2
              className={`${PoppinFont.className} text-lg font-bold text-ink md:text-xl`}
            >
              {t("suggestTitle")}
            </h2>
            <p className={`${QuicksandFont.className} mt-2 text-inkMuted`}>
              {t("suggestText")}
            </p>

            <p className={`${QuicksandFont.className} mt-5 text-sm text-inkMuted`}>
              {t("popular")}
            </p>
            {подсказки}
            {разделы}
          </div>
        </section>
      )}

      {/*
        Ничего не нашлось. Прежде страница обрывалась строкой «ничего не
        нашлось» — и всё, дальше подвал. Теперь под ней те же примеры и
        ссылки в разделы: тупик превращается в развилку.
      */}
      {q && found === 0 && (
        <section className="container mx-auto px-5 py-10 md:py-14">
          <div className="max-w-2xl">
            <p className={`${QuicksandFont.className} text-inkMuted`}>
              {t("nothingHint")}
            </p>
            {подсказки}
            {разделы}
          </div>
        </section>
      )}

      {q && tours.total > 0 && (
        <section className="container mx-auto px-5 py-8 md:py-10">
          <Heading title={section("tours")} count={tours.total} />
          <TourCards tours={tours.items} />

          {/* Ссылка появляется, только когда есть что смотреть дальше:
              под шестью находками из шести она обманывала бы ожидание. */}
          {tours.total > LIMIT && (
            <Link
              href={`/tours?q=${encoded}`}
              className={`${PoppinFont.className} mt-6 inline-flex items-center gap-2 rounded-full border border-tile px-6 py-2.5 text-sm text-tile transition-colors hover:bg-tile hover:text-white`}
            >
              {t("allTours")}
            </Link>
          )}
        </section>
      )}

      {q && blogs.total > 0 && (
        <section className="container mx-auto border-t border-sand px-5 py-8 md:py-10">
          <Heading title={section("blogs")} count={blogs.total} />

          {/* Сетка та же, что у туров: два списка на одной странице должны
              стоять по одной линейке, иначе страница выглядит склеенной
              из двух разных. */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {blogs.items
              .filter((blog) => Boolean(blog.slug))
              .map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  href={`/blog/${blog.slug}`}
                  className="w-full"
                />
              ))}
          </div>

          {blogs.total > LIMIT && (
            <Link
              href={`/blog?q=${encoded}`}
              className={`${PoppinFont.className} mt-6 inline-flex items-center gap-2 rounded-full border border-tile px-6 py-2.5 text-sm text-tile transition-colors hover:bg-tile hover:text-white`}
            >
              {t("allBlogs")}
            </Link>
          )}
        </section>
      )}
    </div>
  );
}
