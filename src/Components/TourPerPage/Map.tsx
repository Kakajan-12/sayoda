
import { PoppinFont } from '@/Ui/Fonts'
import { useTranslations } from 'next-intl'
import React  from 'react'

const Map = () => {
  const t =useTranslations("SectionTittle")
  return (
    <div className='container mx-auto px-5 pt-10 pb-24 md:pb-32 md:pt-20'>
    <h2 className={`text-2xl lg:text-2xl  2xl:text-4xl leading-9  2xl:leading-[65px] font-bold  ${PoppinFont.className}`}>{t("map")}</h2>
      <div className="w-full h-auto  rounded-xl mt-10 md:mt-10 overflow-hidden ">
       <iframe
        src="https://www.google.com/maps?q=37.900989,58.334649&z=18&output=embed"
        className="w-full h-full"
        style={{ border: 0 ,maxHeight: '650px', minHeight:'500px', height: 'auto' }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
    </div>
  )
}

export default Map