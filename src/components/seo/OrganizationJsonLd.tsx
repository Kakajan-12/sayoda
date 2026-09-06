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

  const sameAs = contacts.socials.map((s) => s.url).filter(Boolean);
  if (sameAs.length) data.sameAs = sameAs;

  return <JsonLd data={data} />;
}
