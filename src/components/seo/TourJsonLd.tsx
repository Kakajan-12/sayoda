import JsonLd from "./JsonLd";
import {
  type Tour,
  durationDays,
  localizedField,
  mediaUrl,
} from "@/lib/api/catalog";
import { SITE_NAME, absoluteUrl, localizedUrl } from "@/lib/site";
import { excerpt, plainText } from "@/lib/utils";

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
  const days = durationDays(localizedField(tour, "duration", locale));
  const url = localizedUrl(locale, `tours/${tour.slug}`);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${url}#trip`,
    name,
    url,
    description: excerpt(localizedField(tour, "text", locale), 300),
    provider: {
      "@type": "TravelAgency",
      "@id": `${absoluteUrl("/")}#organization`,
      name: SITE_NAME,
    },
  };

  const image = mediaUrl(tour.image);
  if (image) data.image = image;

  const destination = plainText(localizedField(tour, "destination", locale));
  const country = plainText(localizedField(tour, "location", locale));
  if (destination || country) {
    data.itinerary = {
      "@type": "ItemList",
      itemListElement: [destination, country]
        .filter(Boolean)
        .map((place, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: { "@type": "Place", name: place },
        })),
    };
  }

  const tourType = plainText(localizedField(tour, "type", locale));
  if (tourType) data.touristType = tourType;

  // ISO 8601: 5 дней → P5D. Без длительности поле лучше не выводить.
  if (days) data.duration = `P${days}D`;

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
