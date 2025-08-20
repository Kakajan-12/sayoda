import React from "react";
import { FormDate } from "@/Interfaces/Interfaces";
import { useTranslations } from "next-intl";

interface Props {
    formDates: FormDate;
    onchange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => void;
    tourName: string;
}

const TourDetail: React.FC<Props> = ({ formDates, onchange, tourName }) => {
    const t = useTranslations("Booking");

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-6 gap-4 lg:gap-x-10 xl:gap-x-16">
            <h3 className="text-[#BF8B30] lg:mb-5 col-span-full text-xl md:text-xl lg:text-2xl">
                {t("tour")}
            </h3>

            {/* Название тура */}
            <input
                type="text"
                name="tour"
                value={tourName}
                readOnly
                className="InputBorders w-full col-span-full md:col-span-4 border p-2 rounded-lg"
            />

            {/* Количество путешественников */}
            <div className="col-span-full md:col-span-2 gap-5 w-full flex">
                <input
                    name="travelers"
                    value={formDates.travelers}
                    onChange={onchange}
                    placeholder={t("Itravelers")}
                    type="number"
                    className="InputBorders w-full text-sm lg:text-sm border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 no-spin"
                />
            </div>

            {/* Комментарий */}
            <textarea
                name="message"
                value={formDates.message}
                onChange={onchange}
                placeholder={t("Icomment")}
                className="InputBorders text-sm lg:text-sm w-full col-span-full resize-none h-32 lg:h-52"
            />
        </div>
    );
};

export default TourDetail;
