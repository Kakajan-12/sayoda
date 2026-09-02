import React from "react";
import type { Metadata } from "next";
import AboutUs from "../../../Components/AboutUs/AboutUs";
import Services from "../../../Components/AboutUs/Services";
import WhyChoose from "../../../Components/AboutUs/WhyChoose";
import HowToWork from "../../../Components/AboutUs/HowToWork";
import Testimonials from "../../../Components/AboutUs/Testimonials";
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

export default function Page() {
  return (
    <section>
      <AboutUs />
      <Services />
      <WhyChoose />
      <HowToWork />
      <Testimonials />
    </section>
  );
}
