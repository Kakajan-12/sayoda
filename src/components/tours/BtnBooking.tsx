"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface BtnBookingProps {
  tourId: number;
  tourTitle: string; // HTML string from API
}

// Функция для декодирования HTML в plain text
const decodeHtml = (html: string) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const BtnBooking: React.FC<BtnBookingProps> = ({ tourId, tourTitle }) => {
  const t = useTranslations("Booking");
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = () => {
    setIsNavigating(true);
    const decodedTitle = decodeHtml(tourTitle);
    router.push(
      `/booking?tourId=${tourId}&tourTitle=${encodeURIComponent(decodedTitle)}`,
    );
  };

  return (
    <div className="container mx-auto px-4 w-full flex justify-center">
      <button
        type="button"
        disabled={isNavigating}
        onClick={handleClick}
        className="text-md md:text-xl xl:text-2xl text-white bg-mainNormBlue w-full sm:w-48 py-4 rounded-xl disabled:opacity-70 disabled:cursor-wait"
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
    </div>
  );
};

export default BtnBooking;
