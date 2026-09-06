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
