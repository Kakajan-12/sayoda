import { BASE_API_URL } from "@/i18n/api";

/**
 * Отзывы из админки.
 *
 * Читаются на сервере: раньше их тянул из браузера сам компонент карусели,
 * и до ответа в разметке висел заголовок «Отзывы» с полосой загрузки — при
 * том, что отзывов в базе ноль.
 */
export const TESTIMONIALS_REVALIDATE = 300;

export interface Testimonial {
  id: number;
  name: string;
  image: string;
  text: string;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(`${BASE_API_URL}/api/testimonials`, {
      next: { revalidate: TESTIMONIALS_REVALIDATE },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as Testimonial[]) : [];
  } catch {
    // Пустой список означает, что раздел не выведется. Для отзывов это
    // лучше упавшей страницы.
    return [];
  }
}
