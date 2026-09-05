import React from "react";
import type { Metadata } from "next";
import BlogsMain from "../../../Components/Blogs/BlogsMain";
import BlogsCardsProps from "../../../Components/Blogs/BlogsCardsProps";
import { pageMetadata } from "@/lib/metadata";
import { getBlogs } from "@/lib/api/catalog";
import { routing } from "@/i18n/routing";

// Литерал обязателен: конфиг сегмента разбирается статически.
export const revalidate = 300;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "blog", "blog");
}

export default async function Page() {
  // Статьи читаются на сервере, чтобы карточки попадали в HTML.
  const blogs = await getBlogs();

  return (
    <div>
      <BlogsMain />
      <BlogsCardsProps blogs={blogs} />
    </div>
  );
}
