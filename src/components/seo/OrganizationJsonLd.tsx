import JsonLd from "./JsonLd";
import { getContacts } from "@/lib/api/contacts";
import { getSettings } from "@/lib/api/settings";
import { SITE_NAME, absoluteUrl, localizedUrl } from "@/lib/site";

/**
 * Разметка TravelAgency для всего сайта.
 *
 * Незаполненные реквизиты (юрлицо, номер лицензии) в JSON-LD не попадают:
 * пустое поле в schema.org хуже отсутствующего — валидаторы считают его
 * ошибкой, а поисковик — недостоверными данными.
 */
export default async function OrganizationJsonLd({
  locale,
}: {
  locale: string;
}) {
  const [contacts, settings] = await Promise.all([
    getContacts(locale),
    getSettings(),
  ]);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${absoluteUrl("/")}#organization`,
    name: SITE_NAME,
    url: localizedUrl(locale),
    telephone: contacts.phone,
    email: contacts.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contacts.address,
      addressLocality: "Ashgabat",
      addressCountry: "TM",
    },
    areaServed: [
      { "@type": "Country", name: "Turkmenistan" },
      { "@type": "Country", name: "Uzbekistan" },
      { "@type": "Country", name: "Tajikistan" },
      { "@type": "Country", name: "Kazakhstan" },
      { "@type": "Country", name: "Kyrgyzstan" },
    ],
  };

  if (settings.company_legal_name) data.legalName = settings.company_legal_name;
  if (settings.founded_year) data.foundingDate = settings.founded_year;
  if (settings.license_number) {
    data.hasCredential = {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Tour operator license",
      identifier: settings.license_number,
    };
  }

  /*
   * Часы работы отдаём только в родном формате schema.org — «Mo-Fr 09:00-18:00».
   * В настройках они хранятся именно так, и если заказчик ввёл что-то своё,
   * строка на страницу попадёт, а в разметку нет: непонятое значение поиск
   * трактует как ошибку данных, а не как «часы неизвестны».
   */
  if (/^[A-Za-z]{2}(-[A-Za-z]{2})?\s+\d{2}:\d{2}-\d{2}:\d{2}$/.test(
      (settings.office_hours || "").trim())) {
    data.openingHours = (settings.office_hours || "").trim();
  }

  // Языки, на которых можно обратиться. Для въездного оператора это часть
  // предложения, а не справка: от языка гида зависит, состоится ли поездка.
  const languages = (settings.guide_languages || "")
    .split(",")
    .map((code) => code.trim())
    .filter(Boolean);
  if (languages.length) data.availableLanguage = languages;

  const sameAs = contacts.socials.map((s) => s.url).filter(Boolean);
  if (sameAs.length) data.sameAs = sameAs;

  return <JsonLd data={data} />;
}
