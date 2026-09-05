import { BASE_API_URL } from "@/i18n/api";

/**
 * Серверный слой доступа к API для Server Components.
 *
 * Отличие от `src/api/*` и хуков в `src/Hooks/*`: там данные грузятся в
 * браузере после гидрации, поэтому в серверном HTML их нет и краулеры их не
 * видят. Здесь тот же API вызывается на сервере с ISR-кэшем, чтобы карточки
 * туров и статьи попадали в HTML и в sitemap.
 *
 * Ошибку сети наверх не пробрасываем: пустой список лучше, чем упавшая
 * страница — на продающем сайте 500 стоит дороже, чем недостающий блок.
 */

/** Как часто перепроверять данные CMS, в секундах. */
export const CATALOG_REVALIDATE = 3600;

export interface Tour {
  id: number;
  /** Адрес страницы. Заполнен у всех записей миграцией 007. */
  slug: string;
  image: string;
  popular: number;
  title_tk: string;
  title_en: string;
  title_ru: string;
  text_tk: string;
  text_en: string;
  text_ru: string;
  destination_tk: string;
  destination_en: string;
  destination_ru: string;
  duration_tk: string;
  duration_en: string;
  duration_ru: string;
  lang_tk: string;
  lang_en: string;
  lang_ru: string;
  price: number;
  map?: string;
  tour_type_id: number;
  tour_cat_id: number;
  location_id: number;
  type_tk: string;
  type_en: string;
  type_ru: string;
  cat_tk: string;
  cat_en: string;
  cat_ru: string;
  location_tk: string;
  location_en: string;
  location_ru: string;
}

export interface Blog {
  id: number;
  /** Адрес страницы. Заполнен у всех записей миграцией 007. */
  slug: string;
  image: string;
  title_tk: string;
  title_en: string;
  title_ru: string;
  text_tk: string;
  text_en: string;
  text_ru: string;
  date: string;
}

export interface TaxonomyItem {
  id: number;
  [key: string]: string | number;
}

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${BASE_API_URL}${path}`, {
      next: { revalidate: CATALOG_REVALIDATE },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export const getTours = () => getJson<Tour[]>("/api/tours", []);

export const getTourCategories = () =>
  getJson<TaxonomyItem[]>("/api/tour-category", []);

export const getTourLocations = () =>
  getJson<TaxonomyItem[]>("/api/tour-location", []);

/**
 * API отдаёт статьи в порядке id, а не по дате: в списке статья от 7 августа
 * стояла между двумя от 23-го. Для блога свежесть — главный признак, поэтому
 * сортируем сами; на бэкенде порядок менять не стали, чтобы не задеть админку,
 * которая опирается на тот же список.
 */
export const getBlogs = async () => {
  const blogs = await getJson<Blog[]>("/api/blogs", []);
  return [...blogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};

export interface VisaEntry {
  id: number;
  title_tk: string;
  title_en: string;
  title_ru: string;
}

export const getVisaEntries = () => getJson<VisaEntry[]>("/api/visa", []);

/** Принимает слаг (сайт) или числовой id — бэкенд различает их сам. */
export async function getTour(key: string | number): Promise<Tour | null> {
  return getJson<Tour | null>(`/api/tours/${key}`, null);
}

/** Принимает слаг (сайт) или числовой id — бэкенд различает их сам. */
export async function getBlog(key: string | number): Promise<Blog | null> {
  const data = await getJson<Blog | Blog[] | null>(`/api/blogs/${key}`, null);
  // Эндпоинт блога иногда отдаёт массив из одной записи, иногда объект.
  return Array.isArray(data) ? (data[0] ?? null) : data;
}

/** Локализованное поле CMS с фолбэком на английский, затем на туркменский. */
export function localizedField(
  item: object | null | undefined,
  field: string,
  locale: string,
): string {
  if (!item) return "";
  // Интерфейсы вроде Tour не имеют index signature, поэтому читаем через каст.
  const record = item as Record<string, unknown>;
  return String(
    record[`${field}_${locale}`] ||
      record[`${field}_en`] ||
      record[`${field}_tk`] ||
      "",
  );
}

/** Приводит путь к картинке из CMS к абсолютному URL. */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  return `${BASE_API_URL.replace(/\/+$/, "")}/${String(path)
    .replace(/\\/g, "/")
    .replace(/^(\.\.\/)+/, "")
    .replace(/^\/+/, "")
    .replace(/^app\//, "")}`;
}

/** Вытаскивает число дней из поля duration (в базе там и "3", и "<p>11</p>"). */
export function durationDays(value: string | null | undefined): number | null {
  const match = String(value ?? "").match(/\d+/);
  return match ? Number(match[0]) : null;
}
