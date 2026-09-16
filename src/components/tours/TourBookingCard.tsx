"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { MdOutlineAccessTime } from "react-icons/md";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { PoppinFont } from "@/components/ui/Fonts";
import { trackEvent } from "@/lib/analytics";

/**
 * Карточка брони — рядом с главной фотографией тура.
 *
 * Кнопка заявки сначала стояла в самом низу страницы, потом переехала в
 * колонку рядом с программой. Теперь она в первом экране, справа от фото:
 * цена — главный вопрос, ради которого страницу открывают, и до неё не
 * должно быть прокрутки.
 *
 * Высота — по содержимому, а не по соседней фотографии. Растянутая до её
 * высоты карточка оставляла между ценой и кнопками двести пикселей пустоты:
 * кнопка уезжала от цены так далеко, что связь между ними терялась.
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
    <div className="rounded-2xl bg-white p-5 ring-1 ring-sand shadow-xs">
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
