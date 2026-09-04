import { BASE_API_URL } from "@/i18n/api";
import { mediaUrl } from "@/lib/api/catalog";

/**
 * Главный баннер первого экрана из админки.
 *
 * Заголовок, подзаголовок и подпись кнопки раньше лежали в messages/*.json,
 * а фон импортировался из public — поменять их мог только разработчик через
 * передеплой. Теперь это обычный редактируемый контент.
 *
 * Значения из локализации остаются запасным вариантом: если поле в админке
 * пустое или API недоступен, первый экран показывает прежний текст. Пустой
 * h1 на главной хуже устаревшего.
 */

export const BANNER_REVALIDATE = 60;

export interface Banner {
  image: string | null;
  title_tk: string | null;
  title_en: string | null;
  title_ru: string | null;
  subtitle_tk: string | null;
  subtitle_en: string | null;
  subtitle_ru: string | null;
  button_text_tk: string | null;
  button_text_en: string | null;
  button_text_ru: string | null;
  button_link: string | null;
}

export async function getBanner(): Promise<Partial<Banner>> {
  try {
    const res = await fetch(`${BASE_API_URL}/api/banner`, {
      next: { revalidate: BANNER_REVALIDATE },
    });
    if (!res.ok) return {};
    return (await res.json()) as Partial<Banner>;
  } catch {
    return {};
  }
}

/** Значение поля для локали; пустая строка считается «не задано». */
export function bannerField(
  banner: Partial<Banner>,
  base: "title" | "subtitle" | "button_text",
  locale: string,
): string {
  const value = banner[`${base}_${locale}` as keyof Banner];
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

/** Абсолютный адрес загруженного фона; пусто — используется картинка из вёрстки. */
export function bannerImage(banner: Partial<Banner>): string {
  return banner.image ? mediaUrl(banner.image) : "";
}
