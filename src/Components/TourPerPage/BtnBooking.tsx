'use client';
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

    const handleClick = () => {
        const decodedTitle = decodeHtml(tourTitle);
        router.push(`/booking?tourId=${tourId}&tourTitle=${encodeURIComponent(decodedTitle)}`);
    };

    return (
        <div className="container mx-auto px-5 w-full pb-24 flex justify-center">
            <button
                onClick={handleClick}
                className="text-sm md:text-xl xl:text-2xl text-white bg-mainNormBlue py-7 px-32 rounded-xl">
                {t("bookings")}
            </button>
        </div>
    );
};

export default BtnBooking;
