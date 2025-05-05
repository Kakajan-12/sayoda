"use client";
import React, { useState } from "react";
import { PoppinFont } from "../../../../Ui/Fonts";
import ConatactDetail from "@/Components/UnKnown/ConatactDetail";
import TourDetail from "@/Components/UnKnown/TourDetail";
import { useTranslations } from "next-intl";

const page = () => {
  const t = useTranslations('Booking')
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    data: "",
    numberTravels: "",
    tour: "",
    comment: "",
    gender: "",
    location: "",
  });
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-[#E8ECF0] ">
      <div className="container  mx-auto flex flex-col py-10 md:py-20 px-5">
        <h2
          className={`text-2xl lg:text-3xl  2xl:text-4xl leading-10 w-2/3 2xl:leading-[65px] text-mainBlue font-bold  ${PoppinFont.className}`}
        >
          {t("tittle")}
        </h2>
        <form
          action=""
          className="w-full flex flex-col gap-10 mt-5 pt-5  mds:px-12"
        >
          <ConatactDetail formDates={formData} onchange={handleChange} />
          <TourDetail formDates={formData} onchange={handleChange} />
          <button
            className={`bg-mainBlue py-2.5  px-10 w-full md:max-w-[200px]  self-center text-white  rounded-2xl  ${PoppinFont.className}`}
          >
            {t("send")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;
