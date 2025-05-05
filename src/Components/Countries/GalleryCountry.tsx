import React from 'react'
import img1 from '../../../public/Testss/Hiking In Kyrgyzstan_ The 21 Best Jyrgalan And Karakol Trekking Trails _ Journal Of Nomads.svg'
import img2 from '../../../public/Testss/9 fascinating facts about Turkmenistan.png'
import img3 from '../../../public/Tour Icons/Camel.svg'
import { PoppinFont } from '@/Ui/Fonts'
import Image from 'next/image'
const arrayGallery = [
    {img: img3},
    {img: img1},
    {img: img2},
    {img: img1},
    {img: img1},
    {img: img1},
]

const GalleryCountry = () => {
  return (
    <div className='container mx-auto px-5  pb-20'>
    <div className='columns-2 md:columns-3 lg:columns-4 md:gap-4 gap-2.5 mt-10 lg:mt-20 space-y-2 md:space-y-4'>
        {
            arrayGallery.map((items)=>(
                <div className='rounded-xl shadow-md'>
                    <Image className='w-full max-h-[500px] rounded-xl h-full object-cover'  alt='test' src={items.img}/>
                </div>
            ))
        }     
    </div>
</div>
  )
}

export default GalleryCountry


