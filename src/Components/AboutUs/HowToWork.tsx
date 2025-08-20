import { PoppinFont, QuicksandFont } from '@/Ui/Fonts'
import React from 'react'
import img1 from '../../../public/AboutImgs/HowtoWork/Vector 3.svg'
import img2 from '../../../public/AboutImgs/HowtoWork/image 16.svg'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
const textsArray = new Array(3).fill({tittle : "", text:''})
const HowToWork = () => {
    const section = useTranslations("SectionTitle")
    const work =  useTranslations("Work")
    const title = work.raw("cardtitle")
    const text = work.raw("cardtext")
  return (
    <div className='w-full h-auto relative'>
    <div className='container mx-auto px-5 z-20 relative py-10 '>
         <h2 className={`text-2xl lg:text-2 xl  2xl:text-3xl leading-9  2xl:leading-[65px] font-bold  ${PoppinFont.className}`}>{section("how")}?</h2>
         <div className='flex flex-col mt-5 md:mt-10'>
            {
                textsArray.map((_, i )=> (
                    <div className='relative '>
                       <span className=' absolute top-0 text-6xl lg:text-8xl  opacity-15 font-extrabold md:text-7xl '>0{i + 1}</span>
                       <div className='px-7 md:px-12 xl:px-20 flex flex-col gap-4 py-10 lg:py-12  md:w-3/5'>
                            <h4 className={`${PoppinFont.className}  pl-5 md:pl-6 text-xl font-medium leading-7 lg:leading-10 md:text-2xl lg:text-3xl`} >{title[i]}</h4>
                            <p  className={`${QuicksandFont.className}  text-sm font-normal leading-6 md:text-md lg:text-xl lg:leading-8`}>{text[i]}</p>
                       </div>
                    </div>
                ))
            }
         </div>
    </div>
    <div className='w-full h-full z-0 absolute top-0'>
        <div className=' md:mx-auto z-0  h-full flex justify-end items-center md:container'>
            <Image alt='img' className='w-44 md:hidden    dort:w-48 bas:w-56 bas:mt-10 sm:w-60' src={img1}/>
            <Image alt='img' className='w-80 md:mt-20 xl:mt-6  lg:w-96  xl:w-96   hidden md:flex relative z-0 ' src={img2}/>
        </div>
    </div>
    </div>
  )
}

export default HowToWork