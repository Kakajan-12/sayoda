'use client'
import { MontserratFont, PoppinFont, QuicksandFont } from "@/Ui/Fonts";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CallendaIcon from '../../../public/PopularCardIcons/calendar4-week.svg'
import DollarIcon from '../../../public/PopularCardIcons/dollar-sign.svg'
import GroupIcon from '../../../public/PopularCardIcons/person-square.svg'
import { WindowWidth } from "@/Hooks/WindowWidth";
import Link from "next/link";
interface Popular {
  children: {
    tittle: string;
    description: string;
    price: number;
    day: number;
    group: string;
    img: string;
  }[];
}
const PopularCardProps: React.FC<Popular> = ({ children }) => {
    const width = WindowWidth()
        const getLimitByBreakpoint = () => {
          if (width < 500 ) return 85;  
            if (width < 768) return 29;    
            if (width < 1024) return 100;  
            if (width < 1300) return 85;  
            if (width < 1530) return 100;  
            return 200;                   
          };
        const forDescription = (text: string) => {
           const limit = getLimitByBreakpoint();
           return text.length > limit ? text.slice(0, limit) + "..." : text;
       }
       const forTittle = (text: string , limit : number) => {
        return text.length > limit ? text.slice(0, limit) + "..." : text;
      }
  return (
    <div className="grid grid-cols-1 min-[500px]:grid-cols-2  md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4">
      {children.map((items, i) => {
        return (
         <Link href={`/tours/${i}`}>
            <div className="flex flex-col     border-[#E6E6E6] ">
            <Image alt="test  " className="w-full  rounded-t-xl object-cover min-h-[200px] h-[200px] xl:min-h-[220px] 2xl:min-h-  " src={items.img} />
            <div className="w-full h-full p-5 border-x-2 border-b-2 rounded-b-xl flex flex-col justify-between  border-[#E6E6E6]">
            <p className={`${PoppinFont.className} font-bold text-sm xl:text-sm`}>{forTittle(items.tittle, 40)} </p>
            <p className={`${QuicksandFont.className} py-3 font-medium text-xs xl:text-xs`}>{forDescription(items.description )}</p>
            <div className="w-full h-[2px] bg-slate-200"></div>
            <div className="flex flex-col pt-3  gap-2 border-[#E6E6E6]"> 
              <p className="flex items-center gap-x-2 text-xs xl:text-sm"> 
                <Image alt="test" className="w-3 md:w-4" src={DollarIcon}/>
              <span className={`${MontserratFont.className} text-xs xl:text-sm font-bold`}>Price:  {items.price}$ /</span>person
              </p>
              <p className="flex items-center gap-x-2 text-xs xl:text-sm"> 
                <Image alt="test" className="w-3 md:w-3.5 2xl:w-4" src={CallendaIcon}/>
              <span className={`${MontserratFont.className} text-xs  xl:text-sm font-bold`}>Day:</span> {items.day} days
              </p>
              <p className="flex items-center gap-x-2 text-xs xl:text-sm"> 
                <Image alt="test" className="w-3 md:w-3.5 2xl:w-4" src={GroupIcon}/>
              <span className={`${MontserratFont.className} text-xs xl:text-sm font-bold`}>Group:</span> {items.group} 
              </p>
            </div>
            </div>
          </div>
         </Link>
        );
      })}
    </div>
  );
};

export default PopularCardProps;
