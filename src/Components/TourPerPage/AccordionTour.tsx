'use client'
import { DatesAvailable, TourAccordionArray } from '@/app/[locale]/ArrayForTest/ArrayForTest'
import { PoppinFont, QuicksandFont } from '@/Ui/Fonts'
import { div, li, p, span } from 'framer-motion/client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Calendar from '../../../public/Tour Icons/calendar-event.svg'
import UpDownAccordionIcon from '../../../public/Tour Icons/AccordionIcon.svg'
import { AnimatePresence , motion} from 'framer-motion'
import { useTranslations } from 'next-intl'

const AccordionTour = () => {
  const [toggle ,setToggle] = useState<number | null>(null)
  const forToggle = (index : number) =>{
        return setToggle(index === toggle ? null : index)
    }
  const tittle = useTranslations("SectionTittle")
  const include = useTranslations("TourPerPage") 
  return (
    <div className='container mx-auto   px-5  py-10 md:py-20'>
           <h2 className={`text-xl lg:text-2xl  2xl:text-3xl leading-9  2xl:leading-[65px] font-bold  ${PoppinFont.className}`}>{tittle("iterinary")}</h2>
           <div className='flex flex-col md:flex-row justify-between lg:gap-10 gap-5   ' >
           <div className='flex md:w-3/5 flex-col mt-10  gap-3'>
               {
                   TourAccordionArray.map((items, i) =>{
                    return(
                        <div className=' rounded-lg  w-full flex flex-col text-white text-lg font-medium justify-between   sm:text-xl '>
                            <div onClick={()=> forToggle(i)} className='bg-mainSkyBlue  space-x-3 w-full flex  text-white text-lg lg:text-lg font-medium  justify-between  items-start px-4 py-3 sm:py-5 lg:py-6'>
                               <Image alt='test'  className='w-4 sm:w-4 sm:h-4  mt-1.5 h-4' src={Calendar}/>
                               <p className=''>
                                Day {items.day}: 
                               <span className='ml-2'>{items.tittle}</span>
                               </p>
                               <Image alt='test' className='w-4   mt-2' src={UpDownAccordionIcon}/>
                            </div>

                               <AnimatePresence>
                                  { toggle === i && (
                                    <motion.div
                                    initial= {{height : 0, overflow: 'hidden'}}
                                    animate={{height: 'auto'}}
                                    exit={{height: 0}}
                                    transition={{duration: 0.3}}
                                       className='text-[#666666]  bg-[#F8F8F8] '
                                    >
                                        <div className='py-5 '>
                                        {
                                            items.li.map((el : any) => (
                                                <div className='flex w-full items-start px-5 py-2.5  gap-3'>
                                                    <div className='w-[10px] min-w-[10px] mt-1 h-[10px] bg-[#C6B182] rounded-full'></div>
                                                    <p className='text-sm lg:text-lg'>{el.lii}</p>
                                                </div>
                                            ))
                                        }
                                        </div>
                                    </motion.div>
                                  ) }
                               </AnimatePresence>
                        </div>
                    )
                   })
               }
           </div>
           <div className='border-[#DFDFDF] md:w-2/5  flex flex-col py-5 mt-10 h-fit  rounded-2xl border'>
               <h3 className={`${PoppinFont.className} text-lg font-semibold px-5`}>{include('dates')}</h3>
               <div className={`flex flex-col px-3 mt-4 ${QuicksandFont.className} lg:text-lg`}>
                    {
                        DatesAvailable.map((items, i) => {
                            const forColor = (colors: string) => {
                                if(colors.startsWith('A')) {
                                    return 'text-green-500'
                                }else if(colors.startsWith('L')){
                                    return 'text-yellow-500'
                                }else if(colors.startsWith('F')){
                                    return 'text-red-500'
                                }
                            }
                            return(
                                <div className={`grid  grid-cols-2 gap-x-5 px-5 py-3 text-sm sm:text-sm  border-[#DFDFDF] ${i !== DatesAvailable.length - 1 ? 'border-b-[1px]' : ''}`}>
                                   <p className=''>{items.start} - {items.end}</p>
                                   <span className={`${forColor(items.status)} text-end font-normal`}>{items.status}</span>
                                </div>
                            )
                        })
                    }
               </div>
           </div>
           </div>

    </div>
  )
}

export default AccordionTour