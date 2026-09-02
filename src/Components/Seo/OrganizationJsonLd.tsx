import JsonLd from "./JsonLd";
import { getContacts } from "@/lib/api/contacts";
import { COMPANY, SITE_NAME, absoluteUrl, localizedUrl } from "@/lib/site";

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
  const contacts = await getContacts(locale);

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

  if (COMPANY.legalName) data.legalName = COMPANY.legalName;
  if (COMPANY.foundedYear) data.foundingDate = COMPANY.foundedYear;
  if (COMPANY.licenseNumber) {
    data.hasCredential = {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Tour operator license",
      identifier: COMPANY.licenseNumber,
    };
  }

  const sameAs = contacts.socials.map((s) => s.url).filter(Boolean);
  if (sameAs.length) data.sameAs = sameAs;

  return <JsonLd data={data} />;
}
