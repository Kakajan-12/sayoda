import React from "react";
import SilkRoad from "@/Components/TourPerPage/SilkRoad";
import AccordionTour from "@/Components/TourPerPage/AccordionTour";
import IncludesExcludes from "@/Components/TourPerPage/IncludesExcludes";
import Gallery from "@/Components/TourPerPage/Gallery";
import Map from "@/Components/TourPerPage/Map";
import BtnBooking from "@/Components/TourPerPage/BtnBooking";

const page = () => {
  return (
    <div>
      <SilkRoad />
      <AccordionTour />
      <IncludesExcludes />
      <Gallery />
      <Map />
      <BtnBooking/>
    </div>
  );
};

export default page;
