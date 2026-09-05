import { BASE_API_URL } from "@/i18n/api";
import {
  destinations as staticDestinations,
  type Destination as StaticDestination,
} from "@/data/destinations";

/**
 * Направления из админки.
 *
 * Контент жил в src/data/destinations.ts на 496 строк: поправить описание
 * страны можно было только через передеплой. Теперь он в базе.
 *
 * Статический файл остаётся запасным вариантом. Раздел большой и целиком
 * индексируется поиском — отдавать пустые страницы при недоступном API
 * нельзя, это потеря позиций, а не временная неприятность.
 */

export const DESTINATIONS_REVALIDATE = 300;

export interface DestinationSectionImage {
  src: string;
  caption_tk: string | null;
  caption_en: string | null;
  caption_ru: string | null;
}

export interface DestinationSection {
  id: number;
  section_key: string;
  icon: string | null;
  title_tk: string | null;
  title_en: string | null;
  title_ru: string | null;
  body_tk: string | null;
  body_en: string | null;
  body_ru: string | null;
  images: DestinationSectionImage[];
}

export interface Destination {
  id: number;
  slug: string;
  hero_image: string | null;
  name_tk: string | null;
  name_en: string | null;
  name_ru: string | null;
  hero_title_tk: string | null;
  hero_title_en: string | null;
  hero_title_ru: string | null;
  intro_tk: string | null;
  intro_en: string | null;
  intro_ru: string | null;
  visa_tk: string | null;
  visa_en: string | null;
  visa_ru: string | null;
  sections: DestinationSection[];
}

/** Приводит запись из статического файла к форме, которую отдаёт API. */
function fromStatic(d: StaticDestination, index: number): Destination {
  return {
    id: -(index + 1), // отрицательные id, чтобы не спутать с настоящими
    slug: d.slug,
    hero_image: d.heroImage,
    name_tk: d.name.tk, name_en: d.name.en, name_ru: d.name.ru,
    hero_title_tk: d.heroTitle.tk, hero_title_en: d.heroTitle.en, hero_title_ru: d.heroTitle.ru,
    intro_tk: d.intro.tk, intro_en: d.intro.en, intro_ru: d.intro.ru,
    visa_tk: d.visa.tk, visa_en: d.visa.en, visa_ru: d.visa.ru,
    sections: d.sections.map((s, i) => ({
      id: -(i + 1),
      section_key: s.id,
      icon: s.icon,
      title_tk: s.title.tk, title_en: s.title.en, title_ru: s.title.ru,
      body_tk: s.body.tk, body_en: s.body.en, body_ru: s.body.ru,
      images: (s.images || []).map((im) => ({
        src: im.src,
        caption_tk: im.caption.tk, caption_en: im.caption.en, caption_ru: im.caption.ru,
      })),
    })),
  };
}

const STATIC_FALLBACK: Destination[] = staticDestinations.map(fromStatic);

export async function getDestinations(): Promise<Destination[]> {
  try {
    const res = await fetch(`${BASE_API_URL}/api/destinations`, {
      next: { revalidate: DESTINATIONS_REVALIDATE },
    });
    if (!res.ok) return STATIC_FALLBACK;
    const data = (await res.json()) as Destination[];
    return Array.isArray(data) && data.length ? data : STATIC_FALLBACK;
  } catch {
    return STATIC_FALLBACK;
  }
}

export async function getDestinationBySlug(
  slug: string,
): Promise<Destination | undefined> {
  try {
    const res = await fetch(`${BASE_API_URL}/api/destinations/${slug}`, {
      next: { revalidate: DESTINATIONS_REVALIDATE },
    });
    if (res.ok) {
      const data = (await res.json()) as Destination;
      if (data && data.slug) return data;
    }
    // 404 из API — настоящий 404, а не повод показать статику: страну могли
    // намеренно удалить в админке.
    if (res.status === 404) return undefined;
  } catch {
    // сеть недоступна — ниже отдадим запасной вариант
  }
  return STATIC_FALLBACK.find((d) => d.slug === slug);
}

/** Локализованное поле с фолбэком на английский, затем на туркменский. */
export function destField(
  source: Destination | DestinationSection | DestinationSectionImage | undefined,
  base: string,
  locale: string,
): string {
  if (!source) return "";
  const rec = source as unknown as Record<string, unknown>;
  const value = rec[`${base}_${locale}`] ?? rec[`${base}_en`] ?? rec[`${base}_tk`];
  return typeof value === "string" ? value : "";
}

/**
 * Адрес картинки.
 *
 * Перенесённые из статики пути начинаются со слэша и лежат в public фронтенда.
 * Загруженные через админку приходят как uploads/... и живут на домене API.
 */
export function destImage(src: string | null | undefined): string {
  if (!src) return "";
  if (src.startsWith("/")) return src;
  return `${BASE_API_URL.replace(/\/+$/, "")}/${src
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")}`;
}
