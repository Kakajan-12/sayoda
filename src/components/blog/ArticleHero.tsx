import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import { mediaUrl } from "@/lib/api/catalog";
import React from "react";

/**
 * Обложка статьи: кадр, заголовок и строка выходных данных.
 *
 * Высота та же, что у каталога туров и списка блога, — 44/64/72vh. Было
 * 500px и 89vh, то есть почти весь экран: до первой строки текста
 * приходилось прокручивать вслепую, а на широком мониторе заголовок
 * оставался единственным, что видно при открытии.
 *
 * Заголовок стоит по центру. Раньше он был прижат к правому краю
 * (items-end и text-end) — так не верстают ни один из образцов, на
 * которые равняется заказчик, и читать заголовок из трёх строк, у
 * которого рваный левый край, заметно тяжелее.
 *
 * Под заголовком — дата, страна и категория. Прежде статья не говорила
 * о себе ничего: ни когда написана, ни к чему относится. Для блога, где
 * половина материалов про конкретные места, это первое, что хочет знать
 * читатель.
 */
export default function ArticleHero({
  title,
  image,
  date,
  country,
  category,
  locale,
}: {
  title: string;
  image?: string;
  /** Дата в виде из базы: полночь UTC. */
  date?: string;
  /** Название страны — уже локализованное. Пусто — строка не показывается. */
  country?: string;
  category?: string;
  locale: string;
}) {
  /*
   * Дата хранится как полночь UTC. Без явного timeZone браузер в минусовом
   * поясе показал бы предыдущий день, а сервер — правильный, и числа
   * разошлись бы между списком и статьёй.
   */
  let dateLabel = "";
  if (date) {
    try {
      dateLabel = new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(date));
    } catch {
      dateLabel = String(date).slice(0, 10);
    }
  }

  const meta = [dateLabel, country, category].filter(Boolean);

  return (
    <div className="relative z-10">
      <div className="relative">
        <ImageWithSkeleton
          src={mediaUrl(image ?? "")}
          alt={title}
          width={1920}
          height={1080}
          priority
          className="h-[44vh] w-full object-cover object-center md:h-[64vh] lg:h-[72vh]"
        />

        {/* Затемнение на весь кадр: заголовок стоит по центру, и градиента
            только снизу ему не хватало — на светлых кадрах белый текст
            размывался. Значения те же, что у туров и списка блога. */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/50 via-black/35 to-black/45" />

        <div className="absolute top-0 h-full w-full">
          <div className="container mx-auto flex h-full w-full flex-col items-center justify-center gap-5 px-5 pb-10 text-center sm:px-10 md:w-4/5 lg:w-3/4">
            <h1
              className={`${PoppinFont.className} text-balance px-2 text-2xl font-bold leading-tight tracking-wide text-white sm:text-3xl lg:text-4xl xl:text-5xl`}
            >
              {title}
            </h1>

            {meta.length > 0 && (
              <p
                className={`${QuicksandFont.className} flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-white/85 sm:text-base`}
              >
                {meta.map((item, i) => (
                  <React.Fragment key={item}>
                    {i > 0 && <span aria-hidden>·</span>}
                    <span>{item}</span>
                  </React.Fragment>
                ))}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
