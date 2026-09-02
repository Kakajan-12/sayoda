"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

/**
 * Пара CTA внизу страницы тура: заявка через форму и вопрос в WhatsApp.
 *
 * Форма бронирования требует девять полей и капчу, поэтому рядом с ней нужен
 * короткий путь — сообщение в мессенджер с уже подставленным названием тура.
 * Оба клика уходят в аналитику: без них воронку не посчитать.
 */
export default function TourCta({
  tourId,
  tourTitle,
  whatsappHref,
}: {
  tourId: number;
  tourTitle: string;
  whatsappHref: string | null;
}) {
  const t = useTranslations("Booking");
  const tc = useTranslations("Contact");
  const router = useRouter();
  const [isNavigating, setIsNavigating] = React.useState(false);

  const handleBooking = () => {
    setIsNavigating(true);
    trackEvent("booking_start", { tour_id: tourId, tour_name: tourTitle });
    router.push(
      `/booking?tourId=${tourId}&tourTitle=${encodeURIComponent(tourTitle)}`,
    );
  };

  return (
    <div className="container mx-auto px-4 w-full flex flex-col sm:flex-row justify-center items-stretch gap-3">
      <button
        type="button"
        disabled={isNavigating}
        onClick={handleBooking}
        className="text-md md:text-xl text-white bg-mainNormBlue w-full sm:w-56 py-4 rounded-xl disabled:opacity-70 disabled:cursor-wait"
      >
        {isNavigating ? (
          <span className="inline-flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t("bookings")}
          </span>
        ) : (
          t("bookings")
        )}
      </button>

      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent("whatsapp_click", {
              placement: "tour_page",
              tour_id: tourId,
            })
          }
          className="text-md md:text-xl text-white bg-[#25D366] w-full sm:w-56 py-4 rounded-xl flex items-center justify-center gap-2"
        >
          <FaWhatsapp className="h-6 w-6" />
          {tc("askOnWhatsapp")}
        </a>
      )}
    </div>
  );
}
