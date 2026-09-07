"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { MdOutlineAccessTime } from "react-icons/md";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { PoppinFont } from "@/components/ui/Fonts";
import { trackEvent } from "@/lib/analytics";

/**
 * Карточка брони, которая едет рядом с программой тура.
 *
 * Кнопка заявки стояла в самом низу страницы — после программы, состава
 * цены, девяти фотографий и карты. Человек дочитывал программу, решался и
 * должен был проскроллить ещё экран, чтобы найти кнопку. При этом справа
 * от программы пустовало сорок процентов ширины: колонка была задана как
 * 3/5, а соседней просто не было.
 *
 * На узких экранах карточка встаёт в поток над программой: цена и кнопка
 * должны попадаться раньше длинного текста, а не после него.
 */
export default function TourBookingCard({
  tourId,
  tourTitle,
  price,
  days,
  whatsappHref,
}: {
  tourId: number;
  tourTitle: string;
  price: number;
  days: number | null;
  whatsappHref: string | null;
}) {
  const t = useTranslations("TourPerPage");
  const tb = useTranslations("Booking");
  const tc = useTranslations("Contact");
  const router = useRouter();
  const [isNavigating, setIsNavigating] = React.useState(false);

  const handleBooking = () => {
    setIsNavigating(true);
    trackEvent("booking_start", {
      tour_id: tourId,
      tour_name: tourTitle,
      placement: "tour_sidebar",
    });
    router.push(
      `/booking?tourId=${tourId}&tourTitle=${encodeURIComponent(tourTitle)}`,
    );
  };

  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-sand shadow-sm">
      <div className="flex items-end justify-between gap-3 border-b border-sand pb-4">
        <span className="leading-tight">
          <span className="block text-sm text-inkMuted">{t("from")}</span>
          <span
            className={`${PoppinFont.className} block text-3xl font-bold text-brick`}
          >
            {price}$
          </span>
          <span className="block text-sm text-inkMuted">{t("perPerson")}</span>
        </span>

        {days !== null && (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-tileTint px-3 py-1.5 text-sm font-semibold text-tile">
            <MdOutlineAccessTime className="h-4 w-4" aria-hidden />
            {t("days", { count: days })}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <button
          type="button"
          disabled={isNavigating}
          onClick={handleBooking}
          className="w-full rounded-xl bg-brick px-4 py-3.5 text-lg font-semibold text-white transition hover:bg-brickDark disabled:cursor-wait disabled:opacity-70"
        >
          {isNavigating ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              {tb("bookings")}
            </span>
          ) : (
            tb("bookings")
          )}
        </button>

        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent("whatsapp_click", {
                placement: "tour_sidebar",
                tour_id: tourId,
              })
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-lg font-semibold text-white transition hover:brightness-95"
          >
            <FaWhatsapp className="h-6 w-6" aria-hidden />
            {tc("askOnWhatsapp")}
          </a>
        )}
      </div>
    </div>
  );
}
