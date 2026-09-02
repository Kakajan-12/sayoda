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

export async function generateStaticParams() {
  const blogs = await getBlogs();
  return routing.locales.flatMap((locale) =>
    blogs.map((blog) => ({ locale, id: String(blog.id) })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;
  const blog = await getBlog(id);
  if (!blog) return {};

  const title = plainText(localizedField(blog, "title", locale));
  const description = excerpt(localizedField(blog, "text", locale));
  const image = mediaUrl(blog.image);
  const alternates = alternatesFor(locale, `blog/${blog.id}`);

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
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;

  const blog = await getBlog(id);
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
            path: `blog/${blog.id}`,
          },
        ]}
      />
      <MainCountries data={blog} />
      <TextsCountry data={blog} />
      <GalleryCountry blogId={blog.id} />
    </div>
  );
}
