"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ImageWithSkeleton, { IMAGE_QUALITY } from "@/components/ui/ImageWithSkeleton";
import { PoppinFont } from "@/components/ui/Fonts";
import { Link } from "@/i18n/navigation";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import mainImage from "../../../public/main3.webp";

/**
 * Первый экран главной: карта, заголовок и лента карточек стран.
 *
 * Карточки строятся из направлений. Раньше они жили отдельной сущностью
 * «Карточки на главной»: те же пять стран, заведённые второй раз, со своим
 * названием, своей картинкой и своим текстом, который на экран не попадал
 * вовсе. Вели они всё равно на страницу направления — все пять были к нему
 * привязаны. Переименование страны в направлениях на главную не доезжало.
 *
 * Данные приходят пропсом с сервера, а карточка стала обычной ссылкой
 * вместо кнопки с router.push. Из-за этого пропали разом: запрос из
 * браузера, состояния загрузки и ошибки, спиннер на карточке и подбор
 * страны сравнением названий. И главное — пять ссылок на страницы стран
 * теперь лежат в HTML главной, а не появляются после гидрации.
 */

export interface HeroCard {
  slug: string;
  title: string;
  image: string;
}

interface MainSwiperProps {
  /** Карточки стран, уже отсортированные и локализованные на сервере. */
  cards: HeroCard[];
  /**
   * Заголовок первого экрана. Приходит из Server Component, поэтому попадает
   * в статический HTML.
   */
  heading?: React.ReactNode;
  /**
   * Фон первого экрана, загруженный через админку. Пусто — остаётся картинка
   * из вёрстки, чтобы баннер не оказался пустым до первой загрузки своей.
   */
  backgroundImage?: string;
}

/**
 * Затемнение поверх карты на первом экране.
 *
 * Карта светлая, и белый заголовок на ней держался только за счёт тени —
 * читалось плохо. Градиент плотнее сверху и снизу: сверху под ним лежит
 * полупрозрачная шапка и сам заголовок, снизу — карточки направлений,
 * а в середине карта остаётся видимой.
 *
 * z-10 ставит слой над изображением, но под заголовком и карточками (z-30);
 * pointer-events-none — чтобы слой не перехватывал наведение и клики.
 */
const HERO_OVERLAY =
  "pointer-events-none absolute inset-0 z-10 bg-linear-to-b from-black/50 via-black/35 to-black/45";

const MainSwiper = ({ cards, heading, backgroundImage }: MainSwiperProps) => {
  const heroImage = backgroundImage || mainImage;

  return (
    <div className="relative z-20 pb-28 sm:pb-36 lg:pb-44">
      <section className="relative w-full h-[70vh] md:h-[75vh] lg:h-[100vh] bg-mainLight">
        <div className="absolute inset-0 overflow-hidden -top-28">
          <ImageWithSkeleton
            src={heroImage}
            alt="Central Asia map"
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        <div className={HERO_OVERLAY} />

        {heading}

        {cards.length > 0 && (
          <div className="absolute inset-x-0 bottom-0 z-30 translate-y-1/2 px-4 sm:px-8 lg:px-16">
            <div className="relative max-w-7xl mx-auto">
              <Swiper
                modules={[FreeMode, Navigation]}
                watchOverflow
                slidesPerView={1.8}
                spaceBetween={12}
                freeMode
                breakpoints={{
                  480: { slidesPerView: 2.8, spaceBetween: 16 },
                  768: { slidesPerView: 3.8, spaceBetween: 20 },
                  1024: { slidesPerView: 5, spaceBetween: 24 },
                }}
                className="destination-cards-swiper"
              >
                {cards.map((card) => (
                  <SwiperSlide key={card.slug}>
                    {/*
                      Ссылка стоит на месте, приподнимается только её
                      содержимое.

                      Раньше подъём висел на самой ссылке, и она мерцала.
                      Цикл был такой: курсор у нижнего края — наведение
                      сработало — карточка уехала вверх на четыре пикселя —
                      нижний край оказался выше курсора — наведение снялось —
                      карточка опустилась обратно под курсор — и снова по
                      кругу, несколько раз в секунду. На записи это видно как
                      дрожание: кромка скачет, пока курсор стоит неподвижно.

                      Теперь ссылка задаёт неподвижную область наведения, а
                      двигается вложенный слой. Курсор из области не выпадает,
                      и цикл разрывается.

                      Скругление и обрезка переехали на тот же слой: на
                      неподвижной ссылке они обрезали бы приподнятое
                      содержимое по старой границе.
                    */}
                    <Link
                      href={`/destinations/${card.slug}`}
                      className="group relative block w-full aspect-[3/4] rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <div className="absolute inset-0 overflow-hidden rounded-2xl transition-transform duration-300 ease-out group-hover:-translate-y-1">
                        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                          {/*
                            Размеры совпадают с рамкой — 3:4. Они задают только
                            пропорцию места, которое держится под картинку до
                            загрузки; сам размер файла выбирается по sizes.
                            Стояло 800×1500 — это 1:1.9, вдвое уже рамки, и
                            заглушка занимала не ту площадь, которую потом
                            занимала картинка.

                            sizes описывает ширину плитки на экране и совпадает
                            с разбивкой слайдера ниже: 2.8 карточки в ряду на
                            телефоне, 3.8 на планшете, 5 на широком экране.

                            Качество указано явно, хотя обёртка и так ставит
                            IMAGE_QUALITY: здесь оно важно по делу. Кадр
                            обрезается по вертикали, то есть показывается
                            увеличенным, а на увеличении следы сжатия заметнее
                            всего на сайте.
                          */}
                          <ImageWithSkeleton
                            src={card.image}
                            alt={card.title}
                            width={600}
                            height={800}
                            quality={IMAGE_QUALITY}
                            sizes="(max-width: 480px) 45vw, (max-width: 768px) 30vw, 20vw"
                            className="h-full w-full object-cover"
                            skeletonClassName="rounded-2xl"
                          />
                        </div>

                        <div className="absolute inset-x-0 top-0 h-2/5 bg-linear-to-b from-black/55 to-transparent" />

                        {/* h2, а не h1: единственный h1 страницы — заголовок
                            первого экрана, он приходит пропсом сверху. */}
                        <h2
                          className={`${PoppinFont.className} absolute top-4 left-4 right-4 text-left text-sm font-semibold leading-tight text-white drop-shadow-md sm:text-base lg:text-lg`}
                        >
                          {card.title}
                        </h2>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default MainSwiper;
