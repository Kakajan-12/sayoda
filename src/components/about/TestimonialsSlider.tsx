"use client";

import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import React from "react";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";
import { useTranslations } from "next-intl";
import { BASE_API_URL } from "@/i18n/api";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { Testimonial } from "@/lib/api/testimonials";

/**
 * Карусель отзывов.
 *
 * Данные приходят готовым списком от серверной обёртки, а не запросом из
 * браузера. Прежде компонент тянул их сам в useEffect и до ответа рисовал
 * заголовок «Отзывы» с полосой загрузки — а отзывов в базе ноль. В
 * серверном HTML оставался заголовок над пустотой, который потом пропадал:
 * и скачок вёрстки, и сообщение поисковику о разделе, которого нет.
 *
 * Клиентским компонент остаётся из-за Swiper. На разметку это не влияет:
 * React отрисует его на сервере, и отзывы попадут в HTML.
 */
const TestimonialsSlider = ({
  testimonials,
}: {
  testimonials: Testimonial[];
}) => {
  const section = useTranslations("SectionTitle");

  return (
    <div className="container mx-auto px-5 pt-10 pb-20">
      <h2
        className={`text-2xl lg:text-2xl 2xl:text-3xl leading-9 2xl:leading-[65px] font-bold ${PoppinFont.className}`}
      >
        {section("testimonial")}
      </h2>

      <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          className="mt-10"
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div
                className={`w-full bg-tileTint rounded-xl flex flex-col shadow-[#00000040] shadow-lg ${PoppinFont.className}`}
              >
                {/* Шапка */}
                <div className="w-full flex items-center gap-2">
                  <div className="bg-mainBlue flex items-center gap-3 pr-8 pl-5 py-2 rounded-e-full">
                    <div className="relative p-1 bg-white rounded-full">
                      <ImageWithSkeleton
                        alt="user"
                        width={48}
                        height={48}
                        src={`${BASE_API_URL}/${item.image.replace(/\\/g, "/")}`}
                        className="h-12 w-12 rounded-full object-cover"
                        skeletonClassName="rounded-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p
                        className={`text-white text-lg xl:text-xl font-bold`}
                        dangerouslySetInnerHTML={{ __html: item.name }}
                      />
                    </div>
                  </div>
                </div>

                {/* Текст */}
                <div className="px-7 md:px-10 py-5">
                  {/* whitespace-pre-line: отзыв больше не набирают в
                      редакторе, он приходит обычным текстом, и разбивка на
                      абзацы в нём — настоящие переводы строк, а не <p>.
                      Без этого правила текст склеивался бы в сплошной кусок. */}
                  <p
                    className={`xl:text-lg text-sm xl:leading-8 leading-6 whitespace-pre-line ${QuicksandFont.className}`}
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default TestimonialsSlider;
