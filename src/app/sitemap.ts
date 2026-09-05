import type { MetadataRoute } from "next";
import { getBlogs, getTours } from "@/lib/api/catalog";
import { getDestinations } from "@/lib/api/destinations";
import { defaultLocale, locales, localizedUrl } from "@/lib/site";

export const revalidate = 3600;

/** Строит запись sitemap с hreflang-альтернативами на все локали. */
function entry(
  path: string,
  options: { priority?: number; lastModified?: Date } = {},
): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = localizedUrl(l, path);

  return {
    url: localizedUrl(defaultLocale, path),
    lastModified: options.lastModified ?? new Date(),
    priority: options.priority,
    alternates: { languages },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Страны берутся из админки: добавленная там страна должна попадать
  // в sitemap без правки кода.
  const [tours, blogs, destinations] = await Promise.all([
    getTours(),
    getBlogs(),
    getDestinations(),
  ]);

  const staticPaths: Array<[string, number]> = [
    ["", 1],
    ["tours", 0.9],
    ["blog", 0.7],
    ["about", 0.6],
    ["contacts", 0.6],
    ["hotels", 0.5],
  ];

  const destinationPaths = destinations.flatMap((d) => [
    entry(`destinations/${d.slug}`, { priority: 0.8 }),
    entry(`destinations/${d.slug}/visa`, { priority: 0.9 }),
    entry(`destinations/${d.slug}/tours`, { priority: 0.7 }),
    entry(`destinations/${d.slug}/sights`, { priority: 0.6 }),
    entry(`destinations/${d.slug}/hotels`, { priority: 0.5 }),
  ]);

  return [
    ...staticPaths.map(([path, priority]) => entry(path, { priority })),
    ...destinationPaths,
    ...tours
      .filter((t) => Boolean(t.slug))
      .map((t) => entry(`tours/${t.slug}`, { priority: 0.8 })),
    ...blogs
      .filter((b) => Boolean(b.slug))
      .map((b) =>
      entry(`blog/${b.slug}`, {
        priority: 0.6,
        lastModified: b.date ? new Date(b.date) : undefined,
      }),
    ),
  ];
}
