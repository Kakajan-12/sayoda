import React from "react";
import { getTranslations } from "next-intl/server";
import { FaCircleCheck, FaCalendarDays, FaLocationDot, FaPassport } from "react-icons/fa6";
import { IoLanguage } from "react-icons/io5";
import { QuicksandFont } from "@/components/ui/Fonts";
import { getSettings } from "@/lib/api/settings";

/**
 * Полоса доверия сразу под первым экраном.
 *
 * Номер лицензии и год основания лежали только в подвале — то есть человек
 * видел их, уже решив уходить. Для оператора в стране, о которой турист почти
 * ничего не знает, это первое, что снимает недоверие, и место ему наверху.
 *
 * Реквизиты берутся из админки (Настройки). Незаполненное поле не выводится
 * вовсе — пустая строка «Лицензия:» выглядит хуже, чем её отсутствие.
 */
export default async function TrustStrip({ locale }: { locale: string }) {
  const [t, settings] = await Promise.all([
    getTranslations({ locale, namespace: "Trust" }),
    getSettings(),
  ]);

  const items = [
    {
      icon: <FaCircleCheck className="h-5 w-5 shrink-0" />,
      text: settings.license_number
        ? `${t("licensed")} · ${t("license")} ${settings.license_number}`
        : t("licensed"),
    },
    settings.founded_year
      ? {
          icon: <FaCalendarDays className="h-5 w-5 shrink-0" />,
          text: t("since", { year: settings.founded_year }),
        }
      : null,
    {
      icon: <FaLocationDot className="h-5 w-5 shrink-0" />,
      text: t("local"),
    },
    {
      icon: <FaPassport className="h-5 w-5 shrink-0" />,
      text: t("visa"),
    },
    {
      icon: <IoLanguage className="h-5 w-5 shrink-0" />,
      text: t("guides"),
    },
  ].filter(Boolean) as { icon: React.ReactNode; text: string }[];

  return (
    <div className="w-full border-y border-sand bg-sandLight">
      {/*
        Ряд, а не сетка с фиксированным числом колонок. Год основания —
        необязательное поле из админки, поэтому пунктов бывает четыре или
        пять. При жёсткой сетке в четыре колонки незаполненный год оставлял
        пустую ячейку, а заполненный — одинокий пункт во втором ряду.
        Здесь пункты просто переносятся и остаются по центру при любом числе.
      */}
      <div
        className={`${QuicksandFont.className} container mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-6 lg:gap-x-10`}
      >
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 text-ink">
            <span className="text-tileMid">{item.icon}</span>
            <span className="text-sm/snug font-medium">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
