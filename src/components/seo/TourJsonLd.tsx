import JsonLd from "./JsonLd";
import {
  type Tour,
  localizedField,
  mediaUrl,
} from "@/lib/api/catalog";
import { SITE_NAME, absoluteUrl, localizedUrl } from "@/lib/site";
import { plainText, sentenceExcerpt } from "@/lib/utils";

/**
 * TouristTrip + Offer для страницы тура. Цена в базе хранится числом в USD,
 * поэтому Offer заполняем только когда она действительно есть.
 */
export default function TourJsonLd({
  tour,
  locale,
}: {
  tour: Tour;
  locale: string;
}) {
  const name = plainText(localizedField(tour, "title", locale));
  const url = localizedUrl(locale, `tours/${tour.slug}`);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${url}#trip`,
    name,
    url,
    // По границе предложения, а не по слову: описание здесь читает машина,
    // и фраза, оборванная многоточием на полуслове, выглядит повреждённой.
    description: sentenceExcerpt(localizedField(tour, "text", locale), 300),
    provider: {
      "@type": "TravelAgency",
      "@id": `${absoluteUrl("/")}#organization`,
      name: SITE_NAME,
    },
  };

  const image = mediaUrl(tour.image);
  if (image) data.image = image;

  /*
   * Маршрут — список остановок по порядку.
   *
   * Раньше сюда клались два объекта: вся строка городов целиком одним
   * Place («Ashgabat, Nisa, Mary, Merv, Darvaza Gas Crater, Kunya-Urgench»)
   * и вторым — страна. Для машины это не маршрут: первый объект — не
   * место, а перечисление, а страна вообще не остановка.
   *
   * Теперь строка разбивается по запятой на отдельные Place, а страна
   * уходит внутрь каждого из них как addressCountry — там она и значит
   * то, что должна: где находится это место.
   */
  const destination = plainText(localizedField(tour, "destination", locale));
  const country = plainText(localizedField(tour, "location", locale));
  const stops = destination
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (stops.length) {
    data.itinerary = {
      "@type": "ItemList",
      numberOfItems: stops.length,
      itemListElement: stops.map((place, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Place",
          name: place,
          ...(country
            ? { address: { "@type": "PostalAddress", addressCountry: country } }
            : {}),
        },
      })),
    };
  }

  /*
   * touristType и duration здесь не выводятся намеренно.
   *
   * touristType по схеме описывает аудиторию — «для детей», «для гостей
   * из такой-то страны». Сюда подставлялась категория тура («City
   * sightseeing tours»), то есть тема, а не аудитория: получалось
   * утверждение «этот тур подходит туристам типа „обзорные экскурсии“».
   * Пока в базе лежат темы, а не аудитории, честнее не выводить ничего.
   *
   * duration у TouristTrip нет вовсе — ни у него, ни у родительского
   * Trip (проверено по schema.org). Валидатор отмечал его как
   * нераспознанное свойство. Длительность и так видна в заголовке и в
   * тексте страницы.
   */

  if (tour.price) {
    data.offers = {
      "@type": "Offer",
      price: String(tour.price),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url,
    };
  }

  return <JsonLd data={data} />;
}
