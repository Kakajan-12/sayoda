import React from "react";
import { FormDate } from "@/Interfaces/Interfaces";
import { useTranslations } from "next-intl";
import countries from "world-countries";

interface Props {
    onchange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => void;
    formDates: FormDate;
}

const ContactDetail: React.FC<Props> = ({ onchange, formDates }) => {
    const t = useTranslations("Booking");

    // Формируем список стран
    const countryList = countries
        .map((c) => ({
            code: c.cca2, // ISO-код страны (например, "US")
            name: c.name.common, // Название страны (на англ.)
        }))
        .sort((a, b) => a.name.localeCompare(b.name)); // сортируем по алфавиту

    return (
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-x-10 xl:gap-x-16">
            <h3 className="col-span-full lg:mb-5 text-[#BF8B30] text-lg md:text-lg lg:text-2xl">
                {t("contact")}
            </h3>

            <select
                name="gender"
                onChange={onchange}
                value={formDates.gender}
                className="InputBorders text-sm lg:text-sm border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="MS.">Ms.</option>
            </select>

            <input
                name="firstName"
                onChange={onchange}
                value={formDates.firstName}
                className="InputBorders text-sm lg:text-sm col-span-full md:col-span-1"
                type="text"
                placeholder={t("Iname")}
            />
            <input
                name="lastName"
                onChange={onchange}
                value={formDates.lastName}
                className="InputBorders text-sm lg:text-sm col-span-full md:col-span-1"
                type="text"
                placeholder={t("Isurname")}
            />

            {/* Список стран */}
            <select
                name="location"
                onChange={onchange}
                value={formDates.location}
                className="InputBorders text-sm lg:text-sm border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">{t("Icountry")}</option>
                {countryList.map((c) => (
                    <option key={c.code} value={c.code}>
                        {c.name}
                    </option>
                ))}
            </select>

            <input
                name="email"
                onChange={onchange}
                value={formDates.email}
                className="InputBorders text-sm lg:text-sm col-span-full md:col-span-1"
                type="email"
                placeholder={t("Iemail")}
            />

            <input
                name="phone"
                onChange={onchange}
                value={formDates.phone}
                className="InputBorders text-sm lg:text-sm col-span-full md:col-span-1"
                type="tel"
                placeholder={t("Iphone")}
            />
        </div>
    );
};

export default ContactDetail;
