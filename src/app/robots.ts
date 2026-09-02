import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Краулеры LLM (GPTBot, PerplexityBot, ClaudeBot и прочие) намеренно
 * не блокируются: для въездного туризма в Туркменистан заметная часть людей
 * планирует поездку через ассистентов, и это источник трафика, а не нагрузка.
 *
 * Закрыты только служебные пути: /booking — форма заявки, отдельной ценности
 * в выдаче не имеет и плодит дубли с параметрами тура.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/*/booking"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
