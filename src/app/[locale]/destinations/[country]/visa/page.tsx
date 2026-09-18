import type { Metadata } from "next";
import { destinationMetadata } from "@/lib/destinationMeta";
import { setRequestLocale } from "next-intl/server";
import VisaSections from "@/components/destinations/VisaSections";

export const revalidate = 300;

/**
 * Свой заголовок и свой канонический адрес.
 *
 * Без них вкладка наследовала заголовок страны и указывала канонической
 * страницу обзора — пять разных вкладок объявляли себя одной страницей.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}): Promise<Metadata> {
  const { locale, country } = await params;
  return destinationMetadata({ locale, country, tab: "visa", path: "visa" });
}

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
