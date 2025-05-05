import React from 'react'
import img1 from '../../../public/AboutImgs/Servicessimg/global_8003696.svg'
import img2 from '../../../public/AboutImgs/Servicessimg/human-world_1610343 1.svg'
import img3 from '../../../public/AboutImgs/Servicessimg/Снимок_экрана_2025-03-29_165309-removebg-preview.svg'
import img4 from '../../../public/AboutImgs/Servicessimg/Снимок_экрана_2025-03-29_165648-removebg-preview.svg'
import Image from 'next/image'
import { MontserratFont, PoppinFont, QuicksandFont } from '@/Ui/Fonts'
import { useTranslations } from 'next-intl'
const  servicesImgs = [
  {img: img1 , tittle: 'Customized Tours', description: 'Tailor-made itineraries for solo travelers, groups, and families.'},
  {img: img2 , tittle: 'Cultural Experiences', description: 'Guided tours to UNESCO sites, local crafts, and traditions.'},
  {img: img4 , tittle: 'Luxury & Comfort', description: 'High-end accommodations and private transport options.'},
  {img: img3 , tittle: 'Adventure Travel', description: 'Trekking, desert expeditions, and off-the-beaten-path discoveries.'},
]
const Services = () => {
  const t = useTranslations('Services')
  const rawtittle  = t.raw("cardtittle")
  const rawtext  = t.raw("cardtext")
  return (
    <div className='flex flex-col md:flex-row md:container md:items-center  md:mx-auto md:px-5 gap-14 md:gap-5 2xl:gap-7 pt-52 min-[360px]:pt-32 md:pt-36 lg:pt-48 pb-20 xl:pt-60 '>
       <div className='container md:w-2/6 mx-auto px-5 md:px-0 space-y-2 sm:space-y-3 md:space-y-4  '>
          <h3 className={`${PoppinFont.className} text-2xl  sm:text-3xl  lg:text-3xl  2xl:text-4xl leading-9  2xl:leading-[65px] font-bold`}>{t("tittle")}</h3>
          <h2 className={`${MontserratFont.className} text-xl sm:text-[22px] lg:text-2xl xl:text-4xl font-bold text-[#84A4BC]`}>{t("provide")}</h2>
          <p className={`${QuicksandFont.className} text-sm sm:text-lg 2xl:text-xl 2xl:leading-7 leading-6 font-normal`}>{t("text")}</p>
       </div>
       <div className='relative  md:w-2/3 lg:w-3/5'>
          <div  className='relative mx-auto container px-5 md:px-0 md:pl-5 z-20 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  xl:grid-cols-4  gap-3 '>
            {
              servicesImgs.map((items, i) => (
                <div className={`   flex justify-between md:flex-col md:justify-between  items-center shadow-xl    h-auto  shadow-[#00000040] bg-white gap-x-6 px-5 dort:px-10 sm:px-5 md:px-5   py-6`}>
                  <div className=' rounded-full  flex justify-center items-center p-3 lg:p-4 bg-[#F1F0ED]'>
                    <Image alt='imgs' className={`min-w-10 w-10 md:min-w-14 lg:w-14 ${i === 1 ? '' : ''}`} src={items.img}/>
                  </div>
                  <h3 className={`${PoppinFont.className} md:mt-2 hidden lg:block xl:mt-3 text-center text-[16px] lg:text-sm font-medium `}>{rawtittle[i]}</h3>
                  <div className='md:text-center md:mt-4 gap-3 flex flex-col  xl:mt-3 '>
                    <h3 className={`${PoppinFont.className} md:mt-2 lg:hidden xl:mt-3  text-[16px] lg:text-xl 2xl:text-2xl font-medium `}>{rawtittle[i]}</h3>
                    <p  className={`${QuicksandFont.className}  text-xs xl:text-xs 2xl:text- leading-5 font-medium  `}>{rawtext[i]}</p>
                  </div>
                </div>
              ))
            }
          </div>
          {/* ORANGEEE BACK */}
          <div className='bg-[#CBC6A9] w-2/5 md:w-full md:h-96 lg:h-96 xl:h-52 absolute z-0 h-full  top-0'></div>
       </div>
    </div>
  )
}

export default Services