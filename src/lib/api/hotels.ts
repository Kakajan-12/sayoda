import { BASE_API_URL } from "@/i18n/api";

/**
 * Отели и города.
 *
 * Раньше двенадцать отелей лежали прямо в коде — 318 строк в
 * hotelsFallback.ts, — и заказчик не мог ни добавить отель, ни поправить
 * адрес. Теперь это обычный раздел админки.
 *
 * Город приезжает вместе с отелем: и название на трёх языках для фильтра, и
 * слаг страны, чтобы отобрать отели одного направления. Отдельного запроса
 * за городами странице не нужно.
 */

/** Как часто перепроверяем — как у каталога и стран. */
export const HOTELS_REVALIDATE = 300;

export interface Hotel {
  id: number;
  city_id: number;
  sort_order: number;
  name_tk: string;
  name_en: string;
  name_ru: string;
  address_tk: string;
  address_en: string;
  address_ru: string;
  image: string | null;
  /**
   * Категория отеля, 1–5. null — не указана.
   *
   * Не путать с оценкой посетителей: её у нас нет и не будет, пока не
   * появятся настоящие отзывы. В прежней статике у отелей стояли
   * выдуманные 4.5 и «194 отзыва», и карточка рисовала их как настоящие.
   */
  stars: number | null;
  breakfast: number;
  kids_play_area: number;
  parking: number;
  wifi: number;
  included_breakfast: number;
  included_travel_tax: number;
  book_url: string | null;
  /** Из связанного города. */
  city_tk: string;
  city_en: string;
  city_ru: string;
  destination_id: number;
  /** Слаг страны, например "turkmenistan". */
  country: string;
}

export async function getHotels(): Promise<Hotel[]> {
  try {
    const res = await fetch(`${BASE_API_URL}/api/hotels`, {
      next: { revalidate: HOTELS_REVALIDATE },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as Hotel[]) : [];
  } catch {
    // Пустой список означает, что раздел не выведется. Для отелей это
    // лучше упавшей страницы: остальной сайт от недоступного API не
    // страдает.
    return [];
  }
}

/** Значение поля на нужном языке с откатом на английский, затем на туркменский. */
export function getLocalizedHotelField(
  hotel: Hotel,
  locale: string,
  field: "name" | "city" | "address",
) {
  const record = hotel as unknown as Record<string, string | null>;
  return String(
    record[`${field}_${locale}`] ||
      record[`${field}_en`] ||
      record[`${field}_tk`] ||
      "",
  ).trim();
}

/**
 * Города, по которым есть отели, в порядке их появления в списке.
 *
 * Считаются по самим отелям, а не отдельным запросом: город без единого
 * отеля в фильтре не нужен — по нему всё равно нечего показать.
 *
 * Ключ — id города, а не название: названия переводятся, а фильтр должен
 * переживать смену языка и не разъезжаться на «Ashgabat» и «Aşgabat».
 */
export function hotelCities(hotels: Hotel[], locale: string) {
  const seen = new Map<number, string>();
  for (const hotel of hotels) {
    if (!seen.has(hotel.city_id)) {
      seen.set(hotel.city_id, getLocalizedHotelField(hotel, locale, "city"));
    }
  }
  return Array.from(seen, ([id, label]) => ({ id, label }));
}
