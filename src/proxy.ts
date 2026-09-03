import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Раньше файл назывался middleware.ts. В Next 16 это соглашение объявлено
 * устаревшим и переименовано в proxy.ts — контракт тот же: экспорт по
 * умолчанию плюс config с matcher.
 *
 * Отвечает за префиксы локалей: без него /tours не редиректится на /en/tours
 * и next-intl не может определить язык запроса.
 */
export default createMiddleware(routing);

export const config = {
  // Пропускаем служебные пути и всё, что похоже на файл с расширением,
  // иначе редирект локали навесится на статику и на sitemap.xml.
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
