import { setRequestLocale } from "next-intl/server";
import VisaSections from "@/components/destinations/VisaSections";

export const revalidate = 300;

/**
 * Визовый раздел соседних стран.
 *
 * У Туркменистана он переехал на верхний уровень — /turkmenistan-visa: это
 * посадочная страница по самому частотному запросу, и четвёртый уровень
 * вложенности ей мешал. Сюда запрос по Туркменистану уже не доходит, его
 * перехватывает постоянная переадресация в next.config.
 *
 * Остальные страны продолжают жить здесь: их визовый текст — один абзац,
 * отдельной посадочной страницы он не стоит.
 */
export default async function VisaPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  setRequestLocale(locale);

  return <VisaSections locale={locale} country={country} />;
}
