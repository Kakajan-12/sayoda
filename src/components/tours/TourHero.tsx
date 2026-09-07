import React from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FaRegMap } from "react-icons/fa6";
import { MdOutlineAccessTime } from "react-icons/md";
import { HiTranslate } from "react-icons/hi";
import { VscTypeHierarchySub } from "react-icons/vsc";
import { IoLocationSharp } from "react-icons/io5";
import Image from "next/image";
import { PoppinFont } from "@/components/ui/Fonts";
import {
  durationDays,
  localizedField,
  mediaUrl,
  type Tour,
} from "@/lib/api/catalog";
import { plainText } from "@/lib/utils";

/**
 * Первый экран страницы тура.
 *
 * Собран по образцу stantrips и advantour, на которые равняется заказчик:
 * хлебные крошки, название, маршрут строкой городов, крупная фотография и
 * полоса фактов под ней. Раньше факты были подписями в столбик сбоку, а на
 * телефоне подписи и вовсе скрывались — оставались одни иконки, и «тип
 * тура» превращался в ребус.
 *
 * Серверный компонент: тут нет ни одного состояния, а описание тура должно
 * попадать в HTML целиком.
 */

function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3 bg-white px-4 py-4">
      <span className="mt-0.5 shrink-0 text-tileMid" aria-hidden>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs uppercase tracking-wide text-inkMuted">
          {label}
        </span>
        <span className="block font-semibold text-ink">{value}</span>
      </span>
    </div>
  );
}

export default async function TourHero({
  tour,
  locale,
}: {
  tour: Tour;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "TourPerPage" });
  const th = await getTranslations({ locale, namespace: "Header" });

  const title = plainText(localizedField(tour, "title", locale));
  const route = plainText(localizedField(tour, "destination", locale));
  const country = plainText(localizedField(tour, "location", locale));
  const type = plainText(localizedField(tour, "type", locale));
  const category = plainText(localizedField(tour, "cat", locale));
  const lang = plainText(localizedField(tour, "lang", locale));
  const days = durationDays(localizedField(tour, "duration", locale));

  return (
    <section className="container mx-auto px-4 pt-5 md:pt-8">
      {/* Хлебные крошки были только в микроразметке для поисковика — на
          экране из тура нельзя было вернуться в каталог ничем, кроме
          кнопки «назад». У обоих референсов они есть. */}
      <nav aria-label="breadcrumb" className="text-sm text-inkMuted">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="hover:text-tileLight hover:underline">
              {th("main")}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/tours" className="hover:text-tileLight hover:underline">
              {th("tours")}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-ink" aria-current="page">
            {title}
          </li>
        </ol>
      </nav>

      <h1
        className={`${PoppinFont.className} mt-4 text-balance text-2xl font-bold leading-tight text-tile sm:text-3xl lg:text-4xl 2xl:text-5xl`}
      >
        {title}
      </h1>

      {/* Маршрут строкой — у обоих сайтов это первое, что стоит под
          названием: турист выбирает по городам, а не по описанию. */}
      {(route || country) && (
        <p className="mt-3 flex items-center gap-2 text-base text-inkMuted sm:text-lg">
          <IoLocationSharp className="h-5 w-5 shrink-0 text-brick" aria-hidden />
          <span className="min-w-0">{route || country}</span>
        </p>
      )}

      {/*
        Фон подложки виден, пока картинка не пришла, — поэтому обёртки со
        скелетоном здесь намеренно нет.

        Та обёртка держит картинку в opacity: 0 и проявляет её по событию
        onLoad, то есть уже после гидратации. Для самого крупного элемента
        первого экрана это сводит на нет весь смысл priority: байты пришли,
        а место всё ещё пустое. Остальные картинки страницы скелетон
        сохраняют — там он к месту.
      */}
      <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-sand sm:aspect-[16/9] lg:aspect-[21/9]">
        <Image
          // Раньше здесь стояло alt="tour image" — подпись, не говорящая ни
          // о чём, на самой крупной картинке страницы.
          alt={title}
          className="h-full w-full object-cover"
          src={mediaUrl(tour.image)}
          fill
          // Без priority браузеру запрещено грузить картинку заранее,
          // и страница «догоняла» себя.
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
      </div>

      {/*
        Полоса фактов. Разделители нарисованы просветом сетки: фон подложки
        песочный, ячейки белые, зазор в один пиксель — линии сами встают
        правильно и в столбик, и в две колонки, и в четыре.

        Пробовал через divide-* и border с вариантами вроде
        [&>*:not(:first-child)]:sm:border-l — Tailwind собирает такую запись
        без медиазапроса, и рамка слева появлялась бы и на телефоне, где
        ячейки идут одна под другой.
      */}
      <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-sand ring-1 ring-sand sm:grid-cols-2 lg:grid-cols-4">
        <Fact
          icon={<MdOutlineAccessTime size={22} />}
          label={t("duration")}
          value={days !== null ? t("days", { count: days }) : ""}
        />
        <Fact
          icon={<VscTypeHierarchySub size={22} />}
          label={t("tour")}
          value={type}
        />
        <Fact
          icon={<FaRegMap size={22} />}
          label={t("category")}
          value={category}
        />
        <Fact
          icon={<HiTranslate size={22} />}
          label={t("languages")}
          value={lang}
        />
      </div>
    </section>
  );
}
