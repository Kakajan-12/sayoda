import Image from "next/image";
import React from "react";
import left from "../../public/IconMenu/backIconBlue.png";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
export const ButtonLeftSwiper = () => {
  return (
    <button className="minus hidden md:flex absolute left-0 top-1/2 mt-5 -translate-y-1/2  items-center z-20 justify-center shadow-[0px_4px_4px_0px_#00000040] w-6 h-6 lg:w-10 lg:h-10 rounded-full bg-[#FBE7BC]">
      <MdOutlineKeyboardArrowLeft className="w-7 h-7 text-mainBlue" />
    </button>
  );
};

export const ButtonRigthSwiper = () => {
  return (
    <button className="plus hidden md:flex absolute right-0 top-1/2 mt-5 -translate-y-1/2  items-center z-20 justify-center shadow-[0px_4px_4px_0px_#00000040] w-6 h-6 lg:w-10 lg:h-10 rounded-full bg-[#FBE7BC]">
      <MdOutlineKeyboardArrowRight className="w-7 h-7 text-mainBlue" />
    </button>
  );
};
