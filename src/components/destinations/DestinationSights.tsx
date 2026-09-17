import React from "react";
import BlogCard from "@/components/blog/BlogCard";
import { getBlogs } from "@/lib/api/catalog";

/**
 * Статьи о стране на вкладке «Достопримечательности».
 *
 * Отбор идёт по полю destination_id, которое редакция выбирает в админке.
 * До миграции 023 такого поля не было, и страница брала весь блог и искала
 * в заголовках и тексте название страны. Так это работать не могло: статья
 * про Мерв, где Туркменистан не назван ни разу, на вкладку не попадала;
 * статья про перелёт «из Ашхабада в Ташкент» попадала сразу на две;
 * упоминание страны в одном абзаце из двадцати ничем не отличалось от
 * статьи, посвящённой ей целиком.
 *
 * Список берётся на сервере. Раньше компонент был клиентским и тянул
 * статьи из браузера, начиная с пустого массива, — а пустой список тут же
 * означал «нет данных». Человек открывал вкладку, читал, что смотреть
 * нечего, и только потом появлялись карточки. Заодно статей не было в
 * серверной разметке: поисковик видел на вкладке ровно фразу «нет данных».
 */
export default async function DestinationSights({
  destinationId,
  emptyLabel,
}: {
  /** Страна, чьи статьи показываем. */
  destinationId: number;
  /** Что показать, когда своих статей у страны нет. */
  emptyLabel: string;
}) {
  const blogs = await getBlogs(destinationId);

  if (!blogs.length) {
    return <p className="text-center py-10 text-gray-500">{emptyLabel}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {blogs.map((item) => (
        <BlogCard
          key={item.id}
          blog={item}
          href={`/blog/${item.slug}`}
          className="w-full"
        />
      ))}
    </div>
  );
}
