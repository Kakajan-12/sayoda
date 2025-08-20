import { PoppinFont } from '@/Ui/Fonts';
import { useTranslations, useLocale } from 'next-intl';
import React from 'react';

interface MapProps {
  data: {
    map: string;
  };
}

const Map: React.FC<MapProps> = ({ data }) => {
  const t = useTranslations("SectionTitle");

  return (
      <div className='container mx-auto px-5 pt-10 pb-24 md:pb-32 md:pt-20'>
        <h2 className={`text-2xl lg:text-2xl 2xl:text-4xl leading-9 2xl:leading-[65px] font-bold ${PoppinFont.className}`}>
          {t("map")}
        </h2>

        <div className="w-full h-auto rounded-xl mt-10 md:mt-10 overflow-hidden">
          <div dangerouslySetInnerHTML={{ __html: data.map }} />
        </div>
      </div>
  );
};

export default Map;
