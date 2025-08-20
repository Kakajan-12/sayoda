import { PoppinFont, QuicksandFont } from '@/Ui/Fonts'
import React from 'react'
import mainImg from '../../../public/DiscoverImg/bg-tour.jpg'
import Image from 'next/image'
import { useTranslations } from 'next-intl'


const DiscoverMain = () => {
  const t = useTranslations("Discover")
  return (
    <div className='relative z-10'>
        <div className='relative'>
            <Image
                alt="test"
                className=" w-full  object-cover  h-[60vh] md:h-[80vh] lg:h-[92vh]   "
                width={800}
                height={500}
                src={mainImg}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"/>
            <div className="absolute  w-full h-full  top-0  ">
                <div
                    className='container px-5 sm:px-10  pb-10 flex justify-center gap-8   text-center flex-col  items-cente mx-auto md:w-3/4 lg:w-3/5 w-full  h-full'>
                    <h1 className={`${PoppinFont.className} px-2 text-xl sm:text-2xl lg:text-2xl xl:text-3xl  font-semibold text-white leading-8 lg:leading-10 xl:leading-[60px] tracking-wider`}>{t("title")}</h1>
                    <p className={`${QuicksandFont.className} text-sm lg:text-lg xl:text-xl text-white font-extralight`}>{t("text")} </p>
                </div>
            </div>

        </div>
    </div>
  )
}

export default DiscoverMain