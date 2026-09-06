import { PoppinFont } from '@/components/ui/Fonts';
import { useTranslations, useLocale } from 'next-intl';
import React from 'react';
import ImageWithSkeleton from '@/components/ui/ImageWithSkeleton';
import {BASE_API_URL} from "@/i18n/api";

interface MapProps {
  data: {
    map?: string | null;
  };
  /** Осмысленный alt — обычно название тура. */
  alt?: string;
}

const Map: React.FC<MapProps> = ({ data, alt }) => {
  const t = useTranslations("SectionTitle");

  // У части туров карта не загружена — без этой проверки .replace падал на null.
  if (!data?.map) return null;

  return (
      <div className='container mx-auto px-4 pt-10 pb-24'>
        <h2 className={`text-2xl 2xl:text-4xl leading-9 2xl:leading-[65px] font-bold ${PoppinFont.className}`}>
          {t("map")}
        </h2>

        <div className="relative w-full flex justify-center rounded-xl mt-10">
          {/*<div dangerouslySetInnerHTML={{ __html: data.map }} />*/}
            <ImageWithSkeleton
                src={`${BASE_API_URL}/${data.map.replace(/\\/g, "/")}`}
                alt={alt || "Tour route map"}
                width={400}
                height={300}
                className="w-full h-full object-cover"
                skeletonClassName="rounded-xl"
            />

        </div>
      </div>
  );
};

export default Map;
