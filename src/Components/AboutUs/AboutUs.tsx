import React from "react";
import img1 from "../../../public/AboutImgs/1.jpg";
import img2 from "../../../public/AboutImgs/2.jpg";
import img3 from "../../../public/AboutImgs/3.jpg";
import img4 from "../../../public/AboutImgs/4.jpg";
import Image from "next/image";
import aboutImg from "../../../public/AboutImgs/about.webp";
import { useTranslations } from "next-intl";
import { ComfortaFont } from "@/Ui/Fonts";
const arrayContactImg = [
  { id: 1, imgs: img4 },
  { id: 2, imgs: img1 },
  { id: 3, imgs: img3 },
  { id: 4, imgs: img2 },
];
const AboutUs = () => {
  const t = useTranslations("About");
  return (
    <div className="w-full  relative ">
      <div className="w-full h-full  absolute  top-0">
        <div className="relative w-full h-full flex mx-auto justify-between z-0">
          <div className="relative w-full h-full">
            <Image
              alt="left"
              className="w-full h-full object-cover"
              src={aboutImg}
            />
            {/* <div className="absolute inset-0 bg-gradient-to-b from-mainBlue/80 via-black/30 to-black/50 pointer-events-none" /> */}
          </div>
        </div>
      </div>
      <div className="h-auto pt-10 sm:pt-20 lg:pt-32 sm:pb-32 md:pb-44 lg:pb-48 2xl:pb-56 pb-28">
        <div className="container mx-auto relative z-20 text-white px-5 py-10 text-center">
          <h2
            className={`text-2xl sm:text-3xl relative xl:text-4xl flex justify-center 2xl:text-5xl font-bold ${ComfortaFont.className}`}
          >
            <span className="z-20 relative"> {t("title")}</span>
          </h2>
          <p
            className={`font-quicksand text-sm sm:text-lg sm:px-10 lg:mt-10 lg:px-28 sm:leading-8 lg:leading-9 2xl:leading-[47px] font-normal lg:text-2xl xl:text-2xl 2xl:text-3xl leading-relaxed mt-5 `}
          >
            {t("text")}
          </p>
          {/* <div className="absolute inset-0 z-[1] rounded-3xl bg-gradient-to-t from-black/50 via-black/30 to-transparent pointer-events-none" /> */}
        </div>
        <div className=" w-full absolute z-20 -bottom-40 min-[363px]:-bottom-12  bas:top-72 sm:top-auto sm:-bottom-16 xl:-bottom-56">
          <div className="container mx-auto gap-3 px-5 hidden md:flex flex-wrap justify-center  ">
            {arrayContactImg.map((items, i) => (
              <div
                key={items.id}
                className={`w-[100px] sm:w-32 md:w-40 lg:w-52 xl:w-72 2xl:w-96 flex items-end bas:items-center aspect-square hover:scale-105 transition-all duration-300`}
              >
                <Image
                  alt="imgs "
                  className={` ${i == 0 ? " object-contain" : "object-center"} aspect-square object-cover rounded-xl`}
                  src={items.imgs}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
