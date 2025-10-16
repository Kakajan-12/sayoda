import { PoppinFont } from '@/Ui/Fonts';
import { useTranslations, useLocale } from 'next-intl';
import React from 'react';
import Image from 'next/image';
import {BASE_API_URL} from "@/i18n/api";

interface MapProps {
  data: {
    map: string;
  };
}

const Map: React.FC<MapProps> = ({ data }) => {
  const t = useTranslations("SectionTitle");

  return (
      <div className='container mx-auto px-4 pt-10 pb-24'>
        <h2 className={`text-2xl 2xl:text-4xl leading-9 2xl:leading-[65px] font-bold ${PoppinFont.className}`}>
          {t("map")}
        </h2>

        <div className="w-full flex justify-center rounded-xl mt-10">
          {/*<div dangerouslySetInnerHTML={{ __html: data.map }} />*/}
            <Image
                src={`${BASE_API_URL}/${data.map.replace("\\", "/")}`}
                alt="Map image"
                width={400}
                height={300}
                className="w-full h-full object-cover"
            />

        </div>
      </div>
  );
};

export default Map;
