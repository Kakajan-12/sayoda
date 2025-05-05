import React from 'react'
import PopularCardProps from "../CardProps/PopularCardProps";
import { popularArray } from "../../app/[locale]/ArrayForTest/ArrayForTest";
import { PoppinFont } from '@/Ui/Fonts';
import { useTranslations } from 'next-intl';


const PopularCards = () => {
  const t= useTranslations("SectionTittle")
  return (
    <div  className='container mx-auto px-5 py-10 md:py-20'>
         <h2 className={`${PoppinFont.className} md:mb-14 mb-10  font-bold text-xl md:text-2xl  xl:text-3xl  `}>{t("popular")}</h2>
         <PopularCardProps children={popularArray}/>
    </div>
  )
}

export default PopularCards