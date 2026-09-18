import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";
import React from "react";
import mainImg from "../../../public/DiscoverImg/cover.webp";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import { useTranslations } from "next-intl";

/**
 * Обложка блога.
 *
 * Собрана по образцу обложки каталога туров (DiscoverMain): та же высота,
 * тот же кадр, то же затемнение, тот же центрированный текст. Раньше блог
 * выбивался: обложка была на 85vh против 72vh у туров — почти во весь
 * экран, так что до первой статьи приходилось прокручивать вслепую.
 *
 * Затемнения не было вовсе, и белый заголовок держался на одной тени.
 * На светлых участках кадра он размывался.
 *
 * z-10 у обёртки — чтобы панель фильтров, приподнятая отрицательным
 * отступом, легла поверх обложки, а не под неё.
 */
const BlogsMain = () => {
  const t = useTranslations("Unveiling");
  return (
    <div className="relative z-10">
      <div className="relative">
        <ImageWithSkeleton
          alt="Central Asia landscape on a Sayoda Travel journey"
          className="h-[44vh] w-full object-cover object-center md:h-[64vh] lg:h-[72vh]"
          width={1800}
          height={1500}
          src={mainImg}
          priority
        />

        {/*
         * Затемнение накрывает весь кадр, а не только низ: заголовок стоит
         * по центру, и градиент снизу вверх оставлял бы там слишком мало
         * чёрного. Значения те же, что у туров и у главной, чтобы страницы
         * не расходились между собой.
         */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/50 via-black/35 to-black/45" />

        <div className="absolute top-0 h-full w-full">
          <div className="container mx-auto flex h-full w-full flex-col items-center justify-center gap-8 px-5 pb-10 text-center sm:px-10 md:w-3/4 lg:w-3/5">
            <h1
              className={`${PoppinFont.className} px-2 text-xl font-semibold leading-8 tracking-wider text-white sm:text-2xl lg:text-2xl lg:leading-10 xl:text-3xl xl:leading-[60px]`}
            >
              {t("title")}
            </h1>
            <p
              className={`${QuicksandFont.className} text-sm font-extralight text-white lg:text-lg xl:text-xl`}
            >
              {t("text")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsMain;
