import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BlogsMain from "@/components/blog/BlogsHero";
import BlogsList from "@/components/blog/BlogsList";
import PageLinks from "@/components/ui/PageLinks";
import { pageMetadata } from "@/lib/metadata";
import BlogCategoryFilter from "@/components/blog/BlogCategoryFilter";
import { PER_PAGE, getBlogCategories, getBlogsPage } from "@/lib/api/catalog";

// Литерал обязателен: конфиг сегмента разбирается статически.
export const revalidate = 300;

/*
 * generateStaticParams убран: номер страницы приходит из адреса, поэтому
 * собрать список заранее нельзя. Разметка по-прежнему готовится на сервере,
 * так что краулер видит карточки — динамический рендер и пустая страница
 * это разные вещи.
 */

type Search = Record<string, string | string[] | undefined>;

const readPage = (search: Search) => {
  const raw = Array.isArray(search.page) ? search.page[0] : search.page;
  return Math.max(1, Number.parseInt(raw ?? "", 10) || 1);
};

/**
 * Выбранная категория из адреса.
 *
 * Принимаем только цифры: значение приходит из адресной строки, то есть
 * подставить туда можно что угодно, а сервер ждёт идентификатор. На мусор
 * возвращаем пустую строку — покажется весь блог, а не пустая страница.
 */
const readCategory = (search: Search) => {
  const raw = Array.isArray(search.category) ? search.category[0] : search.category;
  return /^\d+$/.test(raw ?? "") ? String(raw) : "";
};

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
  const category = readCategory(search);
  const base = await pageMetadata(locale, "blog", "blog");

  if (page === 1 && !category) return base;

  /*
   * У второй и дальше страниц свой канонический адрес. Указывать первую
   * нельзя: поисковик счёл бы остальные дублем и выбросил из выдачи всё,
   * кроме девяти первых статей.
   *
   * Категория входит в канонический адрес наравне с номером. Без неё у
   * второй страницы отбора получался адрес /blog?page=2 — то есть ссылка
   * на другой список, где на этом месте стоит совсем другая статья.
   */
  const query = new URLSearchParams();
  if (category) query.set("category", category);
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
  const search = await searchParams;
  const page = readPage(search);
  const category = readCategory(search);

  // Сервер отдаёт только нужную страницу и только выбранную категорию:
  // раньше сюда приезжали все статьи целиком, а браузер показывал девять.
  // Счётчик страниц сервер считает тем же отбором, поэтому пагинация не
  // обещает страниц, которых в выборке нет.
  const [{ items, total }, categories] = await Promise.all([
    getBlogsPage(page, PER_PAGE, { category }),
    getBlogCategories(),
  ]);
  const pageCount = Math.max(1, Math.ceil(total / PER_PAGE));
  const t = await getTranslations("SectionTitle");
  const tb = await getTranslations("Blog");

  return (
    <div>
      <BlogsMain />

      <div className="container mx-auto px-5">
        <BlogCategoryFilter
          categories={categories}
          active={category}
          locale={locale}
          allLabel={tb("allCategories")}
        />
        {items.length === 0 && (
          <p className="py-10 text-center text-inkMuted">{tb("nothingFound")}</p>
        )}
      </div>

      <BlogsList blogs={items} />
      <PageLinks
        page={page}
        pageCount={pageCount}
        basePath="/blog"
        params={{ category: category || undefined }}
        label={t("blogs")}
      />
    </div>
  );
}
