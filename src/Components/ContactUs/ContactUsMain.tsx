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
        className="w-full object-cover h-[30vh] sm:h-[40vh] md:h-[60vh]  "
        width={1720}
        height={800}
        src={MainImg}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/50 to-black/20" />
      <div className="absolute w-full h-full top-16 md:top-0 ">
        <div className="container px-5 sm:px-10  flex  gap-10 sm:gap-8   text-center flex-col justify-start md:justify-center   items-center mx-auto h-full">
          <h1
            className={`${PoppinFont.className}  sm:px-2 dort:text-md text-sm sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-6xl font-bold text-center text-white leading-relaxed tracking-wide`}
          >
            {t("title")}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ContactMain;
