import { BASE_API_URL } from "@/i18n/api";
import { COMPANY, CONTACT_FALLBACK } from "@/lib/site";
import { plainText } from "@/lib/utils";

/**
 * Серверное чтение контактов из админки.
 *
 * Контакты правит заказчик через админку, поэтому источник правды — API.
 * Но футер и хедер тянут их в браузере, из-за чего в серверном HTML на месте
 * телефона и почты пусто: краулер видит `tel:` без номера. Здесь те же данные
 * читаются на сервере, а если API не ответил — подставляются значения из
 * `CONTACT_FALLBACK`, чтобы у страницы всегда был рабочий способ связи.
 */

export const CONTACTS_REVALIDATE = 3600;

export interface SocialLink {
  id: number;
  icon: string;
  url: string;
}

export interface SiteContacts {
  phone: string;
  email: string;
  address: string;
  socials: SocialLink[];
}

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${BASE_API_URL}${path}`, {
      next: { revalidate: CONTACTS_REVALIDATE },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export async function getContacts(locale: string): Promise<SiteContacts> {
  const [addresses, mails, numbers, socials] = await Promise.all([
    getJson<Array<Record<string, string>>>("/api/contact-address", []),
    getJson<Array<{ mail: string }>>("/api/contact-mails", []),
    getJson<Array<{ number: string }>>("/api/contact-numbers", []),
    getJson<SocialLink[]>("/api/links", []),
  ]);

  const addressRow = addresses[0];
  const address = addressRow
    ? plainText(
        addressRow[`address_${locale}`] ||
          addressRow.address_en ||
          addressRow.address_tk,
      )
    : "";

  return {
    phone: numbers[0]?.number || CONTACT_FALLBACK.phone,
    email: mails[0]?.mail || CONTACT_FALLBACK.email,
    address: address || CONTACT_FALLBACK.address,
    socials: Array.isArray(socials) ? socials : [],
  };
}

/** Телефон в виде, пригодном для href="tel:" — без пробелов и скобок. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/**
 * Ссылка на WhatsApp с предзаполненным текстом.
 *
 * Приоритет источников:
 *   1. COMPANY.whatsapp — если заказчик задал отдельный номер;
 *   2. запись с icon="whatsapp" в админке (раздел «Ссылки») — там уже можно
 *      сохранить готовый https://wa.me/... ;
 *   3. основной телефон компании.
 *
 * Благодаря шагам 2–3 кнопка работает сразу, не дожидаясь отдельного номера.
 */
export function whatsappHref(
  contacts: SiteContacts,
  text?: string,
): string | null {
  const query = text ? `?text=${encodeURIComponent(text)}` : "";

  if (COMPANY.whatsapp) {
    const digits = COMPANY.whatsapp.replace(/\D/g, "");
    if (digits) return `https://wa.me/${digits}${query}`;
  }

  const fromCms = contacts.socials.find(
    (s) => s.icon?.toLowerCase() === "whatsapp",
  );
  if (fromCms?.url) {
    // В админке может лежать как wa.me/<номер>, так и просто номер.
    const digits = fromCms.url.replace(/\D/g, "");
    if (/^https?:\/\//i.test(fromCms.url)) {
      return `${fromCms.url.split("?")[0]}${query}`;
    }
    if (digits) return `https://wa.me/${digits}${query}`;
  }

  const digits = contacts.phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}${query}` : null;
}
