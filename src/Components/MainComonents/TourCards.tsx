'use client';

import React from 'react';
import {
    MontserratFont,
    PoppinFont,
    QuicksandFont,
} from '@/Ui/Fonts';
import Image from 'next/image';
import CallendaIcon from '../../../public/PopularCardIcons/calendar4-week.svg';
import DollarIcon from '../../../public/PopularCardIcons/dollar-sign.svg';
import GroupIcon from '../../../public/PopularCardIcons/person-square.svg';
import { WindowWidth } from '@/Hooks/WindowWidth';
import Link from 'next/link';
import { BASE_API_URL } from '@/i18n/api';
import { useLocale, useTranslations } from 'next-intl';

interface Tour {
    id: number;
    slug?: string;
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
    location_id: number;
}

interface Props {
    tours: Tour[];
}

const TourCards: React.FC<Props> = ({ tours }) => {
    const width = WindowWidth();
    const locale = useLocale();
    const t = useTranslations("TourPerPage");

    const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

    const getLocalized = (item: Tour, field: string) =>
        (item[`${field}_${locale}` as keyof Tour] as string) ||
        (item[`${field}_en` as keyof Tour] as string) ||
        (item[`${field}_tk` as keyof Tour] as string) ||
        "";

    const getFixedImageUrl = (path: string) =>
        `${BASE_API_URL.replace(/\/+$/, '')}/${path
            .replace(/\\/g, '/')
            .replace(/^(\.\.\/)+/, '')}`;

    if (!tours || !tours.length) {
        return <p className="text-center py-10">Нет туров</p>;
    }

    return (
        <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tours.map((tour) => {
                const title = stripHtml(getLocalized(tour, "title"));
                const text = stripHtml(getLocalized(tour, "text"));
                const duration = stripHtml(getLocalized(tour, "duration"));
                const lang = stripHtml(getLocalized(tour, "lang"));

                return (
                    <Link
                        key={tour.id}
                        href={tour.id ? `/tours/${tour.id}` : '#'}
                        className="flex flex-col border-[#E6E6E6]"
                    >
                        <Image
                            alt={title}
                            className="w-full rounded-t-xl object-cover min-h-[200px] h-[200px]"
                            src={getFixedImageUrl(tour.image)}
                            width={400}
                            height={200}
                        />
                        <div className="w-full h-full p-5 border-x-2 border-b-2 rounded-b-xl flex flex-col justify-between border-[#E6E6E6]">
                            <p className={`${PoppinFont.className} font-bold text-sm`}>
                                {title}
                            </p>
                            <p className={`${QuicksandFont.className} py-3 font-medium text-xs`}>
                                {text}
                            </p>
                            <div className="w-full h-[2px] bg-slate-200"></div>
                            <div className="flex flex-col pt-3 gap-2">
                                <p className="flex items-center gap-x-2 text-xs">
                                    <Image alt="Price" className="w-3 md:w-4" src={DollarIcon} />
                                    <span className={`${MontserratFont.className} text-xs font-bold`}>
                                        {t('price')}
                                    </span>
                                    {tour.price}$
                                </p>
                                <p className="flex items-center gap-x-2 text-xs">
                                    <Image alt="Duration" className="w-3 md:w-4" src={CallendaIcon} />
                                    <span className={`${MontserratFont.className} text-xs font-bold`}>
                                        {t('days')}
                                    </span>{' '}
                                    {duration}
                                </p>
                                <p className="flex items-center gap-x-2 text-xs">
                                    <Image alt="Language" className="w-3 md:w-4" src={GroupIcon} />
                                    <span className={`${MontserratFont.className} text-xs font-bold`}>
                                        {t('lang')}
                                    </span>{' '}
                                    {lang}
                                </p>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default TourCards;
