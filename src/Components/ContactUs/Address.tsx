import React from "react";
import IconsAddress1 from "../../../public/IconsContact/icon (1).png";
import IconsAddress2 from "../../../public/IconsContact/icon (2).png";
import IconsAddress3 from "../../../public/IconsContact/icon.png";
import Image from "next/image";
import { QuicksandFont } from "@/Ui/Fonts";
import { useTranslations } from "next-intl";
const forContact = [
  {
    img: IconsAddress1,
    tittle: "Our Address",
    location: "Ashgabat, Turkmenistan",
  },
  {
    img: IconsAddress2,
    tittle: "Email Us",
    location: "sayoda.travel@gmail.com",
  },
  {
    img: IconsAddress3,
    tittle: "Call Us",
    phone: "+993-xx-xx-xx-xx",
  },
];
const AddressForm = () => {
  const t = useTranslations("ContactUs")
  const raw  = t.raw('cardtittle')

  return (
    <div className={`w-full container mx-auto px-5 py-10  h-auto ${QuicksandFont.className}`}>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2  md:grid-cols-2 xl:grid-cols-4 gap-y-4  gap-x-4">
          {forContact.map((items , i) => {
            return (
              <div
                className={`
                  shadow-[0px,10px,10px,0px,#00000040]
                  shadow-md
                bg-white 
                 flex
                 rounded-3xl items-center
                 justify-center py-10  xl:py-16  gap-2 flex-col 
               ${items.phone ? "md:col-span-1" : ""} 
               ${items.tittle === "Our Address" ? "md:col-span-2" : ""}
               lgm:col-span-1  `}
              >
                <Image alt="icon" className="w-12 lg:w-16 " src={items.img} />
                <p className="text-xl brownText"> {raw[i]}  </p>
                <p className={`text-[#4D779D]   whitespace-nowrap`}>
                  {items.location || items.phone}
                </p>
              </div>
            );
          })}
        </div>
    </div>
  );
};
export default AddressForm;