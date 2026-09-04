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
}

const EMPTY_SETTINGS: SiteSettings = {
  ga4_id: null,
  whatsapp: null,
  company_legal_name: null,
  license_number: null,
  founded_year: null,
  tawk_id: null,
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
