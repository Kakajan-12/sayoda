import type { Metadata } from "next";
import "./globals.css";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import FooterImage from "../../Components/Footer/Image";
import Providers from "../Redux/Provider";
import BodyWrapper from "../Redux/BodyProvider";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL, alternatesFor } from "@/lib/site";
import OrganizationJsonLd from "@/Components/Seo/OrganizationJsonLd";
import Analytics from "@/Components/Seo/Analytics";
import ScrollToTop from "@/Components/Layout/ScrollToTop";
import WhatsAppButton from "@/Components/Contact/WhatsAppButton";
import LiveChat from "@/Components/Contact/LiveChat";
import { getContacts, whatsappHref } from "@/lib/api/contacts";
import { getSettings } from "@/lib/api/settings";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });

  return {
    metadataBase: new URL(SITE_URL),
    // Дочерние маршруты задают только свой title — суффикс подставляется здесь.
    title: {
      default: t("home.title"),
      template: `%s | ${SITE_NAME}`,
    },
    description: t("home.description"),
    alternates: alternatesFor(locale),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale,
      url: alternatesFor(locale).canonical,
      title: t("home.title"),
      description: t("home.description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("home.title"),
      description: t("home.description"),
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icon.png", type: "image/svg+xml" },
      ],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "Contact" });
  const [contacts, settings] = await Promise.all([
    getContacts(locale),
    getSettings(),
  ]);
  const whatsapp = whatsappHref(
    contacts,
    t("whatsappPrefill"),
    settings.whatsapp,
  );

  return (
    <html lang={locale}>
      <Providers>
        <NextIntlClientProvider>
          <BodyWrapper>
            <OrganizationJsonLd locale={locale} />
            <Analytics ga4Id={settings.ga4_id} />
            <ScrollToTop />
            <Header />
            {children}

            <FooterImage />
            <Footer />
            {whatsapp && (
              <WhatsAppButton href={whatsapp} label={t("whatsappLabel")} />
            )}
            <LiveChat tawkId={settings.tawk_id} />
          </BodyWrapper>
        </NextIntlClientProvider>
      </Providers>
    </html>
  );
}
