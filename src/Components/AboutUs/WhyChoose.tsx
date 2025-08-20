import { PoppinFont, QuicksandFont } from '@/Ui/Fonts'
import React from 'react'
import img1 from '../../../public/AboutImgs/ChooseUs/Minimalist_Lines_Art_2___Black_and_Beige_Lines___Digital_Download___Mid_Century_Modern___Line_Drawing_Print___Minimalist_Poster-removebg-preview 1 (1).svg'
import img2 from '../../../public/AboutImgs/ChooseUs/Minimalist_Lines_Art_2___Black_and_Beige_Lines___Digital_Download___Mid_Century_Modern___Line_Drawing_Print___Minimalist_Poster-removebg-preview 1.svg'
import img3 from '../../../public/AboutImgs/ChooseUs/Без_названия__5_-removebg-preview 1.svg'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
const chooseArray = [
    {img : img2 , title : "Seamless & Stress-Free Planning" , desc: 'We handle all the details – from visas and accommodations to transportation and guided tours. You just focus on enjoying the adventure!'},
    {img : img1 , title : "Authentic & Immersive Travel" ,  desc : 'We go beyond the typical tourist routes, offering deep cultural experiences with local experts. From exploring ancient Silk Road cities to staying in traditional yurts, we ensure an unforgettable journey.'},
    {img: img3 , title : 'Expert Local Guides' , desc: 'Our professional guides are locals with in-depth knowledge of history, culture, and hidden gems, making your trip both educational and inspiring.'}
]


const WhyChoose = () => {
  const backColors = (index : number)=>{
    if(index === 0 ){
        return  'bg-[#748B95]'
    }
    if(index === 1 ){
        return  'bg-[#84A4BC]'
    }
    if(index === 2 ){
        return  'bg-[#87AEBF]'
    }
  }
  const t = useTranslations("SectionTitle")
  const Why = useTranslations("Why")
  const rawTittle = Why.raw('cardtitle')
  const rawText = Why.raw('cardtext')
  return (
    <div className='container mx-auto px-5 pb-10'>
         <h2 className={`text-2xl lg:text-2xl  2xl:text-4xl leading-9  2xl:leading-[65px] font-bold  ${PoppinFont.className}`}>{t("why")}?</h2>
         <div className='flex flex-col mt-8 gap-5 md:mt-10 md:flex-row md:justify-center'>
            {
                chooseArray.map((items , i) => (
                    <div className={`${backColors(i)}  md:w-[397px]  rounded-3xl text-white relative px-8 py-6 sm:px-10 sm:py-10 md:px-7 flex flex-col gap-5 lg:gap-8 `}>
                        <Image alt='imgs' className='w-full h-full object-cover top-0 right-0 rounded-3xl absolute' src={items.img} />
                        <i className={`${PoppinFont.className} text-xl font-semibold  relative sm:text-xl  lg:text-2xl z-20 `}>{rawTittle[i]}</i>
                        <p className={`${QuicksandFont.className} text-sm font-medium  relative sm:text-md lg:text-lg z-20`}>{rawText[i]}</p>
                    </div>
                ))
            }
         </div>
    </div>
  )
}

export default WhyChoose