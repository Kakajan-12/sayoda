'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // <-- импортируем useRouter
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { PoppinFont } from "@/Ui/Fonts";
import { useLocale, useTranslations } from "next-intl";
import { BASE_API_URL } from "@/i18n/api";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const MainSwiper = () => {
    const router = useRouter(); // <-- инициализация
    const [slides, setSlides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const locale = useLocale();
    const t = useTranslations("Booking");

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const response = await fetch(`${BASE_API_URL}/api/sliders`);
                if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
                const data = await response.json();
                setSlides(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSlides();
    }, []);

    const getLocalized = (slide: any, field: "title" | "text") =>
        slide[`${field}_${locale}`] || slide[`${field}_en`] || slide[`${field}_tk`] || "";

    const getFixedImageUrl = (path: string) => {
        if (!path) return "";
        return (
            BASE_API_URL.replace(/\/+$/, "") +
            "/" +
            path.replace(/\\/g, "/").replace(/^(\.\.\/)+/, "").replace(/^\/+/, "")
        );
    };

    const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

    if (loading) return <div className="text-center py-10">Загрузка...</div>;
    if (error) return <div className="text-center text-red-500 py-10">Ошибка: {error}</div>;

    return (
        <div className="w-full h-auto">
            <Swiper
                modules={[Autoplay, Navigation]}
                slidesPerView={1}
                loop
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                spaceBetween={0}
                navigation={{
                    prevEl: ".swiper-button-prev-first",
                    nextEl: ".swiper-button-next-first",
                }}
                className="mySwiper h-[70vh] md:h-[80vh] lg:h-[89.1vh] w-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id} className="relative">
                        <Image
                            src={getFixedImageUrl(slide.image)}
                            alt={stripHtml(slide.title_tk)}
                            width={1920}
                            height={1080}
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                        <div className="absolute inset-0 flex flex-col justify-center items-center gap-6 md:gap-8 text-center px-4 z-10">
                            <h1 className="text-white text-2xl md:text-5xl xl:text-7xl drop-shadow-lg">
                                {stripHtml(getLocalized(slide, "title"))}
                            </h1>
                            <p className="text-white text-lg md:text-2xl drop-shadow">
                                {stripHtml(getLocalized(slide, "text"))}
                            </p>
                            <button
                                className={`${PoppinFont.className} font-medium px-9 py-2 md:py-3 md:px-12 lg:px-16 lg:py-3 xl:py-4 xl:px-20 rounded-full border-2 bg-black/35 text-xs md:text-sm lg:text-lg xl:text-xl text-white`}
                                onClick={() => router.push(`/tours/${slide.tour_id}`)}
                            >
                                {t("bookings")}
                            </button>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default MainSwiper;
