// app/contact/page.tsx
"use client";

import { useState, useEffect } from "react";
import { QuicksandFont, PoppinFont } from "@/Ui/Fonts";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

// Типы
type Location = {
  id: number;
  location_tk: string;
  location_en: string;
  location_ru: string;
};

type ContactAddress = {
  address_id: number;
  address_tk: string;
  address_en: string;
  address_ru: string;
  location_id: number;
  iframe: string;
  location_id_real: number;
};

type ContactNumber = {
  id: number;
  number: string;
  location_id: number;
  location_id_real: number;
};

type ContactMail = {
  id: number;
  mail: string;
  location_id: number;
  location_id_real: number;
};

// Вспомогательная функция: извлечь текст из HTML
const extractText = (html: string): string => {
  if (typeof window === "undefined") return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

// Основная страница
export default function ContactPage() {
  const t = useTranslations("ContactUs");
  const m = useTranslations("SectionTitle");
  const locale = useLocale(); // Получаем текущий язык: 'en', 'ru', 'tk'

  const cardTitles = t.raw("cardtitle") as string[]; // ["Our Address", "Email Us", "Call Us"]

  // Состояние для данных и активной локации
  const [data, setData] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Иконки
  const icons = [
    "/IconsContact/icon (1).png",   // Address
    "/IconsContact/icon (2).png",   // Email
    "/IconsContact/icon.png",       // Phone
  ];

  // Загрузка данных при монтировании
  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

        const [locationsRes, addressesRes, numbersRes, mailsRes] = await Promise.all([
          fetch(`${baseUrl}/api/contact-location`).catch(() => ({ json: () => [] })),
          fetch(`${baseUrl}/api/contact-address`).catch(() => ({ json: () => [] })),
          fetch(`${baseUrl}/api/contact-numbers`).catch(() => ({ json: () => [] })),
          fetch(`${baseUrl}/api/contact-mails`).catch(() => ({ json: () => [] })),
        ]);

        const locations: Location[] = await locationsRes.json();
        const addresses: ContactAddress[] = await addressesRes.json();
        const numbers: ContactNumber[] = await numbersRes.json();
        const mails: ContactMail[] = await mailsRes.json();

        // Группируем данные по location_id_real
        const grouped = locations.map(loc => {
          const address = addresses.find(a => a.location_id_real === loc.id);
          const number = numbers.find(n => n.location_id_real === loc.id);
          const mail = mails.find(m => m.location_id_real === loc.id);

          return {
            location: loc,
            address,
            number,
            mail,
            iframe: address?.iframe || "",
          };
        });

        setData(grouped);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load contact data", error);
        setData([]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading contacts...</p>
        </div>
    );
  }

  if (data.length === 0) {
    return (
        <div className="container mx-auto px-5 py-10 text-center">
          <h2 className="text-2xl text-red-600">No contact data available</h2>
        </div>
    );
  }

  const active = data[activeIndex];

  // Функция выбора текста по языку
  const getText = (obj: { [key: string]: string }, field: string): string => {
    const key = `${field}_${locale}` as keyof typeof obj;
    return obj[key] || obj[`${field}_en`]; // fallback на английский
  };

  // Данные для карточек — с учётом языка
  const contactItems = [
    {
      img: icons[0],
      title: cardTitles[0],
      detail: active.address ? extractText(getText(active.address, "address")) : "",
    },
    {
      img: icons[1],
      title: cardTitles[1],
      detail: active.mail?.mail || "",
    },
    {
      img: icons[2],
      title: cardTitles[2],
      detail: active.number?.number || "",
    },
  ].filter(item => item.detail);

  return (
      <div className={`w-full container mx-auto px-5 py-10 h-auto ${QuicksandFont.className}`}>
        {/* Заголовок: Название локации на текущем языке */}
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {extractText(getText(active.location, "location"))}
        </h1>

        {/* Кнопки выбора локации — с языковой поддержкой */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {data.map((item, index) => {
            const locName = extractText(getText(item.location, "location"));
            return (
                <button
                    key={item.location.id}
                    onClick={() => setActiveIndex(index)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md
                ${activeIndex === index
                        ? "bg-[#4D779D] text-white"
                        : "bg-white text-[#4D779D] hover:bg-gray-100"
                    }
              `}
                >
                  {locName}
                </button>
            );
          })}
        </div>

        {/* Карточки контактов */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {contactItems.map((item, i) => (
              <div
                  key={i}
                  className="bg-white shadow-md shadow-black/25 rounded-3xl p-8 flex flex-col items-center text-center gap-3"
              >
                <Image
                    src={item.img}
                    alt="icon"
                    width={64}
                    height={64}
                    className="w-12 lg:w-16"
                />
                <p className="text-xl font-medium text-gray-800">{item.title}</p>
                <p className="text-[#4D779D]">{item.detail}</p>
              </div>
          ))}
        </div>

        <div className="px-5">
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-6 ${PoppinFont.className}`}>
            {m("map")}
          </h2>
          <div
              className="w-full rounded-xl overflow-hidden shadow-lg"
              style={{ minHeight: "500px", maxHeight: "650px" }}
          >
            {active.iframe ? (
                <div
                    dangerouslySetInnerHTML={{ __html: active.iframe }}
                    style={{ width: "100%", height: "100%", minHeight: "500px" }}
                />
            ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100">
                  <p className="text-gray-500">Map not available</p>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}