import { exludesArray, includesArray } from '@/app/[locale]/ArrayForTest/ArrayForTest'
import { PoppinFont, QuicksandFont } from '@/Ui/Fonts'
import React from 'react'
import cheked from '../../../public/Tour Icons/checked 1.svg'
import notChecked from '../../../public/Tour Icons/x-square.svg'
import { div } from 'framer-motion/client'
import Image from 'next/image'
import { Quicksand } from 'next/font/google'
import { useTranslations } from 'next-intl'
const IncludesExcludes = () => {
  const t= useTranslations("TourPerPage")
  return (
    <div className='w-full bg-[#E3ECF5] py-10 md:py-20 h-auto'>
          <div className='container mx-auto px-5 lg:px-32'>
              <h2 className={`text-xl lg:text-2xl  2xl:text-3xl leading-9  2xl:leading-[65px] font-bold  ${PoppinFont.className}`}>{t("whats")}</h2>
              
              <div className='flex flex-col mt-10 gap-y-12 md:gap-x-10  sm:flex-row sm:justify-between'>
                   <div className='flex flex-col gap-5 md:w-1/2 bg-white px-5 py-7 xl:py-14 lg:px-10 sm:px-6 rounded-xl'>
                    <h3 className={`text-lg font-semibold lg:text-xl  lg:mb-5  ${PoppinFont.className}`}>{t("include")}</h3>
                    {includesArray.map((items) => (
                        <div className='flex  gap-3'>
                          <Image alt='test' className='w-4 h-5 sm:w-4  xl:mt-1 sm:h-5 lg:w-5 lg:h-' src={cheked}/>
                          <p className='text-sm min-[500px]:text-sm lg:text-md xl:text-lg'>{items.name}</p>
                        </div>
                    ))}
                   </div>
                   <div className='flex flex-col gap-5 md:w-1/2 bg-white px-5 py-7 sm:px-6 lg:px-10 xl:py-16  sm:py-7 rounded-xl'>
                    <h3 className={`text-lg font-semibold lg:mb-5 lg:text-xl ${PoppinFont.className}`}>{t("notincluded")}</h3>
                    {exludesArray.map((items) => (
                        <div className='flex gap-3'>
                          <Image alt='test' className='w-5 h-3.5 xl:mt-1 mt-[3px] sm:mt-0 sm:w-3.5 lg:w-4  sm:h-5' src={notChecked}/>
                          <p className={`${QuicksandFont.className} min-[500px]:text-sm text-sm lg:text-md xl:text-lg   font-medium`}>{items.name}</p>
                        </div>
                    ))}
                   </div>
              </div>
                
          </div>
    </div>
  )
}

export default IncludesExcludes