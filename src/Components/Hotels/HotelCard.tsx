"use client";

import React from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";
import { BASE_API_URL } from "@/i18n/api";
import { getLocalizedHotelField, type Hotel } from "@/api/getHotels";
import {
  MdFreeBreakfast,
  MdChildCare,
  MdLocalParking,
  MdWifi,
  MdLocationOn,
  MdCheck,
  MdVerifiedUser,
  MdStar,
  MdStarBorder,
} from "react-icons/md";

interface Props {
  hotel: Hotel;
}

const getFixedImageUrl = (path: string) =>
  `${BASE_API_URL.replace(/\/+$/, "")}/${path
    .replace(/\\/g, "/")
    .replace(/^(\.\.\/)+/, "")
    .replace(/^\/+/, "")
    .replace(/^app\//, "")}`;

const HotelCard: React.FC<Props> = ({ hotel }) => {
  const locale = useLocale();
  const t = useTranslations("Hotels");

  const name = getLocalizedHotelField(hotel, locale, "name");
  const city = getLocalizedHotelField(hotel, locale, "city");
  const address = getLocalizedHotelField(hotel, locale, "address");
  const reviewLabel = getLocalizedHotelField(hotel, locale, "review_label");

  const stars = Array.from({ length: 5 }, (_, i) =>
    i < Math.round(hotel.rating) ? (
      <MdStar key={i} className="text-mainBlue" />
    ) : (
      <MdStarBorder key={i} className="text-mainBlue/40" />
    ),
  );

  const amenities = [
    { show: hotel.breakfast, icon: MdFreeBreakfast, label: t("freeBreakfast") },
    { show: hotel.kids_play_area, icon: MdChildCare, label: t("kidsPlayArea") },
    { show: hotel.parking, icon: MdLocalParking, label: t("freeParking") },
    { show: hotel.wifi, icon: MdWifi, label: t("freeWifi") },
  ].filter((a) => a.show);

  const included = [
    { show: hotel.included_breakfast, label: t("freeBreakfast") },
    { show: hotel.included_travel_tax, label: t("travelTax") },
  ].filter((i) => i.show);

  return (
    <div className="flex flex-col md:flex-row gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Image */}
      <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl md:h-auto md:w-56 lg:w-64">
        {hotel.image ? (
          <Image
            alt={name}
            src={getFixedImageUrl(hotel.image)}
            width={300}
            height={220}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full min-h-[12rem] w-full items-center justify-center bg-mainForBackground text-mainBlue/40">
            <MdLocationOn size={40} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3
            className={`${PoppinFont.className} text-xl font-bold text-mainBlue`}
          >
            {name}
          </h3>
          <span className="flex text-lg">{stars}</span>
          {hotel.reviews > 0 && (
            <span className="flex items-center gap-2">
              <span className="rounded bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
                {reviewLabel}
              </span>
              <span className="text-sm text-mainBlue">
                {hotel.reviews} {t("reviews")}
              </span>
            </span>
          )}
        </div>

        <p
          className={`${QuicksandFont.className} flex items-center gap-1 text-sm text-gray-600`}
        >
          <MdLocationOn className="shrink-0 text-mainBlue" />
          {address || city}
        </p>

        <span className="inline-flex w-fit items-center gap-1 rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white">
          <MdVerifiedUser /> {t("safeStays")}
        </span>

        {amenities.length > 0 && (
          <div className="mt-1 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-2">
            {amenities.map((a, i) => (
              <span
                key={i}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <a.icon className="text-mainBlue" /> {a.label}
              </span>
            ))}
          </div>
        )}

        <p className="mt-auto text-xs italic text-gray-500">
          * {t("freeCancellation")}
        </p>
      </div>

      {/* Included + book */}
      <div className="flex shrink-0 flex-col justify-between gap-4 border-t border-gray-200 pt-4 md:w-48 md:border-l md:border-t-0 md:pl-4 md:pt-0">
        <div>
          <p
            className={`${PoppinFont.className} mb-2 text-sm font-semibold text-mainBlue`}
          >
            {t("includedTitle")}
          </p>
          <ul className="flex flex-col gap-1">
            {included.map((inc, i) => (
              <li
                key={i}
                className="flex items-center gap-1 text-sm text-gray-700"
              >
                <MdCheck className="text-green-600" /> {inc.label}
              </li>
            ))}
          </ul>
        </div>
        <a
          href={hotel.book_url || "#"}
          target={
            hotel.book_url && hotel.book_url !== "#" ? "_blank" : undefined
          }
          rel="noopener noreferrer"
          className="rounded-md bg-mainBlue py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-mainBlue/90"
        >
          {t("bookNow")}
        </a>
      </div>
    </div>
  );
};

export default HotelCard;
