import TestimonialsSlider from "@/components/about/TestimonialsSlider";
import { getTestimonials } from "@/lib/api/testimonials";

/**
 * Отзывы.
 *
 * Пустой раздел с заголовком «Отзывы» вредит больше, чем его отсутствие: он
 * прямо сообщает, что компанию никто не хвалил. Нет отзывов — нет и блока,
 * причём решается это на сервере, а не после загрузки в браузере: иначе
 * заголовок успевает попасть в разметку и пропасть у посетителя на глазах.
 */
export default async function Testimonials() {
  const testimonials = await getTestimonials();
  if (!testimonials.length) return null;

  return <TestimonialsSlider testimonials={testimonials} />;
}
