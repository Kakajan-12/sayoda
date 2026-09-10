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

/**
 * Как часто перепроверять данные CMS, в секундах.
 *
 * Был час. Для заказчика это означало, что правка цены или названия тура
 * появляется на сайте неизвестно когда, и проверить результат сразу после
 * сохранения нельзя. Пять минут — столько же, сколько у страниц стран.
 */
export const CATALOG_REVALIDATE = 300;

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
  /**
   * Встроенная карта Google My Maps: маршрут рисуют вручную и вставляют
   * ссылкой. Пусто — на странице остаётся картинка из поля map.
   */
  map_embed?: string | null;
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

/** Страница списка: сами записи и сколько их всего с учётом отбора. */
export interface Page<T> {
  items: T[];
  total: number;
}

/** Сколько карточек на странице каталога и блога. */
export const PER_PAGE = 12;

export interface ToursQuery {
  page?: number;
  perPage?: number;
  /** Идентификаторы из соответствующих справочников. */
  type?: number | null;
  cat?: number | null;
  destination?: number | null;
  popular?: boolean | null;
}

function toQuery(params: Record<string, string | number | undefined | null>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

/**
 * Запрашивает одну страницу списка.
 *
 * Общее число приходит заголовком X-Total-Count, а не в теле: так форма
 * ответа осталась массивом и страницы, читающие список целиком, не
 * пришлось переписывать.
 *
 * Если заголовка нет — считаем, что пришло всё. Такое бывает, когда
 * бэкенд ещё старой версии: список покажется, просто без разбивки.
 */
async function getPage<T>(path: string): Promise<Page<T>> {
  try {
    const res = await fetch(`${BASE_API_URL}${path}`, {
      next: { revalidate: CATALOG_REVALIDATE },
    });
    if (!res.ok) return { items: [], total: 0 };
    const items = (await res.json()) as T[];
    const header = res.headers.get("X-Total-Count");
    const total = header === null ? items.length : Number(header);
    return { items, total: Number.isFinite(total) ? total : items.length };
  } catch {
    return { items: [], total: 0 };
  }
}

export function getToursPage({
  page = 1,
  perPage = PER_PAGE,
  type,
  cat,
  destination,
  popular,
}: ToursQuery = {}): Promise<Page<Tour>> {
  return getPage<Tour>(
    `/api/tours${toQuery({
      page,
      limit: perPage,
      type,
      cat,
      destination,
      // popular хранится числом: true → 1, а false означает «не отбирать»
      popular: popular ? 1 : undefined,
    })}`,
  );
}

/**
 * Одна страница списка статей.
 *
 * Отбор по категории и поиск уходят на сервер вместе с номером страницы:
 * иначе счётчик страниц считался бы по всему блогу, а список — по
 * отобранному, и пагинация обещала бы страницы, которых нет.
 */
export function getBlogsPage(
  page = 1,
  perPage = PER_PAGE,
  filters: { category?: string; q?: string } = {},
): Promise<Page<Blog>> {
  return getPage<Blog>(
    `/api/blogs${toQuery({ page, limit: perPage, category: filters.category, q: filters.q })}`,
  );
}

/**
 * Категории статей для фильтра.
 *
 * Отдельным справочником, а не из самих статей: при постраничной выдаче
 * браузер видит двенадцать записей и построил бы фильтр из тех категорий,
 * что случайно попали на первую страницу.
 */
export const getBlogCategories = () =>
  getJson<TaxonomyItem[]>("/api/blog-category", []);

export const getTourCategories = () =>
  getJson<TaxonomyItem[]>("/api/tour-category", []);

/**
 * Типы туров отдельным справочником.
 *
 * Раньше список собирался из самих туров. При постраничной выдаче так
 * нельзя: браузер видит двенадцать записей и построил бы фильтр из тех
 * типов, что случайно попали на первую страницу.
 */
export const getTourTypes = () =>
  getJson<TaxonomyItem[]>("/api/tour-types", []);

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

/** День программы тура. */
export interface ItineraryDay {
  id: number;
  tour_id: number;
  title_tk: string;
  title_en: string;
  title_ru: string;
  text_tk: string;
  text_en: string;
  text_ru: string;
  /** Подпункты дня, если заполнены в CMS. */
  li?: { lii: string }[];
}

/** Строка списка «включено» или «не включено». */
export interface TourListItem {
  id: number;
  text_tk: string;
  text_en: string;
  text_ru: string;
}

/** Фотография в галерее тура. */
export interface TourPhoto {
  gallery_id: number;
  tour_id: number;
  image: string;
}

/**
 * Программа, состав цены и галерея тура.
 *
 * Раньше эти три блока грузились из браузера после гидрации, и в серверном
 * HTML страницы тура их не было вовсе: поисковик видел заголовок «Маршрут
 * тура» и пустоту под ним, а посетитель — полосу загрузки. Между тем это
 * и есть то, по чему тур выбирают. Данные забираются на сервере тем же
 * ISR-кэшем, что и сам тур, поэтому лишних запросов из браузера больше нет.
 */
export const getItinerary = (tourId: number) =>
  getJson<ItineraryDay[]>(`/api/itinerary?tourId=${tourId}`, []);

export const getIncludes = (tourId: number) =>
  getJson<TourListItem[]>(`/api/includes/tour/${tourId}`, []);

export const getExcludes = (tourId: number) =>
  getJson<TourListItem[]>(`/api/excludes/tour/${tourId}`, []);

export const getTourGallery = (tourId: number) =>
  getJson<TourPhoto[]>(`/api/tour-gallery/tour/${tourId}`, []);

/** Фотография в галерее статьи. */
export interface BlogPhoto {
  blog_gallery_id: number;
  blog_id: number;
  image: string;
}

/**
 * Снимки статьи. Забираются на сервере по той же причине, что и снимки
 * тура: из браузера они не попадали в HTML вовсе.
 */
export const getBlogGallery = (blogId: number) =>
  getJson<BlogPhoto[]>(`/api/blog-gallery/blog/${blogId}`, []);

/** Пункт «главного о туре» — короткая строка «ради чего ехать». */
export interface TourHighlight {
  id: number;
  tour_id: number;
  sort_order: number;
  text_tk: string;
  text_en: string;
  text_ru: string;
}

/** Состояние заезда. Другие значения бэкенд не принимает. */
export type DepartureStatus = "open" | "sold_out" | "closed";

/** Дата заезда группового тура. */
export interface Departure {
  id: number;
  tour_id: number;
  /** Всегда «ГГГГ-ММ-ДД»: бэкенд форматирует дату сам, объектов Date тут нет. */
  start_date: string;
  /** Не заполнена — сайт считает её из длительности тура. */
  end_date: string | null;
  /** Не заполнена — действует цена тура. */
  price: number | null;
  /** Не заполнено — места не считаем. Ноль означает, что мест нет. */
  seats_left: number | null;
  status: DepartureStatus;
}

export const getHighlights = (tourId: number) =>
  getJson<TourHighlight[]>(`/api/highlights/tour/${tourId}`, []);

/**
 * Заезды одного тура. Прошедшие даты отсеивает бэкенд по дате сервера —
 * считать «сегодня» здесь нельзя: страница закэширована, и её «сегодня»
 * может быть вчерашним.
 */
export const getDepartures = (tourId: number) =>
  getJson<Departure[]>(`/api/departures/tour/${tourId}`, []);

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

/**
 * Приводит путь к картинке из CMS к виду «uploads/файл».
 *
 * В базе лежат три разных написания одного и того же файла, и все три
 * настоящие. Multer отдаёт абсолютный путь внутри контейнера
 * («/app/uploads/x.webp»), часть старых записей хранит относительный
 * («uploads/x.webp»), а часть — с «../». Приводим к одному виду здесь, а
 * не в каждом месте вывода: пропущенная где-то одна нормализация даёт
 * битую картинку, которую видно только на живой странице.
 */
export function normalizeMediaPath(path: string | null | undefined): string {
  if (!path) return "";

  /*
   * Строки «undefined» и «null» считаем пустотой.
   *
   * Это не выдумка на всякий случай: в базе такое уже лежало. Форма
   * админки складывает значения в FormData, а FormData приводит к строке
   * что угодно — отсутствующее поле превращается в «undefined» и уезжает
   * в колонку с путём к файлу.
   *
   * Такая строка непустая, поэтому проходила дальше и давала адрес
   * вида api.sayodatravel.com/undefined. Next на нём падает, а падает он
   * при отрисовке списка — то есть одна испорченная запись роняла всю
   * страницу блога в 500, а не просто оставалась без картинки.
   */
  const raw = String(path).trim();
  if (raw === "undefined" || raw === "null") return "";

  return raw
    .replace(/\\/g, "/")
    .replace(/^(\.\.\/)+/, "")
    .replace(/^\/+/, "")
    .replace(/^app\//, "");
}

/** Приводит путь к картинке из CMS к абсолютному URL. */
export function mediaUrl(path: string | null | undefined): string {
  const clean = normalizeMediaPath(path);
  if (!clean) return "";
  return `${BASE_API_URL.replace(/\/+$/, "")}/${clean}`;
}

/** Вытаскивает число дней из поля duration (в базе там и "3", и "<p>11</p>"). */
export function durationDays(value: string | null | undefined): number | null {
  const match = String(value ?? "").match(/\d+/);
  return match ? Number(match[0]) : null;
}
