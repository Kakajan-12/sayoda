import { PoppinFont, QuicksandFont } from '@/Ui/Fonts'
import React from 'react'
import mainImg from '../../../public/DiscoverImg/Nature Mongolia Photo by Tamir.svg'
import Image from 'next/image'
import FilterInputs from './FilterInputs'
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
          <div className="absolute  w-full h-full  top-0  ">
            <div className='container px-5 sm:px-10  pb-10 flex justify-center gap-8   text-center flex-col  items-cente mx-auto md:w-3/4 lg:w-3/5 w-full  h-full'>
            <h1 className={`${PoppinFont.className } px-2 text-xl sm:text-2xl lg:text-2xl xl:text-3xl  font-semibold text-white leading-8 lg:leading-10 xl:leading-[60px] tracking-wider`}>{t("tittle")}</h1>
            <p className={`${QuicksandFont.className  } text-sm lg:text-lg xl:text-xl text-white font-extralight`}>{t("text")} </p>
          </div>
          </div>
            
        </div>
        <div className='absolute  w-full   hidden md:block  -bottom-20   z-10 '>
          <div className='container mx-auto px-10  lg:px-16 2xl:px-20'>
                 <div className='bg-white shadowFilter w-full px-5 md:px-10 2xl:px-20 gap-x-5 xl:gap-x-12 2xl:gap-x-16 py-10 flex  flex-col md:flex-row items-center  justify-between'>
                 <FilterInputs id='1' name='Destinations'/>
                 <FilterInputs id='2' name='Tour Type'/>
                 <FilterInputs id='3' name='Travel Style'/>
                 <button className={`bg-[#748B95] rounded-2xl text-white self-end xl:text-lg md:text-xs lg:text-md lg:py-3.5 xl:py-2 w-full md:py-2 ${QuicksandFont.className}`} >Search</button>
                 </div>
          </div>
        </div>
    </div>
  )
}

export default DiscoverMain