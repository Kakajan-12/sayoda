'use client'
import React, {useEffect, useState} from "react";
import {MontserratFont, PoppinFont, QuicksandFont} from "@/Ui/Fonts";
import Image from "next/image";
import CallendaIcon from '../../../public/PopularCardIcons/calendar4-week.svg'
import DollarIcon from '../../../public/PopularCardIcons/dollar-sign.svg'
import GroupIcon from '../../../public/PopularCardIcons/person-square.svg'
import {WindowWidth} from "@/Hooks/WindowWidth";
import Link from "next/link";
import {BASE_API_URL} from "@/i18n/api";
import {useLocale, useTranslations} from "next-intl";

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
    duration_tk: string;
    duration_en: string;
    duration_ru: string;
    lang_tk: string;
    lang_en: string;
    lang_ru: string;
    price: number;
}

interface CardsProps {
    cards: Tour[];
}

const PopularCard: React.FC<CardsProps> = ({ cards }) => {
    const width = WindowWidth();
    const locale = useLocale();
    const t = useTranslations("TourPerPage");

    const getLocalized = (item: any, field: string) => {
        return (
            item[`${field}_${locale}`] ||
            item[`${field}_en`] ||
            item[`${field}_tk`] ||
            ""
        );
    };

    const getFixedImageUrl = (path: string) =>
        `${BASE_API_URL.replace(/\/+$/, "")}/${path.replace(/\\/g, "/").replace(/^(\.\.\/)+/, "")}`;

    const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

    const getLimitByBreakpoint = () => {
        if (width < 500) return 85;
        if (width < 768) return 29;
        if (width < 1024) return 100;
        if (width < 1300) return 85;
        if (width < 1530) return 100;
        return 200;
    };

    const forDescription = (text: string) =>
        text.length > getLimitByBreakpoint() ? text.slice(0, getLimitByBreakpoint()) + "..." : text;

    const forTittle = (text: string, limit: number) =>
        text.length > limit ? text.slice(0, limit) + "..." : text;

    if (!cards || cards.length === 0) return <p>Нет популярных туров</p>;

    return (
        <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cards.map((tour) => (
                <Link key={tour.id} href={`/tours/${tour.id}`}>
                    <div className="flex flex-col border-[#E6E6E6]">
                        <Image
                            alt={stripHtml(getLocalized(tour, "title"))}
                            className="w-full rounded-t-xl object-cover min-h-[200px] h-[200px]"
                            src={getFixedImageUrl(tour.image)}
                            width={400}
                            height={200}
                        />
                        <div
                            className="w-full h-full p-5 border-x-2 border-b-2 rounded-b-xl flex flex-col justify-between border-[#E6E6E6]">
                            <p className={`${PoppinFont.className} font-bold text-sm`}>
                                {forTittle(stripHtml(String(getLocalized(tour, "title"))), 40)}
                            </p>
                            <p className={`${QuicksandFont.className} py-3 font-medium text-xs`}>
                                {forDescription(stripHtml(String(getLocalized(tour, "text"))))}
                            </p>
                            <div className="w-full h-[2px] bg-slate-200"></div>
                            <div className="flex flex-col pt-3 gap-2">
                                <p className="flex items-center gap-x-2 text-xs">
                                    <Image alt="Price" className="w-3 md:w-4" src={DollarIcon}/>
                                    <span className={`${MontserratFont.className} text-xs font-bold`}>
                                        {t('price')}
                                    </span> {tour.price}$
                                </p>
                                <p className="flex items-center gap-x-2 text-xs">
                                    <Image alt="Duration" className="w-3 md:w-4" src={CallendaIcon}/>
                                    <span className={`${MontserratFont.className} text-xs font-bold`}>
                                        {t("days")}
                                    </span> {stripHtml(getLocalized(tour, "duration"))}
                                </p>
                                <p className="flex items-center gap-x-2 text-xs">
                                    <Image alt="Language" className="w-3 md:w-4" src={GroupIcon}/>
                                    <span className={`${MontserratFont.className} text-xs font-bold`}>
                                        {t('lang')}
                                    </span> {stripHtml(getLocalized(tour, "lang"))}
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default PopularCard;
