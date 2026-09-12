import React from "react";
import type { Metadata } from "next";
import ContactMain from "@/components/contacts/ContactsHero";
import ContactForm from "@/components/contacts/ContactForm";
import LocationSwitcher from "@/components/contacts/Address";
import { pageMetadata } from "@/lib/metadata";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

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

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Иначе next-intl в дочерних компонентах полезет за языком в заголовки,
  // и страница снова станет динамической. См. корневой макет локали.
  setRequestLocale(locale);

  return (
    <section>
      <ContactMain />
      <LocationSwitcher />
      <ContactForm />
    </section>
  );
}
