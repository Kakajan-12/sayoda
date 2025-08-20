import React from "react";
import MainImg from "../../../public/ExploreImg/MainExplore.png";
import LowerImg from "../../../public/ExploreImg/lowerExplore.png";
import Image from "next/image";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";
import { useTranslations } from "next-intl";
const liArray = [
    {name: 'Exclusive tours to Uzbekistan, Turkmenistan, Tajikistan, Kazakhstan, and Kyrgyzstan.'},
    {name: "Cultural and historical explorations along the legendary Silk Road."},
    {name: "Adventure trips through breathtaking mountains, deserts, and ancient cities."}
]
const Explore = () => {
  const t = useTranslations("Explore")
  const offers = t.raw("offers")
  return (
    <div className="  container mx-auto px-5  py-10 lg:py-20">
      <div className="w-full flex md:flex-row flex-col md:space-x-10 space-y-10 md:space-y-0 md:justify-between ">
        <div className="relative w-full md:w-1/2  h-full  ">
          <div className="w-3/4 md:w-[85%] lg:w-3/4 h-1/2 pb-5 lg:pb-7 rounded-2xl ">
            <Image alt="test" className="w-full h-full rounded-2xl object-cover " src={MainImg} />
          </div>
          <div className="absolute bottom-0 rounded-xl w-4/5 md:w-11/12 lg:w-4/5  opacity-50 h-5/6 bg-mainLight -z-10"></div>
          <div className="absolute right-10 md:right-0  lg:right-10 top-1/3 w-5/12 lg:w-2/5 md:w-3/6">
            <Image className="w-full  " alt="test" src={LowerImg} />
          </div>
        </div>
        <div className="flex md:w-1/2 flex-col gap-6 ">
            <h2 className={`text-2xl lg:text-3xl  2xl:text-5xl leading-9  2xl:leading-[65px] font-bold   ${PoppinFont.className}`}>"{t("title")}"</h2>
            <p className={`${QuicksandFont.className} font-normal text-sm tracking-wide  leading-6 lg:leading-6 lg:text-sm xl:text-lg 2xl:text-xl`}>{t("desc")}</p>
            <div className="flex flex-col gap-y-3 xl:gap-y-5">
                <p className={`${PoppinFont.className} font-bold text-lg lg:text-xl xl:text-2xl 2xl:text-3xl`}>{t("secTitle")}</p>
                {
                    offers.map((items : string)=> {
                        return (
                          <div key={items} className="flex items-start space-x-2">
                            <Image width={2} height={2} className="w-4 h-4 mt-2" alt="test" src='/Check.png'/>
                            <p className={`${QuicksandFont.className} text-xs xl:text-sm font-normal 2xl:text-xl `}>{items}</p>
                          </div>
                        )
                    })
                }
            </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
