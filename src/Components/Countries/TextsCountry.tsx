import { QuicksandFont } from "@/Ui/Fonts";
import React from "react";

const TextsCountry = () => {
  return (
    <div className={`w-full container py-10 md:py-20 mx-auto px-5 ${QuicksandFont.className}`}>
      <p className="md:text-2xl text-xl">
        Our adventure began in Bishkek, the capital of Kyrgyzstan. After a quick
        city tour, filled with the hustle and bustle of Osh Bazaar and the
        grandeur of Ala-Too Square, we set off towards Chon-Kemin Valley, where
        our horseback journey would begin.
      </p>

      <h2 className="pt-5 md:text-2xl text-xl font-semibold">
        Day : 2 Into the Wild
        <p className="pt-3 md:text-2xl text-xl font-normal">
          Our adventure began in Bishkek, the capital of Kyrgyzstan. After a
          quick city tour, filled with the hustle and bustle of Osh Bazaar and
          the grandeur of Ala-Too Square, we set off towards Chon-Kemin Valley,
          where our horseback journey would begin.
        </p>
      </h2>
    </div>
  );
};

export default TextsCountry;
