import { QuicksandFont } from "@/Ui/Fonts";
import { useLocale } from "next-intl";
import React from "react";

interface TextsCountryProps {
    data: {
        text_tk?: string;
        text_en?: string;
        text_ru?: string;
        [key: string]: any;
    };
}

const TextsCountry: React.FC<TextsCountryProps> = ({ data }) => {
    const locale = useLocale();

    const text = data[`text_${locale}`] || data.text_tk || "Текст отсутствует";

    return (
        <div className={`w-full container py-10 md:py-20 mx-auto px-5 ${QuicksandFont.className}`}>
            <p className="md:text-2xl text-xl" dangerouslySetInnerHTML={{ __html: text }} />
        </div>
    );
};

export default TextsCountry;
