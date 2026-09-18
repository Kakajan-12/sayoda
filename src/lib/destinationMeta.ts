import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  destField,
  destImage,
  getDestinationBySlug,
} from "@/lib/api/destinations";
import { SITE_NAME, absoluteUrl, alternatesFor } from "@/lib/site";
import { excerpt, plainText } from "@/lib/utils";

/**
 * Заголовок и описание страницы направления и её вкладок.
 *
 * Своих метаданных у раздела не было вовсе, и все пять стран наследовали
 * заголовок главной: страница Узбекистана представлялась поисковику как
 * «Tours to Turkmenistan — Darvaza, Ashgabat & Ancient Merv». Для Google
 * это дубль — из пяти страниц в выдаче остаётся одна, а запросы вроде
 * «tours to Uzbekistan» не находят ничего, хотя страница есть.
 *
 * У вкладок — туры, отели, достопримечательности, виза — своя беда того же
 * рода: они наследовали заголовок страны и указывали канонический адрес
 * обзора. То есть пять разных страниц объявляли себя одной.
 *
 * Здесь собирается и то, и другое: у каждой вкладки свой заголовок с её
 * названием и свой канонический адрес.
 *
 * Тексты вкладок берутся из Seo.destinationTab, а не из названия вкладки в
 * меню. Названия там служебные — «Отели», «Как получить визу», — и в выдаче
 * такой заголовок не отвечает ни на один запрос: человек ищет «отели в
 * Туркменистане», а не «отели». По той же причине у каждой вкладки своё
 * описание: раньше все четыре брали вводный текст страны, и четыре страницы
 * показывали в поиске один и тот же анонс.
 *
 * @param tab  ключ вкладки в Seo.destinationTab: tours, hotels, sights, visa.
 *             Не передан для обзорной страницы страны.
 * @param path хвост адреса вкладки: "tours", "hotels"… — пусто для обзора.
 */
export async function destinationMetadata({
  locale,
  country,
  tab,
  path = "",
}: {
  locale: string;
  country: string;
  tab?: string;
  path?: string;
}): Promise<Metadata> {
  const destination = await getDestinationBySlug(country);
  if (!destination) return {};

  const seo = await getTranslations({ locale, namespace: "Seo" });

  const name = plainText(destField(destination, "name", locale));
  const title = tab
    ? seo(`destinationTab.${tab}.title`, { country: name })
    : seo("destination.title", { country: name });

  const description = tab
    ? seo(`destinationTab.${tab}.description`, { country: name })
    : excerpt(destField(destination, "intro", locale), 155) ||
      seo("destination.description", { country: name });

  const suffix = path ? `/${path}` : "";
  const alternates = alternatesFor(
    locale,
    `destinations/${destination.slug}${suffix}`,
  );

  /*
   * Картинка для соцсетей обязана быть полным адресом. destImage отдаёт
   * относительный путь для файлов из статики сайта («/Cards/uz.webp») —
   * по такому адресу ни один мессенджер картинку не найдёт.
   */
  const raw = destImage(destination.card_image || destination.hero_image);
  const image = raw.startsWith("/") ? absoluteUrl(raw) : raw;

  /*
   * Название компании подставляем сами, а не шаблоном «%s | Sayoda Travel»
   * из корневого макета. Шаблон применяется только к прямым потомкам, а
   * макет страны задаёт свой заголовок строкой — и для вкладок, лежащих на
   * уровень глубже, шаблона уже нет. В выдаче это было видно: обзор шёл с
   * названием компании, а «Hotels — Kazakhstan» без него.
   *
   * absolute означает «взять как есть»: даже если шаблон где-то появится,
   * второго названия в конце не будет.
   */
  return {
    title: { absolute: `${title} | ${SITE_NAME}` },
    description,
    alternates,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale,
      url: alternates.canonical,
      title,
      description,
      images: image ? [{ url: image, alt: name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
