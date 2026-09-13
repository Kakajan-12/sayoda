import { BASE_API_URL } from "@/i18n/api";

/**
 * Частые вопросы из админки.
 *
 * Раньше лежали в файлах локализации, то есть поправить формулировку мог
 * только разработчик через передеплой. Вопросы пополняются по мере
 * обращений туристов — это контент заказчика, а не разработчика.
 */

/**
 * Перепроверяем раз в пять минут, как каталог и страницы стран: заказчик
 * правит вопрос и хочет увидеть результат, а не гадать, обновилось ли.
 */
export const FAQ_REVALIDATE = 300;

export interface FaqItem {
  id: number;
  sort_order: number;
  /**
   * Страна вопроса. null — общий вопрос.
   *
   * Значение здесь значащее, а не «не заполнено»: вопрос без страны
   * показывается на главной, вопрос со страной — на визовой странице этой
   * страны, и только там. Так главная и визовый раздел не дублируют друг
   * друга: одинаковую разметку FAQPage на двух адресах поиск считает
   * дублем и обычно не показывает ни один.
   */
  destination_id: number | null;
  question_tk: string | null;
  question_en: string | null;
  question_ru: string | null;
  answer_tk: string | null;
  answer_en: string | null;
  answer_ru: string | null;
}

export async function getFaq(): Promise<FaqItem[]> {
  try {
    const res = await fetch(`${BASE_API_URL}/api/faq`, {
      next: { revalidate: FAQ_REVALIDATE },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    // Пустой список означает, что блок не выведется. Для FAQ это лучше
    // упавшей страницы: остальная главная от недоступного API не страдает.
    return [];
  }
}

/**
 * Вопросы одной страны или, если страна не задана, общие.
 *
 * Старые записи, сделанные до появления привязки, приезжают из API без
 * поля вовсе — отсюда проверка на undefined, а не только на null.
 */
export function faqFor(
  items: FaqItem[],
  destinationId?: number | null,
): FaqItem[] {
  if (destinationId) {
    return items.filter((item) => item.destination_id === destinationId);
  }
  return items.filter((item) => !item.destination_id);
}

/** Значение поля на нужном языке с откатом на английский, затем на туркменский. */
export function faqField(
  item: FaqItem,
  field: "question" | "answer",
  locale: string,
): string {
  const record = item as unknown as Record<string, string | null>;
  return String(
    record[`${field}_${locale}`] ||
      record[`${field}_en`] ||
      record[`${field}_tk`] ||
      "",
  ).trim();
}
