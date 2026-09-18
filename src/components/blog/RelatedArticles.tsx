import React from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import BlogCard from "@/components/blog/BlogCard";
import { PoppinFont } from "@/components/ui/Fonts";
import { getBlogsPage, type Blog } from "@/lib/api/catalog";

/**
 * Похожие статьи внизу и возврат в блог.
 *
 * Статья заканчивалась галереей и тупиком: дочитав, человек упирался в
 * подвал, и уйти можно было только кнопкой «назад» в браузере. У туров
 * такой блок давно есть, у блога не было.
 *
 * Подбираем по стране — это единственный признак, который у статей
 * заполнен: категории в базе пока не проставлены ни у одной. Когда их
 * проставят, сначала пробуем категорию, она точнее.
 *
 * Берём с запасом и отбрасываем текущую статью уже здесь: просить у API
 * «три, кроме двадцать седьмой» он не умеет.
 */
export default async function RelatedArticles({
  blog,
  locale,
}: {
  blog: Blog;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "Blog" });
  const nav = await getTranslations({ locale, namespace: "Header" });

  const pick = (items: Blog[]) =>
    items.filter((item) => item.id !== blog.id && Boolean(item.slug));

  let related: Blog[] = [];

  if (blog.blog_cat_id) {
    const byCategory = await getBlogsPage(1, 4, {
      category: String(blog.blog_cat_id),
    });
    related = pick(byCategory.items);
  }

  if (related.length < 3 && blog.destination_id) {
    const byCountry = await getBlogsPage(1, 4, {
      destination: String(blog.destination_id),
    });
    // Дополняем, не теряя уже найденное и не задваивая записи.
    const seen = new Set(related.map((item) => item.id));
    for (const item of pick(byCountry.items)) {
      if (related.length >= 3) break;
      if (seen.has(item.id)) continue;
      related.push(item);
      seen.add(item.id);
    }
  }

  related = related.slice(0, 3);

  return (
    <section className="border-t border-sand bg-sandLight">
      <div className="container mx-auto px-5 py-12 md:py-16">
        {related.length > 0 && (
          <>
            <h2
              className={`${PoppinFont.className} text-xl font-bold text-tile md:text-2xl`}
            >
              {t("related")}
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
              {related.map((item) => (
                <BlogCard
                  key={item.id}
                  blog={item}
                  href={`/blog/${item.slug}`}
                  className="w-full"
                />
              ))}
            </div>
          </>
        )}

        {/*
          Возврат в блог показываем всегда, даже когда похожих не нашлось:
          это и есть тот выход, которого странице не хватало.
        */}
        <div className={related.length > 0 ? "mt-8" : ""}>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-tile underline underline-offset-4 transition-colors hover:text-tileLight"
          >
            <span aria-hidden>←</span>
            {nav("blog")}
          </Link>
        </div>
      </div>
    </section>
  );
}
