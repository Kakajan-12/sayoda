import React from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ContactMain from "@/components/contacts/ContactsHero";
import ContactDetails from "@/components/contacts/ContactDetails";
import ContactMap from "@/components/contacts/ContactMap";
import WhatToInclude from "@/components/contacts/WhatToInclude";
import ContactForm from "@/components/contacts/ContactForm";
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
  return pageMetadata(locale, "contacts", "contacts");
}

/**
 * Контакты.
 *
 * Раньше адрес, телефон, почту и карту тянул из браузера клиентский
 * компонент, и в серверном HTML не было ни одного контакта: на всю страницу
 * приходилось около пятисот знаков, почти целиком из подвала. Для страницы,
 * у которой одна задача — дать способ связаться, это худшее, что можно
 * сделать.
 *
 * Порядок такой: сначала способы связи, потом карта, потом что написать, и
 * только затем форма. Человек, которому достаточно позвонить, не должен
 * пролистывать форму, чтобы найти номер.
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
          { name: nav("contact"), path: "contacts" },
        ]}
      />
      <ContactMain />
      <ContactDetails locale={locale} />
      <ContactMap locale={locale} />
      <WhatToInclude locale={locale} />
      <ContactForm />
    </section>
  );
}
