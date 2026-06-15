import { BASE_API_URL } from "@/i18n/api";

// NOTE: the `/api/hotels` endpoint is not live yet. This helper is built by
// analogy with getVisa/getTours so that, once the backend ships, the hotels
// page starts using real data automatically. Until then `getHotels` returns an
// empty array and the page falls back to `hotelsFallback`.
export interface Hotel {
  id: number;
  /** destination slug this hotel belongs to (e.g. "turkmenistan") */
  country?: string;
  name_tk: string;
  name_en: string;
  name_ru: string;
  city_tk: string;
  city_en: string;
  city_ru: string;
  address_tk: string;
  address_en: string;
  address_ru: string;
  image: string;
  /** 0–5, supports halves */
  rating: number;
  reviews: number;
  review_label_tk: string;
  review_label_en: string;
  review_label_ru: string;
  /** amenity flags (0 | 1) */
  breakfast: number;
  kids_play_area: number;
  parking: number;
  wifi: number;
  /** "included in the price" flags (0 | 1) */
  included_breakfast: number;
  included_travel_tax: number;
  book_url: string;
}

export async function getHotels(): Promise<Hotel[]> {
  try {
    const res = await fetch(`${BASE_API_URL}/api/hotels`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as Hotel[]) : [];
  } catch {
    return [];
  }
}

export function getLocalizedHotelField(
  hotel: Hotel,
  locale: string,
  field: "name" | "city" | "address" | "review_label",
) {
  const key = `${field}_${locale}` as keyof Hotel;
  return (
    (hotel[key] as string) ||
    (hotel[`${field}_en` as keyof Hotel] as string) ||
    (hotel[`${field}_tk` as keyof Hotel] as string) ||
    ""
  );
}
