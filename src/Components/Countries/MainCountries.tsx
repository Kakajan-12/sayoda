import { PoppinFont } from '@/Ui/Fonts';
import { useLocale } from 'next-intl';
import { BASE_API_URL } from "@/i18n/api";
import Image from "next/image";
import React from "react";

interface MainCountriesProps {
    data: {
        id: number;
        title_tk?: string;
        title_en?: string;
        title_ru?: string;
        image?: string;
        [key: string]: any; // для остальных полей
    };
}

const MainCountries: React.FC<MainCountriesProps> = ({ data }) => {
    const locale = useLocale();

    const getFieldByLocale = (fieldBase: string) => {
        return data[`${fieldBase}_${locale}`] || data[`${fieldBase}_tk`] || '';
    }

    const getFixedImageUrl = (path?: string) => {
        if (!path) return "/fallback.jpg";
        return BASE_API_URL.replace(/\/+$/, "") + "/" + path.replace(/\\/g, "/").replace(/^(\.\.\/)+/, "").replace(/^\/+/, "");
    };

    return (
        <div className='relative w-full'>
            {data?.image && (
                <Image
                    src={getFixedImageUrl(data.image)}
                    alt="blog"
                    width={1920}
                    height={1080}
                    className="w-full object-cover h-[500px] md:h-[89vh]"
                />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

            <div className="absolute text-start pt-20 md:pt-0 w-full h-full top-0">
                <div className='container px-5 sm:px-10 flex gap-10 sm:gap-8 text-start flex-col justify-start md:justify-center items-end mx-auto w-full h-full'>
                    <h1
                        className={`${PoppinFont.className} sm:px-2 text-2xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-end text-white leading-8 lg:leading-[65px] xl:leading-[70px] tracking-wide`}
                        dangerouslySetInnerHTML={{ __html: getFieldByLocale('title') }}
                    />
                </div>
            </div>
        </div>
    );
};

export default MainCountries;
