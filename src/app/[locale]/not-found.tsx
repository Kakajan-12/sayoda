"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PoppinFont, ComfortaFont } from "@/Ui/Fonts";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="w-full min-h-[60vh] bg-mainForBackground flex items-center justify-center px-5 py-20">
      <div className="container mx-auto flex flex-col items-center text-center">
        <span
          className={`${PoppinFont.className} text-mainBlue font-extrabold leading-none text-7xl md:text-9xl`}
        >
          404
        </span>
        <h1
          className={`${ComfortaFont.className} mt-6 font-bold text-2xl md:text-3xl xl:text-4xl text-mainBlue`}
        >
          {t("title")}
        </h1>
        <p
          className={`${PoppinFont.className} mt-4 max-w-xl text-base md:text-lg text-mainBlueGray`}
        >
          {t("description")}
        </p>
        <Link
          href="/"
          className={`${PoppinFont.className} mt-10 inline-block bg-mainBlue text-white text-sm md:text-base font-bold rounded-full px-8 py-3 transition-opacity hover:opacity-90`}
        >
          {t("home")}
        </Link>
      </div>
    </div>
  );
}
