import React from "react";
import type { Metadata } from "next";
import ContactMain from "../../../Components/ContactUs/ContactUsMain";
import ContactForm from "../../../Components/ContactUs/ContactForm";
import LocationSwitcher from "../../../Components/ContactUs/Address";
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
  return pageMetadata(locale, "contacts", "contacts");
}

export default function Page() {
  return (
    <section>
      <ContactMain />
      <LocationSwitcher />
      <ContactForm />
    </section>
  );
}
