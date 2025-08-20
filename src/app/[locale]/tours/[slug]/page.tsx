import React from "react";
import SilkRoad from "@/Components/TourPerPage/SilkRoad";
import AccordionTour from "@/Components/TourPerPage/AccordionTour";
import IncludesExcludes from "@/Components/TourPerPage/IncludesExcludes";
import Gallery from "@/Components/TourPerPage/Gallery";
import Map from "@/Components/TourPerPage/Map";
import BtnBooking from "@/Components/TourPerPage/BtnBooking";
import { BASE_API_URL } from "@/i18n/api";

async function getTourData(slug: string) {
    const res = await fetch(`${BASE_API_URL}/api/tours/${slug}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Не удалось загрузить данные");
    return res.json();
}

export default async function Page({ params }: any) {
    const { slug, locale } = params;

    const tour = await getTourData(slug);

    const tourTitle =
        locale === "ru"
            ? tour.title_ru
            : locale === "en"
                ? tour.title_en
                : tour.title_tk;

    return (
        <div>
            <SilkRoad data={tour} />
            <AccordionTour tourId={tour.id} />
            <IncludesExcludes tourId={tour.id} />
            <Gallery tourId={tour.id} />
            <Map data={tour} />
            <BtnBooking tourId={tour.id} tourTitle={tourTitle} />
        </div>
    );
}
