"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import { PoppinFont } from "@/Ui/Fonts";
import { useLocale } from "next-intl";
import { BASE_API_URL } from "@/i18n/api";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import mainImage from "../../../public/main3.jpg";

type Slide = {
  id: number;
  tour_id: number;
  title_tk: string;
  title_en: string;
  title_ru: string;
  text_tk: string;
  text_en: string;
  text_ru: string;
  image: string;
};

const MainSwiper = () => {
  const router = useRouter();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [navigatingTourId, setNavigatingTourId] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch(`${BASE_API_URL}/api/sliders`);
        if (!response.ok)
          throw new Error(`Ошибка загрузки: ${response.status}`);
        const data = await response.json();
        setSlides(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  const getLocalized = (slide: Slide, field: "title" | "text") => {
    if (locale === "ru") return slide[`${field}_ru`];
    if (locale === "tk") return slide[`${field}_tk`];
    return slide[`${field}_en`] || slide[`${field}_tk`];
  };

  const getFixedImageUrl = (path: string) => {
    if (!path) return "";
    return (
      BASE_API_URL.replace(/\/+$/, "") +
      "/" +
      path
        .replace(/\\/g, "/")
        .replace(/^(\.\.\/)+/, "")
        .replace(/^\/+/, "")
        .replace(/^app\//, "")
    );
  };

  const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

  const handleCardClick = (tourId: number) => {
    setNavigatingTourId(tourId);
    router.push(`/tours/${tourId}`);
  };

  if (loading) {
    return (
      <div className="relative z-20 pb-28 sm:pb-36 lg:pb-44">
        <section className="relative w-full h-[70vh] md:h-[75vh] lg:h-[100vh] bg-mainLight">
          <div className="absolute inset-0 overflow-hidden -top-28">
            <Image
              src={mainImage}
              alt="Central Asia map"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-x-0 -bottom-20 z-30 translate-y-1/2 px-4 sm:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-2xl bg-gray-200/70 animate-pulse"
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">Ошибка: {error}</div>
    );
  }

  return (
    <div className="relative z-20 pb-28 sm:pb-36 lg:pb-44">
      <section className="relative w-full h-[70vh] md:h-[75vh] lg:h-[100vh] bg-mainLight">
        <div className="absolute inset-0 overflow-hidden -top-28">
          <Image
            src={mainImage}
            alt="Central Asia map"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
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
              {slides.map((slide) => (
                <SwiperSlide key={slide.id}>
                  <button
                    type="button"
                    disabled={navigatingTourId === slide.tour_id}
                    onClick={() => handleCardClick(slide.tour_id)}
                    className="group relative block w-full aspect-[3/4] rounded-2xl overflow-hidden  transition-transform duration-300 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-wait"
                  >
                    {!loadedImages[slide.id] && (
                      <div className="absolute inset-0 bg-gray-200/70 animate-pulse" />
                    )}

                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                      <Image
                        src={getFixedImageUrl(slide.image)}
                        alt={stripHtml(getLocalized(slide, "title"))}
                        width={400}
                        height={533}
                        sizes="(max-width: 480px) 45vw, (max-width: 768px) 30vw, 20vw"
                        onLoad={() =>
                          setLoadedImages((prev) => ({
                            ...prev,
                            [slide.id]: true,
                          }))
                        }
                        className={`h-full w-full object-cover transition-opacity duration-500 ${
                          loadedImages[slide.id] ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </div>

                    <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/55 to-transparent" />

                    <h2
                      className={`${PoppinFont.className} absolute top-4 left-4 right-4 text-white text-sm sm:text-base lg:text-lg font-semibold text-left leading-tight drop-shadow-md`}
                    >
                      {stripHtml(getLocalized(slide, "title"))}
                    </h2>

                    {navigatingTourId === slide.tour_id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <span className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainSwiper;
