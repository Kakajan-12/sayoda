import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SITE_NAME, alternatesFor } from "@/lib/site";

/**
 * Собирает metadata для статической страницы по ключу из namespace `Seo`.
 * Тексты живут в messages/*.json, поэтому их видно и правится всё в одном месте.
 *
 * @param key  ключ внутри Seo, например "tours" → Seo.tours.title/.description
 * @param path путь без локали: "tours", "blog", "" для главной
 */
export async function pageMetadata(
  locale: string,
  key: string,
  path: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Seo" });
  const title = t(`${key}.title`);
  const description = t(`${key}.description`);
  const alternates = alternatesFor(locale, path);

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale,
      url: alternates.canonical,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
