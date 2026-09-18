import { BASE_API_URL } from "@/i18n/api";
import { CONTACT_FALLBACK } from "@/lib/site";
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
  /**
   * Адрес карты из поля iframe.
   *
   * В базе лежит целиком тег <iframe> — так его вставляют из Google Maps, и
   * бэкенд чистит именно его. Сайту нужен только src: свой тег он собирает
   * сам, с отложенной загрузкой и подписью для скринридера. Вставлять чужую
   * разметку через dangerouslySetInnerHTML ради этого незачем.
   */
  mapEmbed: string;
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

/**
 * Один офис: название точки и всё, что к ней привязано.
 *
 * В админке это «Точки на карте» плюс три соседних раздела — адрес,
 * телефоны, почты. Каждая запись там хранит location_id_real, то есть
 * ссылку на точку; по нему всё и собирается.
 */
export interface Office {
  id: number;
  /** Название точки: «Туркменистан», «Узбекистан». */
  name: string;
  address: string;
  phone: string;
  email: string;
  /** Адрес карты из поля iframe — только src, без чужой разметки. */
  mapEmbed: string;
}

/** Достаёт src из тега <iframe> и пропускает только карты Google. */
function mapSrc(iframe?: string): string {
  const raw = /src="([^"]+)"/.exec(iframe || "")?.[1] || "";
  // Чужой домен здесь — сторонний код на странице, поэтому проверяем.
  return /^https:\/\/(www\.)?google\.com\/maps\/embed/.test(raw) ? raw : "";
}

/** Берёт поле нужного языка с откатом на английский и туркменский. */
function поЯзыку(
  row: Record<string, string> | undefined,
  base: string,
  locale: string,
): string {
  if (!row) return "";
  return plainText(row[`${base}_${locale}`] || row[`${base}_en`] || row[`${base}_tk`]);
}

/**
 * Офисы компании со всеми реквизитами.
 *
 * Разделы админки связаны через location_id_real, но страница контактов
 * этой связи не знала: брала первый адрес, первый телефон и первую почту.
 * Пока офис один, разницы не было; со вторым на сайте не появилось бы
 * ничего — ни его адреса, ни телефона.
 *
 * Точки без адреса пропускаем: показывать вкладку с одним названием и
 * пустотой под ним хуже, чем не показывать её вовсе.
 */
export async function getOffices(locale: string): Promise<Office[]> {
  const [locations, addresses, mails, numbers] = await Promise.all([
    getJson<Array<Record<string, string>>>("/api/contact-location", []),
    getJson<Array<Record<string, string>>>("/api/contact-address", []),
    getJson<Array<Record<string, string>>>("/api/contact-mails", []),
    getJson<Array<Record<string, string>>>("/api/contact-numbers", []),
  ]);

  const кОфису = (rows: Array<Record<string, string>>, id: number) =>
    rows.find((row) => Number(row.location_id_real) === id);

  return locations
    .map((loc) => {
      const id = Number(loc.id);
      const address = кОфису(addresses, id);
      return {
        id,
        name: поЯзыку(loc, "location", locale),
        address: поЯзыку(address, "address", locale),
        phone: кОфису(numbers, id)?.number || "",
        email: кОфису(mails, id)?.mail || "",
        mapEmbed: mapSrc(address?.iframe),
      };
    })
    .filter((office) => office.address);
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

  // Только google.com/maps: в поле может оказаться что угодно, а мы ставим
  // этот адрес в src фрейма. Чужой домен здесь — сторонний код на странице.
  const rawSrc = /src="([^"]+)"/.exec(addressRow?.iframe || "")?.[1] || "";
  const mapEmbed = /^https:\/\/(www\.)?google\.com\/maps\/embed/.test(rawSrc)
    ? rawSrc
    : "";

  return {
    phone: numbers[0]?.number || CONTACT_FALLBACK.phone,
    email: mails[0]?.mail || CONTACT_FALLBACK.email,
    address: address || CONTACT_FALLBACK.address,
    socials: Array.isArray(socials) ? socials : [],
    mapEmbed,
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
 *   1. настройка whatsapp из админки — если задан отдельный номер;
 *   2. запись с icon="whatsapp" в разделе «Ссылки» — там уже можно
 *      сохранить готовый https://wa.me/... ;
 *   3. основной телефон компании.
 *
 * Благодаря шагам 2–3 кнопка работает сразу, не дожидаясь отдельного номера.
 */
export function whatsappHref(
  contacts: SiteContacts,
  text?: string,
  /** Номер из настроек админки; имеет приоритет над остальными источниками. */
  whatsappSetting?: string | null,
): string | null {
  const query = text ? `?text=${encodeURIComponent(text)}` : "";

  if (whatsappSetting) {
    const digits = whatsappSetting.replace(/\D/g, "");
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
