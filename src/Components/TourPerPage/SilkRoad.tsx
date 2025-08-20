'use client'
import React from 'react'
import { PoppinFont, QuicksandFont } from '@/Ui/Fonts'
import Image from 'next/image'
import { InfoP } from '@/Ui/tourInfo/InfoP'
import { useTranslations, useLocale } from 'next-intl'
import { FaRegMap } from "react-icons/fa6";
import { MdOutlineAccessTime } from "react-icons/md";
import { HiTranslate } from "react-icons/hi";
import { VscTypeHierarchySub } from "react-icons/vsc";
import { BASE_API_URL } from "@/i18n/api";

interface TourData {
    image: string;
    price: number;
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
    type_tk: string;
    type_en: string;
    type_ru: string;
    cat_tk?: string;
    cat_en?: string;
    cat_ru?: string;
}

interface SilkRoadProps {
    data: TourData;
}

const SilkRoad: React.FC<SilkRoadProps> = ({ data }) => {
    const t = useTranslations("TourPerPage")
    const locale = useLocale();

    const getFieldByLocale = (fieldBase: string) => {
        return data[`${fieldBase}_${locale}` as keyof TourData] || data[`${fieldBase}_tk` as keyof TourData] || '';
    }


    const getFixedImageUrl = (path: string) => {
        if (!path) return "";
        return (
            BASE_API_URL.replace(/\/+$/, "") +
            "/" +
            path
                .replace(/\\/g, "/")
                .replace(/^(\.\.\/)+/, "")
                .replace(/^\/+/, "")
        );
    };

    return (
        <div className='container mx-auto px-5 py-10 md:py-14'>
            <div className="w-full flex md:flex-row flex-col md:space-x-5 lg:space-x-10 space-y-10 md:space-y-0 md:justify-between">

                {/* Left Column */}
                <div className="flex md:w-3/5 flex-col gap-6">
                    <div
                        className={`text-2xl lg:text-2xl 2xl:text-5xl leading-9 2xl:leading-[65px] font-bold ${PoppinFont.className}`}
                        dangerouslySetInnerHTML={{ __html: getFieldByLocale('title') }}
                    />

                    <div
                        className={`${QuicksandFont.className} hidden md:block font-normal text-xs leading-5 lg:leading-6 lg:text-sm xl:text-lg 2xl:text-xl`}
                        dangerouslySetInnerHTML={{ __html: getFieldByLocale('text') }}
                    />

                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div><FaRegMap size={20}/></div>
                                <div className={`${QuicksandFont.className} hidden md:block font-normal text-xs leading-5 lg:leading-6 lg:text-sm xl:text-md 2xl:text-lg`}>
                                    {t('destinations')}:
                                </div>
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: getFieldByLocale('destination') }} />
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div><MdOutlineAccessTime size={20}/></div>
                                <div className={`${QuicksandFont.className} hidden md:block font-normal text-xs leading-5 lg:leading-6 lg:text-sm xl:text-md 2xl:text-lg`}>
                                    {t('duration')}:
                                </div>
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: getFieldByLocale('duration') }} />
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div><HiTranslate size={20}/></div>
                                <div className={`${QuicksandFont.className} hidden md:block font-normal text-xs leading-5 lg:leading-6 lg:text-sm xl:text-md 2xl:text-lg`}>
                                    {t('languages')}:
                                </div>
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: getFieldByLocale('lang') }} />
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div><VscTypeHierarchySub size={20}/></div>
                                <div className={`${QuicksandFont.className} hidden md:block font-normal text-xs leading-5 lg:leading-6 lg:text-sm xl:text-md 2xl:text-lg`}>
                                    {t('tour')}:
                                </div>
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: getFieldByLocale('type') }} />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="relative flex justify-end w-full h-[450px] sm:h-[500px] md:h-[500px] md:w-2/5 text-white">
                    <Image
                        alt="tour image"
                        className="w-3/4 h-full rounded-2xl object-cover"
                        src={getFixedImageUrl(data.image)}
                        width={1000}
                        height={1000}
                    />
                    <div className="absolute center custom flex flex-col justify-center gap-2">
                        <p className='bg-mainBlueGray bg-opacity-90 py-5 px-10 rounded-xl xl:text-2xl text-2xl sm:text-3xl flex justify-center items-center'>
                            {t("from")}: <span className='xl:text-4xl ml-2.5'>{data.price}$</span>
                        </p>
                        <div className='bg-mainBlueGray bg-opacity-90 w-full flex flex-col 2xl:px-5 sm:px-4 px-3 py-7 sm:py-8 lg:py-10 rounded-xl'>
                            <InfoP
                                label={t("category")}
                                value={String(getFieldByLocale('cat') ?? '')}
                            />

                        </div>
                    </div>
                </div>

                {/* Mobile View */}
                <div className="flex md:hidden flex-col gap-6 md:w-3/5">
                    <p className={`${QuicksandFont.className} font-normal text-sm leading-5 lg:leading-6 lg:text-sm xl:text-lg 2xl:text-xl`}>
                        {getFieldByLocale('text')}
                    </p>

                </div>

            </div>
        </div>
    )
}

export default SilkRoad
