"use client";
import { QuicksandFont } from "@/Ui/Fonts";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import BackIcon from "../../../public/DiscoverImg/Icons/Vector (1).svg";
import FIlterIcon from "../../../public/DiscoverImg/Icons/Vector.svg";
import { AnimatePresence, motion } from "framer-motion";
const MobileFilter = () => {
  const [drawerFilter, setDrawerFilter] = useState(false);
  const targetRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!drawerFilter) return;
  
    const handler = (event: MouseEvent) => {
      if (!targetRef.current) return;
  
      if (targetRef.current.contains(event.target as Node)) return;
  
      setDrawerFilter(false);
    };
  
    const timeout = setTimeout(() => {
      window.addEventListener("click", handler);
    }, 0);
  
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("click", handler);
    };
  }, [drawerFilter]);
  return (
    <div className=" relative  md:hidden ">
      <div className="w-full container mx-auto  flex justify-between px-5 bg-white relative z-20  py-7">
        <Image
          alt="icons"
          className="  w-2.5"
          src={BackIcon}
        />
        <Image
          onClick={(e) => {
            setDrawerFilter(!drawerFilter);
          }}
          alt="icons"
          src={FIlterIcon}
        />
      </div>
   
      <AnimatePresence initial={false}>
        {drawerFilter && (
          <motion.div
          ref={targetRef}
            initial={{ y: "-130%" }}
            animate={{ y: 0 }}
            exit={{ y: "-130%" }}
            transition={{ duration: 0.3 }}
            className="absolute w-full  z-0   bg-white"
          >
            <div  className="px-5 container flex flex-col items-center mx-auto   w-full  pt-5 pb-20  space-y-5">
              <button
                className={`bg-[#748B95] rounded-2xl text-white self-end text-lg xl:text-xl md:text-xs lg:text-md lg:py-3.5  xl:py-2 w-full py-2 ${QuicksandFont.className}`}
              >
                Search
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileFilter;
