import { getDestinations } from "@/lib/api/destinations";
import DestinationShell from "@/components/destinations/DestinationShell";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 300;

/**
 * Список стран для построения страниц заранее.
 *
 * Без него сегмент [country] неизвестен на сборке, и все разделы направления
 * помечались в выводе как динамические: каждый визит шёл мимо кэша прямо на
 * сервер. Макет сегмента вправе задавать параметр своего уровня — дочерние
 * страницы разделов достраиваются по нему.
 *
 * Ошибку запроса глушим намеренно: недоступный на момент сборки API не должен
 * ронять весь деплой. Тогда список окажется пустым, страницы построятся при
 * первом обращении и дальше будут отдаваться из кэша — dynamicParams это
 * разрешает по умолчанию.
 */
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
