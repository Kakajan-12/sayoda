import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import MainCountries from "../../../../Components/Countries/MainCountries";
import TextsCountry from "../../../../Components/Countries/TextsCountry";
import GalleryCountry from "../../../../Components/Countries/GalleryCountry";
import ArticleJsonLd from "@/Components/Seo/ArticleJsonLd";
import BreadcrumbJsonLd from "@/Components/Seo/BreadcrumbJsonLd";
import {
  getBlog,
  getBlogs,
  localizedField,
  mediaUrl,
} from "@/lib/api/catalog";
import { SITE_NAME, alternatesFor } from "@/lib/site";
import { excerpt, plainText } from "@/lib/utils";
import { routing } from "@/i18n/routing";

// Литерал обязателен: конфиг сегмента разбирается статически.
export const revalidate = 3600;


/**
 * Числовой адрес — это старый /tours/16. Отдаём 404, а не страницу: иначе
 * один и тот же тур жил бы по двум адресам, и поисковик считал бы это
 * дублем. Редиректа нет намеренно — ссылки на числовые адреса никуда
 * не отправлялись.
 */
const isNumericId = (value: string) => /^\d+$/.test(value);

export async function generateStaticParams() {
  const blogs = await getBlogs();
  // Запись без слага пропускаем: она не должна ронять сборку целиком.
  const withSlug = blogs.filter((blog) => Boolean(blog.slug));
  return routing.locales.flatMap((locale) =>
    withSlug.map((blog) => ({ locale, slug: blog.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  if (isNumericId(slug)) return {};
  const blog = await getBlog(slug);
  if (!blog) return {};

  const title = plainText(localizedField(blog, "title", locale));
  const description = excerpt(localizedField(blog, "text", locale));
  const image = mediaUrl(blog.image);
  const alternates = alternatesFor(locale, `blog/${blog.slug}`);

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      locale,
      url: alternates.canonical,
      title,
      description,
      publishedTime: blog.date
        ? new Date(blog.date).toISOString()
        : undefined,
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  if (isNumericId(slug)) notFound();
  const blog = await getBlog(slug);
  if (!blog) notFound();

  const nav = await getTranslations({ locale, namespace: "Header" });

  return (
    <div>
      <ArticleJsonLd blog={blog} locale={locale} />
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: nav("main"), path: "" },
          { name: nav("blog"), path: "blog" },
          {
            name: plainText(localizedField(blog, "title", locale)),
            path: `blog/${blog.slug}`,
          },
        ]}
      />
      <MainCountries data={blog} />
      <TextsCountry data={blog} />
      <GalleryCountry blogId={blog.id} />
    </div>
  );
}
