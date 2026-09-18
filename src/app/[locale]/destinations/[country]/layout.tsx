import type { Metadata } from "next";
import { getDestinations } from "@/lib/api/destinations";
import DestinationShell from "@/components/destinations/DestinationShell";
import { setRequestLocale } from "next-intl/server";
import { destinationMetadata } from "@/lib/destinationMeta";

export const revalidate = 300;

/**
 * Заголовок страны. Стоит в макете, а не на странице обзора: сюда он
 * годится как запасной для вкладок, которые своего не задали.
 * Подробности — в описании destinationMetadata.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}): Promise<Metadata> {
  const { locale, country } = await params;
  return destinationMetadata({ locale, country });
}

export async function generateStaticParams() {
  try {
    const destinations = await getDestinations();
    return destinations
      .filter((destination) => destination.slug)
      .map((destination) => ({ country: destination.slug }));
  } catch {
    return [];
  }
}

export default async function DestinationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  setRequestLocale(locale);

  // Обложка и вкладки живут в DestinationShell: ровно та же шапка нужна
  // визовой странице Туркменистана, которая теперь лежит вне этого сегмента.
  return (
    <DestinationShell locale={locale} country={country}>
      {children}
    </DestinationShell>
  );
}
