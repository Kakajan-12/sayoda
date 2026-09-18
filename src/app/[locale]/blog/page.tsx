import React from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BlogsMain from "@/components/blog/BlogsHero";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import BlogsList from "@/components/blog/BlogsList";
import PageLinks from "@/components/ui/PageLinks";
import { pageMetadata } from "@/lib/metadata";
import BlogToolbar from "@/components/blog/BlogToolbar";
import { PER_PAGE, getBlogCategories, getBlogsPage } from "@/lib/api/catalog";
import { getDestinations } from "@/lib/api/destinations";
import { asIds, one, type Search } from "@/lib/searchParams";

// Литерал обязателен: конфиг сегмента разбирается статически.
export const revalidate = 300;

/*
 * generateStaticParams убран: номер страницы приходит из адреса, поэтому
 * собрать список заранее нельзя. Разметка по-прежнему готовится на сервере,
 * так что краулер видит карточки — динамический рендер и пустая страница
 * это разные вещи.
 */

const readPage = (search: Search) => {
  const raw = Array.isArray(search.page) ? search.page[0] : search.page;
  return Math.max(1, Number.parseInt(raw ?? "", 10) || 1);
};

/** Поисковый запрос из адреса. Длину режем: строка приходит извне. */
const readQuery = (search: Search) => one(search.q).trim().slice(0, 100);

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Search>;
}): Promise<Metadata> {
  const { locale } = await params;
  const search = await searchParams;
  const page = readPage(search);
  const category = asIds(search.category);
  const destination = asIds(search.destination);
  const q = readQuery(search);
  const base = await pageMetadata(locale, "blog", "blog");

  /*
   * Выдачу по словам из индекса убираем: это не раздел сайта, а ответ на
   * разовый запрос. С каждым новым словом получается новый адрес, и
   * поисковик набил бы индекс почти пустыми страницами. Категории при
   * этом индексируются: их набор конечный и осмысленный.
   */
  if (q) return { ...base, robots: { index: false, follow: true } };

  if (page === 1 && !category.length && !destination.length) return base;

  /*
   * У второй и дальше страниц свой канонический адрес. Указывать первую
   * нельзя: поисковик счёл бы остальные дублем и выбросил из выдачи всё,
   * кроме девяти первых статей.
   *
   * Отбор входит в канонический адрес наравне с номером. Без него у
   * второй страницы отбора получался адрес /blog?page=2 — то есть ссылка
   * на другой список, где на этом месте стоит совсем другая статья.
   */
  const query = new URLSearchParams();
  if (category.length) query.set("category", category.join(","));
  if (destination.length) query.set("destination", destination.join(","));
  if (page > 1) query.set("page", String(page));

  const canonical = `${base.alternates?.canonical ?? ""}?${query.toString()}`;
  return {
    ...base,
    title: page > 1 ? `${base.title} — ${page}` : base.title,
    alternates: { ...base.alternates, canonical },
  };
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
  const search = await searchParams;
  const page = readPage(search);
  const category = asIds(search.category);
  const destination = asIds(search.destination);
  const q = readQuery(search);

  // Сервер отдаёт только нужную страницу и только отобранное: раньше сюда
  // приезжали все статьи целиком, а браузер показывал девять. Счётчик
  // страниц сервер считает тем же отбором, поэтому пагинация не обещает
  // страниц, которых в выборке нет.
  //
  // Страны берём тем же запросом, что и категории: они нужны второй оси
  // фильтра. Список короткий — пять направлений.
  const [{ items, total }, categories, destinations] = await Promise.all([
    getBlogsPage(page, PER_PAGE, {
      category: category.join(","),
      destination: destination.join(","),
      q,
    }),
    getBlogCategories(),
    getDestinations(),
  ]);
  const pageCount = Math.max(1, Math.ceil(total / PER_PAGE));
  const t = await getTranslations("SectionTitle");
  const nav = await getTranslations({ locale, namespace: "Header" });

  return (
    <div>
      {/* Крошки были у отдельной статьи, но не у самого списка — цепочка
          обрывалась на середине. Берём то же название, что в меню. */}
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: nav("main"), path: "" },
          { name: nav("blog"), path: "blog" },
        ]}
      />
      <BlogsMain />

      {/*
        Панель приподнята на обложку и стоит вплотную к списку: раньше
        кнопки категорий висели выше раздела, к которому относятся, в
        полосе пустого места, и было непонятно, к чему они.
      */}
      <BlogToolbar
        categories={categories}
        destinations={destinations}
        activeCategories={category}
        activeDestinations={destination}
        query={q}
        total={total}
      />

      {/* Заголовок «Блоги» скрыт: сверху уже есть h1 в шапке, а между ним
          и карточками теперь стоит панель — третья подпись подряд лишняя. */}
      <BlogsList blogs={items} withHeading={false} />

      <PageLinks
        page={page}
        pageCount={pageCount}
        basePath="/blog"
        // Разбивка собирает адрес из тех же условий: без этого переход на
        // вторую страницу сбрасывал бы отбор.
        params={{
          category: category.join(",") || undefined,
          destination: destination.join(",") || undefined,
          q: q || undefined,
        }}
        label={t("blogs")}
      />
    </div>
  );
}
