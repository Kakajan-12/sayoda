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
import TourBookingCard from "@/components/tours/TourBookingCard";
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
 * попадать в HTML целиком. Карточка брони внутри — клиентская, это
 * нормально: сервер спокойно рендерит клиентские компоненты.
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
  whatsappHref,
  children,
}: {
  tour: Tour;
  locale: string;
  /** Ссылка на WhatsApp для карточки брони. Пусто — кнопки не будет. */
  whatsappHref: string | null;
  /**
   * Всё, что читают под фотографией: главное о туре, полоса разделов,
   * описание и программа.
   *
   * Они приходят сюда, а не идут следом за героем, ради липкой карточки
   * брони. Липкий элемент двигается только в пределах своего родителя, и
   * если бы карточка осталась в коротком блоке с одной фотографией, ей было
   * бы некуда липнуть — она ушла бы вверх вместе с ним. Теперь её колонка
   * тянется до конца программы, и цена с кнопкой остаются на виду всё
   * время, пока человек читает.
   */
  children: React.ReactNode;
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

  /*
    Факты о туре: длительность, тип, категория, языки.
    
    Раньше это была широкая полоса из четырёх ячеек под фотографией. Теперь
    они стоят над карточкой брони, в той же колонке, — то есть сначала
    человек видит, что за тур и на сколько дней, и только потом цену.
    В узкой колонке четыре ячейки идут в столбик.

    Разделители нарисованы просветом сетки: фон подложки песочный, ячейки
    белые, зазор в один пиксель — линии встают сами. Пробовал divide-* и
    border с вариантами вроде [&>*:not(:first-child)]:border-t — Tailwind
    собирает такую запись без медиазапроса, и лишняя рамка появлялась бы
    там, где ячейки идут в ряд.
  */
  const facts = (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-sand ring-1 ring-sand sm:grid-cols-2 lg:grid-cols-1">
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
  );

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
      {/*
        Фотография и карточка брони в один ряд.
        
        Фото было во всю ширину с пропорцией 21/9: на экране 1536 это 645
        пикселей высоты, и нижний край уходил за сгиб — до цены приходилось
        прокручивать. Теперь фото занимает две трети ряда и имеет потолок по
        высоте, а освободившаяся треть отдана цене и кнопке заявки: главное
        решение страницы видно сразу.

        На lg высота задана числом, а не пропорцией. Пропорция от ширины
        колонки всё равно давала бы полтысячи пикселей, а object-cover
        одинаково хорошо кадрирует под любой прямоугольник.

        Карточка выровнена по верху и высоту фотографии не повторяет: иначе
        между ценой и кнопкой оставалось бы двести пикселей пустоты.
      */}
      {/*
        Раскладка задана колонками и строками явно, а не порядком в разметке,
        потому что порядок нужен разный.

        На телефоне одна колонка, и всё идёт сверху вниз: фотография, потом
        цена с кнопкой, и только потом чтение. Цена не должна оказываться
        под программой на сто экранов ниже.

        На широком экране фотография и текст занимают левую колонку двумя
        строками, а правая колонка охватывает обе строки — в ней и живёт
        липкая карточка. items-start обязателен: без него элемент растянулся
        бы на всю высоту области, и липнуть внутри себя ему было бы некуда.
      */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start lg:gap-6">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-sand sm:aspect-[16/9] lg:col-start-1 lg:row-start-1 lg:aspect-auto lg:h-[420px] xl:h-[460px]">
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
            sizes="(max-width: 1024px) 100vw, 66vw"
            // 90 вместо 75 по умолчанию: это самая крупная картинка
            // страницы, и на ней потери сжатия заметны. Значение разрешено
            // в next.config — без записи там оно молча стало бы прежним.
            quality={90}
          />
        </div>

        {/*
          Липнет сама карточка, а не вся колонка.
          
          Когда липкой была колонка целиком, факты пиналсь вместе с ней и
          отжимали карточку на четыреста пикселей вниз: на невысоком экране
          её нижний край с кнопкой уходил за границу окна. Теперь факты
          уезжают вверх как обычный текст, а карточка останавливается у
          шапки и видна полностью.

          self-stretch нужен вопреки items-start у сетки: липкий элемент
          двигается в пределах родителя, и родитель обязан быть высоким.
          Карточка при этом — прямой потомок колонки, иначе ограничителем
          стал бы промежуточный блок высотой по содержимому.
        */}
        <aside className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-stretch">
          <div className="mb-4">{facts}</div>
          {/* top-28, а не top-24: липкая шапка ровно 96 пикселей, и при
              отступе 96 карточка вставала к ней впритык, без просвета. */}
          <div className="lg:sticky lg:top-28">
            <TourBookingCard
              tourId={tour.id}
              tourTitle={title}
              price={tour.price}
              days={days}
              whatsappHref={whatsappHref}
            />
          </div>
        </aside>

        <div className="min-w-0 lg:col-start-1 lg:row-start-2">{children}</div>
      </div>

    </section>
  );
}
