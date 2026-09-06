import JsonLd from "./JsonLd";
import { localizedUrl } from "@/lib/site";

export interface Crumb {
  name: string;
  /** Путь без локали, например "tours" или "tours/16". */
  path: string;
}

/** BreadcrumbList — даёт в выдаче цепочку вместо голого URL. */
export default function BreadcrumbJsonLd({
  items,
  locale,
}: {
  items: Crumb[];
  locale: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: localizedUrl(locale, item.path),
        })),
      }}
    />
  );
}
