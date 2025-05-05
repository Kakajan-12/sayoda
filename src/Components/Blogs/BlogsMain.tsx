import { PoppinFont, QuicksandFont } from '@/Ui/Fonts'
import Image from 'next/image'
import React from 'react'
 import MainImg from '../../../public/BlogsImg/image.svg'
import { useTranslations } from 'next-intl'
const BlogsMain = () => {
  const t = useTranslations('Unveiling')
  return (
         <div className='relative w-full'>
                <Image
                    alt="test"
                    className=" w-full  object-cover  h-[50vh] sm:h-[70vh]   transition-all md:h-[80vh] lg:h-[92vh]   "
                    width={800}
                    height={500}
                    src={MainImg}
                  />
         <div className="absolute text-start pt-10 sm:pt-20  md:pt-0 w-full h-full  top-0  ">
           <div className='container px-5 sm:px-10  flex  gap-10 sm:gap-8   text-start   flex-col justify-start md:justify-center   items-start  mx-auto w-full h-full'>
           <h1 className={`${PoppinFont.className } md:w-3/4  sm:px-2 dort:text-2xl text-xl sm:text-3xl  lg:text-4xl xl:text-4xl 2xl:text-5xl  font-bold text-white leading-8 lg:leading-[65px] xl:leading-[70px] tracking-wide`}>{t("tittle")}</h1>
           <p className={`${QuicksandFont.className  } text-sm dort:text-md  lg:text-xl  md:pt-2  lg:pt-5 xl:text-xl  md:w-1/2 xl:w-2/5 text-white font-extralight`}>{t('text')}</p>
         </div>
         </div>
    </div>
  )
}

export default BlogsMain