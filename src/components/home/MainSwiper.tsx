"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import { PoppinFont } from "@/components/ui/Fonts";
import { Link } from "@/i18n/navigation";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import mainImage from "../../../public/main3.jpg";

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
  "pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/35 to-black/45";

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
                    <Link
                      href={`/destinations/${card.slug}`}
                      className="group relative block w-full aspect-[3/4] overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                        <ImageWithSkeleton
                          src={card.image}
                          alt={card.title}
                          width={400}
                          height={533}
                          sizes="(max-width: 480px) 45vw, (max-width: 768px) 30vw, 20vw"
                          className="h-full w-full object-cover"
                          skeletonClassName="rounded-2xl"
                        />
                      </div>

                      <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/55 to-transparent" />

                      {/* h2, а не h1: единственный h1 страницы — заголовок
                          первого экрана, он приходит пропсом сверху. */}
                      <h2
                        className={`${PoppinFont.className} absolute top-4 left-4 right-4 text-left text-sm font-semibold leading-tight text-white drop-shadow-md sm:text-base lg:text-lg`}
                      >
                        {card.title}
                      </h2>
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
