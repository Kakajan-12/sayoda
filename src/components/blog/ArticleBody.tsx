import { QuicksandFont } from "@/components/ui/Fonts";
import React from "react";

/**
 * Текст статьи.
 *
 * Колонка ограничена по ширине: замер на широком мониторе показывал 113
 * знаков в строке при 1496 пикселях ширины. Глаз на такой длине теряет
 * начало следующей строки — приходится вести пальцем. Комфортная мера —
 * 60–75 знаков, её и держит max-w-[42rem] при размере шрифта 18 пикселей.
 *
 * Размер уменьшен с 24 до 18 пикселей. Двадцать четыре — это размер
 * заголовка, а не основного текста; вместе с полной шириной контейнера
 * статья выглядела распечаткой для слабовидящих.
 *
 * Класс rich-content отвечает за разметку, пришедшую из редактора: он
 * уже был в проекте и умеет разделять абзацы, нумеровать списки и
 * выделять полужирным. Здесь его не было, и все абзацы слипались в одно
 * полотно — в базе они размечены как <p>, но без стилей отступа между
 * ними не появлялось.
 */
export default function ArticleBody({ html }: { html: string }) {
  return (
    <div className="container mx-auto px-5 py-10 md:py-14">
      <div
        className={`${QuicksandFont.className} rich-content mx-auto max-w-[42rem] text-[17px] leading-[1.75] text-ink sm:text-[18px] [&_a]:text-tile [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-10 [&_h2]:text-tile [&_h3]:mt-8 [&_h3]:text-tile [&_img]:my-6 [&_img]:rounded-xl [&_p]:mb-5`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
