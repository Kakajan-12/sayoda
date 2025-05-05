"use client";
import React, { useEffect, useState } from "react";
import BlogBaack from "../../../public/BlogsImg/image 15.svg";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";
import Image from "next/image";
import { WindowWidth } from "@/Hooks/WindowWidth";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
const testArray = {
  img: BlogBaack,
  tittle: "Kyrgyzstan Horseback Adventure",
  desc:
    "Our adventure began in Bishkek, the capital of Kyrgyzstan. After a quick city tour, filled with the hustle and bustle of Osh Bazaar and the grandeur of Ala-Too Square, we set off towards Chon-Kemin Valley.",
  date: "12.04.2023",
};
const TestArray = new Array(10).fill(testArray);
const BlogsCardsProps = () => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const width = WindowWidth();
  const t = useTranslations("SectionTittle");
  const getLimitByBreakpoint = () => {
    if (width < 500) return 140;
    if (width < 640) return 70;
    if (width < 768) return 65;
    if (width < 1024) return 90;
    return 100;
  };
  const forDescription = (text: string) => {
    const limit = getLimitByBreakpoint();
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };
  const forTittle = (text: string, limit: number) => {
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };
  return (
    <div
      className={`container mx-auto py-10 md:py-20 px-5 ${QuicksandFont.className}`}
    >
      <h2
        className={`text-xl md:text-2xl lg:text-2xl  2xl:text-3xl leading-9  2xl:leading-[65px] font-bold  ${PoppinFont.className}`}
      >
        {t("blogs")}
      </h2>
      <div className="grid grid-cols-1 bas:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 py-10 md:py-20 sm:gap-7">
        {TestArray.map((items, i) => (
          <motion.div
            onHoverStart={width > 768 ? () => setHoverIndex(i) : undefined}
            onHoverEnd={width > 768 ? () => setHoverIndex(null) : undefined}
            onViewportEnter={width < 768 ? () => setHoverIndex(i) : undefined}
            onViewportLeave={
              width < 768 ? () => setHoverIndex(null) : undefined
            }
            viewport={{ once: false, margin: "-50% 0px -50% 0px" }}
            className="w-full relative overflow-hidden rounded-3xl transition-all duration-300 h-[400px] bas:h-[350px] md:h-[400px] lg:h-[450px]  xl:h-[430px]  2xl:h-[500px]"
          >
            <Image
              alt="img "
              className="w-full  rounded-3xl h-full z-0 object-cover  absolute top-0 "
              src={items.img}
            />
            <div className="z-10 relative text-white px-7 py-7 h-full flex flex-col items-center  justify-end sm:p-7 ">
              <motion.div
                initial={{ bottom: 0 }}
                animate={{
                  bottom: hoverIndex === i ? 80 :0 ,
                }}
                transition={{ duration: 0.4 }}
                className={`  flex flex-col relative z-20   justify-end space-y-5 bas:space-y-4 h-full w-full`}
              >
                <h3 className="text-xl md:text-2xl font-bold 2xl:text-3xl xl:text-2xl">
                  {forTittle(items.tittle, 30)}
                </h3>
                <p className="text-sm md:text-sm">
                  {forDescription(items.desc)}{" "}
                </p>
                <p className="text-sm md:text-md self-center md:pb-5 md:self-start">
                  {items.date}
                </p>
              </motion.div>
              <motion.div
                initial={{ height: "0%", opacity: 0 }}
                animate={{
                  height: "100%",
                  opacity: hoverIndex === i ? 0.4 : 0,
                }}
                exit={{ y: "100%", opacity: hoverIndex === i ? 0.4 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-0 bg-black pointer-events-none rounded-xl"
              />

              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{
                  y: hoverIndex === i ? 0 : 100,
                  opacity: hoverIndex === i ? 1 : 0,
                }}
                transition={{ duration: 0.4 }}
                className="absolute    "
              >
                <Link href={`/blog/${i}`}>
                  <button className="bg-white  text-xs rounded-full w-36 font-bold self-center py-2 lg:py-3 lg:text-sm text-black">
                    Learn More
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BlogsCardsProps;
