import React from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import AboutUs from "@/components/about/AboutHero";
import Services from "@/components/about/Services";
import WhyLocal from "@/components/about/WhyLocal";
import AboutCta from "@/components/about/AboutCta";
import Testimonials from "@/components/about/Testimonials";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { pageMetadata } from "@/lib/metadata";
import { routing } from "@/i18n/routing";

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
  return pageMetadata(locale, "about", "about");
}

/**
 * «Почему мы» и «Как это работает» переехали на главную: это блоки, которые
 * снимают возражения, а до страницы «О нас» доходит меньшинство.
 *
 * Здесь остаётся то, ради чего страницу всё-таки открывают. Раньше это были
 * приветственный абзац и четыре карточки услуг — на всю страницу выходило
 * около тысячи знаков вместе с меню и подвалом, и ни одного проверяемого
 * факта о компании.
 *
 * Порядок соответствует вопросам, которые возникают подряд: кто вы, что вы
 * делаете, почему не собрать поездку самому, что говорят другие, и что
 * делать дальше.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Иначе next-intl в дочерних компонентах полезет за языком в заголовки,
  // и страница снова станет динамической. См. корневой макет локали.
  setRequestLocale(locale);

  const nav = await getTranslations({ locale, namespace: "Header" });

  return (
    <section>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: nav("main"), path: "" },
          { name: nav("about"), path: "about" },
        ]}
      />
      <AboutUs />
      <Services />
      <WhyLocal locale={locale} />
      {/* Блок «Sayoda Travel в цифрах» пока снят по просьбе заказчика.
          Компонент и переводы на месте — вернуть строкой
          <Facts locale={locale} /> сюда же. */}
      <Testimonials />
      <AboutCta locale={locale} />
    </section>
  );
}
