import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";
import Image from "next/image";
import React from "react";
import MainImg from "../../../public/ContactUs/bg.jpg";
import { useTranslations } from "next-intl";

const ContactMain = () => {
  const t = useTranslations("ContactUs");
  return (
    <div className="relative w-full">
      <Image
        alt="test"
        className="w-full object-cover h-[20vh] sm:h-[40vh] md:h-[60vh]  "
        width={1720}
        height={800}
        src={MainImg}
      />
      <div className="absolute text-start pt-5 sm:pt-28 md:pt-0 w-full h-full top-0  ">
        <div className="container px-2 sm:px-10  flex  gap-10 sm:gap-8   text-center   flex-col justify-start md:justify-center   items-center  mx-auto w-4/6 h-full">
          <h1
            className={`${PoppinFont.className}  sm:px-2 dort:text-md text-sm sm:text-2xl  lg:text-3xl xl:text-4xl 2xl:text-6xl  font-bold text-center text-white leading-8 lg:leading-[65px] xl:leading-[75px] 2xl:leading-[80px] tracking-wide`}
          >
            {t("title")}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ContactMain;
