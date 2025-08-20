import React from 'react'
import img1 from '../../../public/AboutImgs/image (1).svg'
import img2 from '../../../public/AboutImgs/image (2).svg'
import img3 from '../../../public/AboutImgs/image (3).svg'
import img4 from '../../../public/AboutImgs/image.svg'
import Image from 'next/image'
import imgleft from '../../../public/AboutImgs/YellowImgs/image 17.svg'
import imgright from '../../../public/AboutImgs/YellowImgs/image 18.svg'
import imgcenter from '../../../public/AboutImgs/YellowImgs/Rectangle 159.svg'
import { useTranslations } from 'next-intl'
const arrayContactImg = [
    {id:1,imgs: img4},
    {id:2,imgs: img1},
    {id:3,imgs: img3},
    {id:4,imgs: img2},
]
const AboutUs = () => {
  const t = useTranslations('About')
  return (
    <div className='w-full bg-mainBlue relative '>
        <div className='w-full h-full  absolute  top-0'>
            <div className='w-full h-full flex md:container mx-auto justify-between z-0'>
                  <Image alt='left' className='w-24 min-[370px]:w-32 bas:w-28 sm:w-44 md:w-44 lg:w-52 2xl:w-72 self-start' src={imgleft}/>
                  <Image alt='left' className='w-24 min-[370px]:w-32 self-end sm:w-36 md:w-44 lg:w-52 2xl:w-72 md:mb-5 lg:mb-10 mb-5' src={imgright}/>
            </div>
        </div>
        <div className='h-auto pt-10 sm:pt-20 lg:pt-32 sm:pb-32 md:pb-44 lg:pb-48 2xl:pb-56 pb-28'>
             <div className='container mx-auto relative z-20 text-white px-7 text-center'>
            <h2 className={`text-2xl sm:text-3xl relative xl:text-4xl flex justify-center 2xl:text-5xl font-bold font-comforta`}>
               <Image alt='left' className='w-10   absolute justify-self-center mr-36 -top-4  z-0  hidden sm:block' src={imgcenter}/>
               <span className='z-20 relative'> {t("title")}</span>
            </h2>
            <p className={`font-quicksand text-sm sm:text-lg sm:px-10 lg:mt-10 lg:px-28 sm:leading-8 lg:leading-9 2xl:leading-[47px] font-normal lg:text-2xl xl:text-2xl 2xl:text-3xl leading-7 mt-5 `}>
                {t("text")}
            </p>
             </div>
             <div className=' w-full absolute  z-20  -bottom-40 min-[363px]:-bottom-12  bas:top-72 sm:top-auto sm:-bottom-16 xl:-bottom-32'>
            <div className='container mx-auto flex-wrap gap-3 px-5 flex justify-center  '>
            {
                arrayContactImg.map((items,i) => (
                    <div className={`${i == 3 && 'hidden mt-3 bas:block'} ${i !== 1 && i !== 3  && " mb-3 bas:mb-0 " } w-[100px] sm:w-32 md:w-40 lg:w-52 xl:w-60 2xl:w-72  flex items-end bas:items-center`}>
                        <Image alt='imgs ' className=' w-full object-cover ' src={items.imgs}/>
                    </div>
                ))
            }
            </div>
             </div>
        </div>
    </div>
  )
}

export default AboutUs