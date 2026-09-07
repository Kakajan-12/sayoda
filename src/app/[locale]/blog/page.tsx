import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BlogsMain from "@/components/blog/BlogsHero";
import BlogsList from "@/components/blog/BlogsList";
import PageLinks from "@/components/ui/PageLinks";
import { pageMetadata } from "@/lib/metadata";
import { PER_PAGE, getBlogsPage } from "@/lib/api/catalog";

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

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Search>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = readPage(await searchParams);
  const base = await pageMetadata(locale, "blog", "blog");

  if (page === 1) return base;

  /*
   * У второй и дальше страниц свой канонический адрес. Указывать первую
   * нельзя: поисковик счёл бы остальные дублем и выбросил из выдачи всё,
   * кроме девяти первых статей.
   */
  const canonical = `${base.alternates?.canonical ?? ""}?page=${page}`;
  return {
    ...base,
    title: `${base.title} — ${page}`,
    alternates: { ...base.alternates, canonical },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const page = readPage(await searchParams);

  // Сервер отдаёт только нужную страницу: раньше сюда приезжали все статьи
  // целиком, а браузер показывал из них девять.
  const { items, total } = await getBlogsPage(page, PER_PAGE);
  const pageCount = Math.max(1, Math.ceil(total / PER_PAGE));
  const t = await getTranslations("SectionTitle");

  return (
    <div>
      <BlogsMain />
      <BlogsList blogs={items} />
      <PageLinks
        page={page}
        pageCount={pageCount}
        basePath="/blog"
        label={t("blogs")}
      />
    </div>
  );
}
