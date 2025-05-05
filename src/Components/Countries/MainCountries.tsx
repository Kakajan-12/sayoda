import { PoppinFont, QuicksandFont } from '@/Ui/Fonts'
import Image from 'next/image'
import React from 'react'
import MainImg from '../../../public/BlogsImg/image.svg'
const MainCountries = () => {
  return (
    <div className='relative w-full'>
                <Image
                    alt="test"
                    className=" w-full  object-cover  h-[500px] md:h-[89vh]  "
                    width={800}
                    height={500}
                    src={MainImg}
                  />
         <div className="absolute text-start pt-20  md:pt-0 w-full h-full  top-0  ">
           <div className='container px-5 sm:px-10  flex  gap-10 sm:gap-8   text-start   flex-col justify-start md:justify-center   items-end  mx-auto w-full h-full'>
           <h1 className={`${PoppinFont.className }  sm:px-2 dort:text-3xl text-2xl sm:text-4xl  lg:text-5xl xl:text-6xl 2xl:text-7xl  font-bold text-end text-white leading-8 lg:leading-[65px] xl:leading-[70px] tracking-wide`}>Kyrgyzstan Horseback <br /> Adventure: Riding Through <br /> the Tien Shan</h1>
         </div>
         </div>
    </div>
  )
}

export default MainCountries