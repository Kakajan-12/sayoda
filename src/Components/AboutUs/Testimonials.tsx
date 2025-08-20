'use client';

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";
import { useTranslations } from "next-intl";
import { BASE_API_URL } from "@/i18n/api";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Testimonial {
    id: number;
    name: string;
    image: string;
    text: string;
}

const Testimonials = () => {
    const section = useTranslations("SectionTitle");
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${BASE_API_URL}/api/testimonials`)
            .then((res) => res.json())
            .then((data) => setTestimonials(data))
            .catch((err) => console.error("Failed to load testimonials", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="container mx-auto px-5 pt-10 pb-20">
            <h2
                className={`text-2xl lg:text-2xl 2xl:text-3xl leading-9 2xl:leading-[65px] font-bold ${PoppinFont.className}`}
            >
                {section("testimonial")}
            </h2>

            {loading ? (
                <p className="mt-6">Загрузка отзывов...</p>
            ) : testimonials.length === 0 ? (
                <p className="mt-6 text-gray-500">Отзывов пока нет</p>
            ) : (
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={20}
                    slidesPerView={1}
                    className="mt-10"
                >
                    {testimonials.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div
                                className={`w-full bg-[#EAF1F7] rounded-xl flex flex-col shadow-[#00000040] shadow-lg ${PoppinFont.className}`}
                            >
                                {/* Шапка */}
                                <div className="w-full flex items-center gap-2">
                                    <div className="bg-mainBlue flex items-center gap-3 pr-8 pl-5 py-2 rounded-e-full">
                                        <div className="p-1 bg-white rounded-full">
                                            <Image
                                                alt="user"
                                                width={48}
                                                height={48}
                                                src={`${BASE_API_URL}/${item.image.replace(/\\/g, "/")}`}
                                                className="rounded-full object-cover"
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
                                    <p
                                        className={`xl:text-lg text-sm xl:leading-8 leading-6 ${QuicksandFont.className}`}
                                        dangerouslySetInnerHTML={{ __html: item.text }}
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
};

export default Testimonials;
