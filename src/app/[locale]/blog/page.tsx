import React from "react";
import type { Metadata } from "next";
import BlogsMain from "../../../Components/Blogs/BlogsMain";
import BlogsCardsProps from "../../../Components/Blogs/BlogsCardsProps";
import { pageMetadata } from "@/lib/metadata";
import { routing } from "@/i18n/routing";

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

export default function Page() {
  return (
    <div>
      <BlogsMain />
      <BlogsCardsProps />
    </div>
  );
}
