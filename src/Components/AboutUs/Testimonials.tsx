import Image from "next/image";
import React from "react";
import user from "../../../public/user.svg"
import Rating from "@mui/material/Rating";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";
import { useTranslations } from "next-intl";

const Testimonials = () => {
  const section = useTranslations("SectionTittle")
  return (
    <div className="container mx-auto px-5 pt-10 pb-20">
         <h2 className={`text-2xl lg:text-2xl  2xl:text-3xl leading-9  2xl:leading-[65px] font-bold  ${PoppinFont.className}`}>{section('testimonial')}</h2>
    <div
      className={`w-full mt-10 bg-[#EAF1F7] rounded-xl flex py-10 pr-3 lgm:pr-10 flex-col shadow-[#00000040] shadow-lg ${PoppinFont.className}`}
    >
      <div className="w-full flex  justify-between items-center gap-2">
        <div className="bg-mainBlue flex justify-center items-center xl:gap-5 gap-3  xl:pr-28 pr-12 pl-5 xl:pl-5 lg:py-3 py-2 rounded-e-full">
          <div className="lg:p-3 p-3  bg-white rounded-full">
            <Image alt="user" className="md:w-10 lg:w-12 w-7" src={user} />
          </div>
          <div className=" flex flex-col gap-1">
            <p className={`text-white xl:text-2xl text-xl ${PoppinFont.className} font-bold`}>LEYLI A.</p>
            <p className={`text-xs  xl:text-sm text-white ${PoppinFont.className}`}>Darvaza Gaz Cratar</p>
            <Rating   name="size-small" defaultValue={2} size="small" />
          </div>
        </div>
        {/* <div> */}
        {/* </div> */}
      </div>
      {/* ///////=--------------TEXT____---------- */}
      <div className=" px-7 md:px-20 py-5 md:py-10">
        <p className={`xl:text-lg text-sm xl:leading-10 leading-6 ${QuicksandFont.className}`}>
          Firstly, I would like to say I am very happy with the services and
          tour which beedn provided by Advontour <br />
          One point; Kytgistan was for me after all too short , I would suggest
          an evening flight or a second night at the hotel <br />
          As well, I was with the breakfast in Sofia Int. (Bishek) not so happy.
          They shall provide more fresh food/bread <br />
          All guides and driver were reliable, helpfulm knowledge adn very king!{" "}
          <br />
          Big Plus with the hotels: <br />
          -Mercure Almaty: excellent breafast!
        </p>
      </div>
  
    </div>
    </div>

  );
};

export default Testimonials
