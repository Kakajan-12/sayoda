import { PoppinFont, QuicksandFont } from '@/Ui/Fonts'
import Image from 'next/image'
import React from 'react'
import MainImg from '../../../public/ContactUs/Papiers peints (Paysages) [2560x1440].svg'
import { useTranslations } from 'next-intl'

const ContactMain = () => {
  const t = useTranslations("ContactUs")
  return (
    <div className='relative w-full'>
                <Image
                    alt="test"
                    className=" w-full  object-cover  h-[40vh] md:h-full  "
                    width={800}
                    height={500}
                    src={MainImg}
                  />
         <div className="absolute text-start pt-20  md:pt-0 w-full h-full  top-0  ">
           <div className='container px-5 sm:px-10  flex  gap-10 sm:gap-8   text-center   flex-col justify-start md:justify-center   items-center  mx-auto w-4/6 h-full'>
           <h1 className={`${PoppinFont.className }  sm:px-2 dort:text-3xl text-2xl sm:text-4xl  lg:text-5xl xl:text-4xl 2xl:text-6xl  font-bold text-center text-white leading-8 lg:leading-[65px] xl:leading-[75px] 2xl:leading-[80px] tracking-wide`}>{t("tittle")}</h1>
         </div>
         </div>
    </div>
  )
}

export default ContactMain