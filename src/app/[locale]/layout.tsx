import type { Metadata } from "next";
import Script from "next/script";
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
  return (
    <html lang={locale}>
      <Providers>
        <NextIntlClientProvider>
          <BodyWrapper>
            <OrganizationJsonLd locale={locale} />
            <Header />
            {children}

            <FooterImage />
            <Footer />
            <Script id="crisp-widget" strategy="afterInteractive">
              {`
                window.$crisp = [];
                window.CRISP_WEBSITE_ID = "e7dbcc8b-ef2d-4ec3-a9ac-3e4ac41a7e48";
                (function () {
                  var d = document;
                  var s = d.createElement("script");
                  s.src = "https://client.crisp.chat/l.js";
                  s.async = 1;
                  d.getElementsByTagName("head")[0].appendChild(s);
                })();
              `}
            </Script>
          </BodyWrapper>
        </NextIntlClientProvider>
      </Providers>
    </html>
  );
}
