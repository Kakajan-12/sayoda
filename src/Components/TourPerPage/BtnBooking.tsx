import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

const BtnBooking = () => {
  const t  = useTranslations("Booking")
  return (
    <div className="container mx-auto px-5 w-full pb-24  flex justify-center">
      <Link href={`/booking/${2}`}>
        <button className="text-sm md:text-xl xl:text-2xl text-white bg-mainNormBlue  py-7 px-32 rounded-xl ">
         {t("bookings")}
        </button>
      </Link>
    </div>
  );
};

export default BtnBooking;
