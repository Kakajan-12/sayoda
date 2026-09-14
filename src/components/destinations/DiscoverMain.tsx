import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";
import React from "react";
import mainImg from "../../../public/DiscoverImg/cover.webp";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import { useTranslations } from "next-intl";

const DiscoverMain = () => {
  const t = useTranslations("Discover");
  return (
    <div className="relative z-10">
      <div className="relative">
        <ImageWithSkeleton
          alt="Desert landscape of Turkmenistan on a Sayoda Travel tour"
          className="w-full h-[44vh] md:h-[64vh] lg:h-[72vh] object-center object-cover"
          width={1800}
          height={1500}
          src={mainImg}
        />
        {/*
         * Затемнение накрывает весь кадр, а не только низ. Прежний градиент шёл
         * снизу вверх и был самым плотным у нижнего края — ровно там, где его
         * закрывает белая панель фильтров, поднятая на -mt-16. Заголовок при
         * этом стоит по центру, где оставалось всего 40% чёрного, и на светлых
         * участках пустыни белый текст размывался. Значения те же, что у
         * баннера главной, чтобы страницы не расходились.
         */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/50 via-black/35 to-black/45" />
        <div className="absolute w-full h-full top-0">
          {/* items-center: раньше здесь стояло items-cente — класса с такой
              опечаткой не существует, и Tailwind молча его выбрасывал. */}
          <div className="container px-5 sm:px-10  pb-10 flex justify-center gap-8 text-center flex-col items-center mx-auto md:w-3/4 lg:w-3/5 w-full  h-full">
            <h1
              className={`${PoppinFont.className} px-2 text-xl sm:text-2xl lg:text-2xl xl:text-3xl  font-semibold text-white leading-8 lg:leading-10 xl:leading-[60px] tracking-wider`}
            >
              {t("title")}
            </h1>
            <p
              className={`${QuicksandFont.className} text-sm lg:text-lg xl:text-xl text-white font-extralight`}
            >
              {t("text")}{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverMain;
