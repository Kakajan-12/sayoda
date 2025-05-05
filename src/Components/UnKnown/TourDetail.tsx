import { FormDate } from "@/Interfaces/Interfaces";
import { useTranslations } from "next-intl";
import React from "react";
interface Props {
  onchange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  formDates: FormDate;
}
const TourDetail: React.FC<Props> = ({ onchange, formDates }) => {
  const  t  = useTranslations('Booking')
  return (
    <div className="w-full  grid grid-cols-1 md:grid-cols-6   gap-4 lg:gap-x-10 xl:gap-x-16">
      <h3 className="text-[#BF8B30] lg:mb-5 col-span-full  text-xl md:text-xl  lg:text-2xl">
        {t("tour")}
      </h3>
      <div className="InputBorders  text-sm lg:text-sm flex items-center col-span-full md:col-span-4 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
        aiwdiawbwd
      </div>
      <div className=" col-span-full md:col-span-2 gap-5 w-full  flex ">
        <input
          name="numberTravels"
          value={formDates.numberTravels}
          onChange={onchange}
          placeholder={t("Itravelers")}
          type="number"
          className="InputBorders w-full  text-sm lg:text-sm  border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        <input
          name="data"
          value={formDates.data}
          onChange={onchange}
          type="date"
          className="InputBorders md:w-28    lg:w-36 text-sm lg:text-sm  border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
      </div>
      <textarea
          name="comment"
          value={formDates.comment}
          onChange={onchange}
          placeholder={t("Icomment")}
          className="InputBorders text-sm lg:text-sm w-full col-span-full resize-none h-32 lg:h-52"
      ></textarea>
    </div>
  );
};

export default TourDetail;
