import React from 'react'
import Camel from '../../../public/Tour Icons/Camel.svg'
import Icon0 from '../../../public/Tour Icons/map.svg'
import Icon1 from '../../../public/Tour Icons/Снимок_экрана_2025-03-28_232013-removebg-preview 1.svg'
import Icon2 from '../../../public/Tour Icons/Снимок_экрана_2025-03-28_232320-removebg-preview 1.svg'
import Icon3 from '../../../public/Tour Icons/Снимок_экрана_2025-03-28_232508-removebg-preview 1.svg'
import {PoppinFont, QuicksandFont} from '@/Ui/Fonts'
import Image from 'next/image'
import {InfoP} from '@/Ui/tourInfo/InfoP'
import {InfoLi} from '@/Ui/tourInfo/InfoLi'
import {useTranslations} from 'next-intl'
import {FaRegMap} from 'react-icons/fa6'
import {RxLapTimer} from 'react-icons/rx'
import {LiaLanguageSolid} from 'react-icons/lia'
import {GiAirplaneDeparture, GiPlanetConquest} from 'react-icons/gi'

const liArray = [
    {
        id: 1,
        icons: Icon0,
        tittle: "destinations",
        name: 'Tashkent, Samarkand, Bukhara, Khiva (Uzbekistan) & Ashgabat, Merv, Darvaza Gas Crater (Turkmenistan)'
    },
    {id: 2, icons: Icon1, tittle: "duration", name: "10 days / 9 nights"},
    {id: 3, icons: Icon2, tittle: "languages", name: "English, Russian"},
    {id: 4, icons: Icon3, tittle: "tour", name: "Small group (6-12 people)"}
]
const icons = [
    <FaRegMap className="w-5 h-5"/>,
    <RxLapTimer className="w-5 h-5"/>,
    <LiaLanguageSolid className="w-5 h-5"/>,
    <GiAirplaneDeparture className="w-5 h-5"/>
]
const SilkRoad = () => {
    const t = useTranslations("TourPerPage")
    return (
        <div className='container mx-auto px-5 py-10 md:py-14'>
            <div
                className="w-full flex md:flex-row flex-col md:space-x-5 lg:space-x-10 space-y-10 md:space-y-0 md:justify-between ">

                <div className="flex md:w-3/5 flex-col gap-6 ">
                    <h2 className={`text-2xl lg:text-2xl  2xl:text-5xl leading-9  2xl:leading-[65px] font-bold  ${PoppinFont.className}`}>Silk
                        Road Adventure: Discover Uzbekistan & Turkmenistan</h2>
                    {/* ///////HIDDDEN PART!!!!!!! */}
                    <p className={`${QuicksandFont.className} hidden md:block font-normal text-xs leading-5 lg:leading-6 lg:text-sm xl:text-lg 2xl:text-xl`}>Embark
                        on an unforgettable journey through Uzbekistan and Turkmenistan, the heart of the ancient Silk
                        Road. Explore legendary cities, walk through vast deserts, and uncover the rich history of
                        Central Asia. This tour is perfect for travelers who love history, architecture, and unique
                        cultural experiences.</p>
                    <div className=" flex-col gap-y-3 hidden md:flex xl:gap-y-5">
                        <p className={`${PoppinFont.className} font-bold text-lg lg:text-xl xl:text-xl 2xl:text-3xl`}>{t("offer")}</p>
                        <table>
                            <tbody className={`${QuicksandFont.className}`}>
                            {
                                liArray.map((items, i) => {
                                    return (
                                        <tr key={items.id}>
                                            <td className='lg:px-2 lg:py-1 sm:px-1 sm:py-[2px]'>
                                                {icons[i]}
                                            </td>
                                            <td className='lg:px-2 lg:py-1  sm:px-1 sm:py-[2px]'>
                                                <p className='xl:text-xl md:text-sm lg:text-sm  font-medium'>{t(`${items.tittle}`)}:</p>
                                            </td>
                                            <td className='lg:px-2 lg:py-1 sm:px-1 sm:py-[2px]'>
                                                <p className={` ml-2 text-xs lg:text-sm xl:text-lg grid font-normal 2xl:text-xl`}> {items.name} </p>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                    {/* ///////HIDDDEN PART!!!!!!! */}
                </div>
                <div
                    className={`relative flex justify-end  w-full h-[450px] sm:h-[500px] md:h-[500px]  md:w-2/5   text-white ${QuicksandFont.className}`}>
                    <Image alt="test" className=" w-3/4    h-full  rounded-2xl object-cover " src={Camel}/>
                    <div className="absolute center custom flex flex-col justify-center gap-2 ">
                        <p className='bg-mainBlueGray bg-opacity-90  py-5 px-10   rounded-xl xl:text-2xl text-2xl sm:text-3xl flex justify-center items-center '>{t("from")}: <span
                            className='xl:text-4xl  ml-2.5'>$2,300</span></p>
                        <div
                            className='bg-mainBlueGray bg-opacity-90 w-full  flex justify-start flex-col  2xl:px-5 sm:px-4 px-3 py-7   sm:py-8 lg:py-10  rounded-xl'>
                            <InfoP label={`${t("available")}`} value='April-October'/>
                            <InfoP label={`${t("group")}`} value='6-12 travels'/>
                            <p className='font-semibold xl:text-xl md:text-sm mt-5'>{t("notes")}</p>
                            <InfoLi label='Visa required for Turkmenistan'/>
                            <InfoLi label='Moderate physical activity'/>
                        </div>
                    </div>
                </div>
                {/*//////// SHOW THE HIDDEN PART IN MOBILE /////////////////////// */}
                <div className="flex md:w-3/5 flex-col gap-6 md:hidden">
                    <p className={`${QuicksandFont.className}  font-normal text-sm leading-5 lg:leading-6 lg:text-sm xl:text-lg 2xl:text-xl`}>Embark
                        on an unforgettable journey through Uzbekistan and Turkmenistan, the heart of the ancient Silk
                        Road. Explore legendary cities, walk through vast deserts, and uncover the rich history of
                        Central Asia. This tour is perfect for travelers who love history, architecture, and unique
                        cultural experiences.</p>
                    <div className=" flex-col gap-y-3  md:flex xl:gap-y-5">
                        <p className={`${PoppinFont.className} font-bold text-lg lg:text-xl xl:text-2xl 2xl:text-3xl`}>{t("offer")}</p>
                        <table>
                            <tbody className={`${QuicksandFont.className}`}>
                            {
                                liArray.map((items, i) => {
                                    return (
                                        <>
                                            <tr>
                                                <td className='lg:px-2 lg:py-1 flex py-2  gap-x-2 items-center sm:px-1 sm:py-[2px]'>
                                                    <Image width={2} height={2}
                                                           className={`  ${i === 0 ? 'w-4 h-4 ml-2' : 'w-7 h-7'}`}
                                                           alt="test" src={items.icons}/>
                                                    <p className='xl:text-xl md:text-sm lg:text-lg  font-medium'>{items.tittle}:</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='lg:px-2 lg:py-1  sm:px-1 sm:py-[2px]'>
                                                    <p className={` ml-2 text-sm lg:text-sm xl:text-lg grid font-normal 2xl:text-xl`}> {items.name} </p>
                                                </td>
                                            </tr>
                                        </>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                {/*//////// SHOW THE HIDDEN PART IN MOBILE  //////////////////////////////////  */}

            </div>
        </div>
    )
}

export default SilkRoad