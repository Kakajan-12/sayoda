import React from "react";
import type { Metadata } from "next";
import AboutUs from "@/components/about/AboutHero";
import Services from "@/components/about/Services";
import Testimonials from "@/components/about/Testimonials";
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
  return pageMetadata(locale, "about", "about");
}

/**
 * «Почему мы» и «Как это работает» переехали на главную: это блоки, которые
 * снимают возражения, а до страницы «О нас» доходит меньшинство. Здесь
 * остаётся рассказ о компании, услуги и отзывы.
 */
export default function Page() {
  return (
    <section>
      <AboutUs />
      <Services />
      <Testimonials />
    </section>
  );
}
