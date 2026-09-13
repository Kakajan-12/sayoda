import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import DestinationShell from "@/components/destinations/DestinationShell";
import VisaSections from "@/components/destinations/VisaSections";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { pageMetadata } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const revalidate = 300;

const COUNTRY = "turkmenistan";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "turkmenistanVisa", "turkmenistan-visa");
}

/**
 * Виза в Туркменистан — посадочная страница.
 *
 * Лежала на четвёртом уровне вложенности, /destinations/turkmenistan/visa,
 * и делила вес со второй ссылкой из футера. При этом «turkmenistan visa» —
 * самый частотный запрос, по которому сюда вообще приходят, и отвечает на
 * него именно эта страница, а не карточка направления.
 *
 * Со старых адресов стоит постоянная переадресация, см. next.config.
 *
 * Обложка и вкладки остались: человек приходит сюда из поиска, и путь к
 * турам должен быть виден сразу, а не после возврата назад.
 */
export default async function TurkmenistanVisaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const nav = await getTranslations({ locale, namespace: "Header" });
  const td = await getTranslations({ locale, namespace: "Destinations" });

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: nav("main"), path: "" },
          { name: td("tabVisa"), path: "turkmenistan-visa" },
        ]}
      />
      <DestinationShell locale={locale} country={COUNTRY}>
        <VisaSections locale={locale} country={COUNTRY} />
      </DestinationShell>
    </>
  );
}
