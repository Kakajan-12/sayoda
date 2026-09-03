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

export const SETTINGS_REVALIDATE = 3600;

export interface SiteSettings {
  ga4_id: string | null;
  whatsapp: string | null;
  company_legal_name: string | null;
  license_number: string | null;
  founded_year: string | null;
}

const EMPTY_SETTINGS: SiteSettings = {
  ga4_id: null,
  whatsapp: null,
  company_legal_name: null,
  license_number: null,
  founded_year: null,
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
