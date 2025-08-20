'use client';
import React, { useEffect, useState } from 'react';
import { PoppinFont } from '@/Ui/Fonts';
import { useTranslations } from 'next-intl';
import PopularCard from "../CardProps/PopularCardProps";
import { BASE_API_URL } from "@/i18n/api";

interface Tour {
    id: number;
    image: string;
    popular: number;
    title_tk: string;
    title_en: string;
    title_ru: string;
    text_tk: string;
    text_en: string;
    text_ru: string;
    destination_tk: string;
    destination_en: string;
    destination_ru: string;
    duration_tk: string;
    duration_en: string;
    duration_ru: string;
    lang_tk: string;
    lang_en: string;
    lang_ru: string;
    price: number;
    tour_type_id: number;
    tour_cat_id: number;
    location_id: number;
    type_tk: string;
    type_en: string;
    type_ru: string;
    cat_tk: string;
    cat_en: string;
    cat_ru: string;
    location_tk: string;
    location_en: string;
    location_ru: string;
}

const PopularCards = () => {
    const t = useTranslations("SectionTitle");
    const [popularTours, setPopularTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const res = await fetch(`${BASE_API_URL}/api/tours`);
                const data: Tour[] = await res.json();
                setPopularTours(data.filter(tour => tour.popular === 1));
            } catch (err) {
                console.error("Ошибка загрузки туров:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    if (loading) return <p>Загрузка популярных туров...</p>;

    return (
        <div className='container mx-auto px-5 py-10 md:py-20'>
            <h2 className={`${PoppinFont.className} md:mb-14 mb-10 font-bold text-xl md:text-2xl xl:text-3xl`}>
                {t("popular")}
            </h2>
            <PopularCard cards={popularTours} />
        </div>
    );
};

export default PopularCards;
