import { routing } from "@/i18n/routing";

/**
 * Единая точка правды для канонического адреса сайта и данных компании.
 *
 * Контакты (адрес, телефон, e-mail, соцсети) остаются в админке — заказчик
 * должен править их сам. Здесь лежит только то, чего в CMS нет: канонический
 * домен, юридические реквизиты и запасные значения контактов на случай, когда
 * API недоступен во время серверного рендера. Пустая строка означает «данных
 * ещё нет» — потребители обязаны такие поля пропускать, а не печатать пустоту.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://sayodatravel.com"
).replace(/\/+$/, "");

export const SITE_NAME = "Sayoda Travel";

export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;

/** Запасные контакты — совпадают с тем, что сейчас лежит в базе. */
export const CONTACT_FALLBACK = {
  phone: "+99361169097",
  email: "info@sayodatravel.com",
  address: "Turkmenistan, Ashgabat, Bitarap Turkmenistan street, Altyn Yupluk bldg",
} as const;

/**
 * Реквизиты для футера, страницы «О нас» и schema.org.
 * Заполняются заказчиком; пока пусто — блоки доверия их не выводят.
 *
 * Тип задан явно (а не через `as const`): иначе пустая строка сузилась бы
 * до литерального типа `""`, и проверка `if (COMPANY.whatsapp)` давала бы
 * `never` в ветке «значение задано».
 */
export interface CompanyDetails {
  legalName: string;
  licenseNumber: string;
  /** Номер для WhatsApp в международном формате, лишние символы отбрасываются. */
  whatsapp: string;
  foundedYear: string;
}

export const COMPANY: CompanyDetails = {
  legalName: process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME || "",
  licenseNumber: process.env.NEXT_PUBLIC_LICENSE_NUMBER || "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "",
  foundedYear: process.env.NEXT_PUBLIC_FOUNDED_YEAR || "",
};

/** Абсолютный URL — нужен для canonical, hreflang, Open Graph и sitemap. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Абсолютный URL страницы в конкретной локали: /en/tours, /ru/tours, ... */
export function localizedUrl(locale: string, path = ""): string {
  const clean = path.replace(/^\/+/, "");
  return absoluteUrl(clean ? `/${locale}/${clean}` : `/${locale}`);
}

/**
 * Блок alternates для generateMetadata: canonical на текущую локаль плюс
 * hreflang на все остальные и x-default на локаль по умолчанию.
 */
export function alternatesFor(locale: string, path = "") {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = localizedUrl(l, path);
  languages["x-default"] = localizedUrl(defaultLocale, path);

  return {
    canonical: localizedUrl(locale, path),
    languages,
  };
}
