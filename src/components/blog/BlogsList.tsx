import React from "react";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";
import { getTranslations } from "next-intl/server";
import BlogCard, { Blog } from "@/components/blog/BlogCard";

/**
 * Список статей.
 *
 * Серверный компонент: клиентским он был только ради разбивки на страницы,
 * а она переехала в адрес и на сервер. Значит ни состояния, ни гидратации
 * здесь больше не нужно — карточки уезжают к посетителю готовой разметкой.
 *
 * Карточки одинаковые. Выделять одну статью крупнее — дело главной
 * страницы, где надо зацепить взгляд; сюда человек уже пришёл читать и
 * выбирает сам, так что ровный список ему удобнее.
 */
export default async function BlogsList({
  blogs,
  withHeading = true,
}: {
  blogs: Blog[];
  /**
   * Заголовок «Блоги» над сеткой.
   *
   * На странице поиска он нужен: там рядом стоят туры, и без подписи
   * непонятно, где что. На самой странице блога он лишний — сверху уже
   * есть h1 в шапке, а между ним и карточками теперь стоит панель с
   * поиском и категориями.
   */
  withHeading?: boolean;
}) {
  const t = await getTranslations("SectionTitle");

  // Запись без слага пропускаем: ссылка на неё вела бы на /blog/undefined.
  const published = blogs.filter((blog) => Boolean(blog.slug));

  return (
    // Верхний отступ меньше, когда заголовка нет: он был рассчитан на
    // подпись над сеткой, и без неё под панелью оставалась полоса пустоты
    // в пол-экрана.
    <div
      className={`container mx-auto px-5 pb-10 md:pb-20 ${
        withHeading ? "pt-10 md:pt-20" : "pt-6 md:pt-10"
      } ${QuicksandFont.className}`}
    >
      {withHeading && (
        <h2
          className={`text-xl md:text-2xl lg:text-2xl 2xl:text-3xl leading-9 font-bold ${PoppinFont.className}`}
        >
          {t("blogs")}
        </h2>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 py-8 md:gap-6 md:py-10">
        {published.map((item) => (
          <BlogCard
            key={item.id}
            blog={item}
            href={`/blog/${item.slug}`}
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
}
