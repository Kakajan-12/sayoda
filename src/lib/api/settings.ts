import { BASE_API_URL } from "@/i18n/api";

/**
 * Настройки сайта из админки: счётчик GA4, номер WhatsApp, реквизиты.
 *
 * Раньше эти значения жили в переменных окружения, то есть менять их мог
 * только разработчик через передеплой на Vercel. Теперь источник правды —
 * база, и заказчик правит их сам.
 *
 * Читается на сервере при рендере. Если API недоступен, возвращаются пустые
 * значения: пустая настройка означает «выключено» (счётчик не подключается,
 * реквизиты не выводятся), а не ошибку страницы.
 */

/**
 * Настройки кэшируются на минуту, а не на час, как остальной контент.
 * Их правят редко, но правят вручную и сразу проверяют результат на сайте:
 * час ожидания превращает настройку счётчика или чата в гадание, включилось
 * оно или нет. Запрос лёгкий, лишняя нагрузка на бэкенд незаметна.
 */
export const SETTINGS_REVALIDATE = 60;

export interface SiteSettings {
  ga4_id: string | null;
  whatsapp: string | null;
  company_legal_name: string | null;
  license_number: string | null;
  founded_year: string | null;
  /** Виджет Tawk.to: propertyId/widgetId. Пусто — чат не выводится. */
  tawk_id: string | null;

  /*
   * Данные для страниц «О нас» и «Контакты». Формат машинный и один на все
   * языки — перевод собирает сайт. Иначе пришлось бы держать по три ключа на
   * значение и следить, чтобы они не разошлись.
   */
  /** Часы работы в формате schema.org: «Mo-Fr 09:00-18:00». */
  office_hours: string | null;
  /** За сколько часов отвечаем на заявку. Число строкой. */
  response_time_hours: string | null;
  /** Языки гидов кодами через запятую: «en,ru,tk,tr». */
  guide_languages: string | null;
  team_size: string | null;
  travellers_served: string | null;
}

const EMPTY_SETTINGS: SiteSettings = {
  ga4_id: null,
  whatsapp: null,
  company_legal_name: null,
  license_number: null,
  founded_year: null,
  tawk_id: null,
  office_hours: null,
  response_time_hours: null,
  guide_languages: null,
  team_size: null,
  travellers_served: null,
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${BASE_API_URL}/api/settings`, {
      next: { revalidate: SETTINGS_REVALIDATE },
    });
    if (!res.ok) return EMPTY_SETTINGS;
    const data = (await res.json()) as Partial<SiteSettings>;
    return { ...EMPTY_SETTINGS, ...data };
  } catch {
    return EMPTY_SETTINGS;
  }
}
