import React from "react";
import { getTranslations } from "next-intl/server";
import { PoppinFont } from "@/Ui/Fonts";
import { Link } from "@/i18n/navigation";
import BlogCard, { Blog } from "@/Components/CardProps/BlogCard";

/**
 * Блок «Блог» на главной.
 *
 * Здесь была листалка. На главной она давала только минусы: видна была
 * фактически одна страница карточек, до остальных почти никто не долистывал,
 * а стрелки и точки добавляли шума. На десктопе четыре карточки и так
 * помещались в ряд — то есть листалка не экономила место, а прятала статьи.
 *
 * Вместо неё — очерёдность: свежая статья крупно, три следующие рядом
 * строками, и ссылка на весь раздел. Заодно блок стал серверным: swiper
 * больше не грузится в браузер.
 */
export default async function BlogsCards({ blogs }: { blogs: Blog[] }) {
  const t = await getTranslations("Blogs");

  if (!blogs.length) return null;

  const [lead, ...rest] = blogs;
  // Четыре спутника подобраны по высоте: столько их помещается рядом с
  // крупной карточкой без пустоты снизу.
  const side = rest.slice(0, 4);

  // Блок целиком — только на главной. В списке /blog карточки одинаковые:
  // там человек уже пришёл читать и выбирает сам, выделять за него нечего.

  return (
    <div className="w-full bg-gradient-to-b from-mainForBackground to-white py-10 md:py-20">
      <div className="container mx-auto px-5">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3 md:mb-12">
          <h2
            className={`${PoppinFont.className} font-bold text-2xl md:text-3xl xl:text-4xl`}
          >
            {t("blogs")}
          </h2>
          <Link
            href="/blog"
            className="text-sm font-semibold text-tile hover:text-tileLight md:text-base"
          >
            {t("all")} →
          </Link>
        </div>

        {/* Половина под крупную статью, половина под остальные: акцент есть,
            но одна статья не забирает под себя весь блок.
            До lg всё складывается в одну колонку. */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          <BlogCard blog={lead} href={`/blog/${lead.id}`} variant="featured" />

          {side.length > 0 && (
            // justify-between подбирает разницу высот: колонки редко сходятся
            // ровно, и лишние пикселы лучше распределить между карточками,
            // чем оставить дырой снизу.
            <div className="flex flex-col justify-between gap-4">
              {side.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  href={`/blog/${blog.id}`}
                  variant="compact"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
