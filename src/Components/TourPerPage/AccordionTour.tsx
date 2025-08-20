'use client'

import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Calendar from '../../../public/Tour Icons/calendar-event.svg'
import UpDownAccordionIcon from '../../../public/Tour Icons/AccordionIcon.svg'
import { PoppinFont } from '@/Ui/Fonts'
import { useTranslations, useLocale } from 'next-intl'
import { BASE_API_URL } from '@/i18n/api'

interface ItineraryItem {
    id: number
    title_tk: string
    title_en: string
    title_ru: string
    text_tk: string
    text_en: string
    text_ru: string
    tour_id: number
    tour_title_en: string
    li?: { lii: string }[] // если есть подробности
}

interface AccordionTourProps {
    tourId: number
}

const AccordionTour: React.FC<AccordionTourProps> = ({ tourId }) => {
    const [toggle, setToggle] = useState<number | null>(null)
    const [itinerary, setItinerary] = useState<ItineraryItem[]>([])
    const t = useTranslations('SectionTitle')
    const locale = useLocale() // текущий язык

    const forToggle = (index: number) => setToggle(index === toggle ? null : index)

    useEffect(() => {
        fetch(`${BASE_API_URL}/api/itinerary?tourId=${tourId}`)
            .then(res => res.json())
            .then((data: ItineraryItem[]) => setItinerary(data))
            .catch(err => console.error(err))
    }, [tourId])

    // функция для получения текста в зависимости от языка
    const getLocalizedText = (item: ItineraryItem, field: 'title' | 'text') => {
        switch (locale) {
            case 'tk':
                return field === 'title' ? item.title_tk : item.text_tk
            case 'ru':
                return field === 'title' ? item.title_ru : item.text_ru
            case 'en':
            default:
                return field === 'title' ? item.title_en : item.text_en
        }
    }

    return (
        <div className='container mx-auto px-5 py-10 md:py-20'>
            <h2 className={`text-xl lg:text-2xl 2xl:text-3xl leading-9 2xl:leading-[65px] font-bold ${PoppinFont.className}`}>
                {t('itinerary')}
            </h2>

            <div className='flex flex-col md:flex-row justify-between lg:gap-10 gap-5'>
                <div className='flex md:w-3/5 flex-col mt-10 gap-3'>
                    {itinerary.map((item, i) => (
                        <div key={item.id} className='rounded-lg w-full flex flex-col font-medium justify-between sm:text-xl'>
                            <div
                                onClick={() => forToggle(i)}
                                className='bg-mainSkyBlue space-x-3 w-full flex text-white font-medium justify-between items-start px-4 py-3 sm:py-5 lg:py-6 cursor-pointer'
                            >
                                <Image alt='calendar' className='w-4 sm:w-4 sm:h-4 mt-1.5 h-4' src={Calendar} />
                                <div className="flex w-full justify-between items-center">
                                    <div className='ml-2' dangerouslySetInnerHTML={{ __html: getLocalizedText(item, 'title') }} />
                                    <Image alt='toggle' className='w-4 mt-2' src={UpDownAccordionIcon} />
                                </div>
                            </div>

                            <AnimatePresence>
                                {toggle === i && (
                                    <motion.div
                                        initial={{ height: 0, overflow: 'hidden' }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className='text-[#666666] bg-[#F8F8F8]'
                                    >
                                        <div className='py-5 px-5'>
                                            <div className='mb-3' dangerouslySetInnerHTML={{ __html: getLocalizedText(item, 'text') }} />
                                            {item.li?.map((el, idx) => (
                                                <div key={idx} className='flex w-full items-start py-2.5 gap-3'>
                                                    <div className='w-[10px] min-w-[10px] mt-1 h-[10px] bg-[#C6B182] rounded-full'></div>
                                                    <p className='text-sm lg:text-lg'>{el.lii}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AccordionTour
