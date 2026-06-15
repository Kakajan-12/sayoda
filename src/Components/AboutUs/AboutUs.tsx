import img1 from "../../../public/AboutImgs/1.jpg";
import img2 from "../../../public/AboutImgs/2.jpg";
import img3 from "../../../public/AboutImgs/3.jpg";
import img4 from "../../../public/AboutImgs/4.jpg";
import ImageWithSkeleton from "@/Ui/ImageWithSkeleton";
import aboutImg from "../../../public/AboutImgs/about.webp";
import { useTranslations } from "next-intl";
import { ComfortaFont } from "@/Ui/Fonts";
const arrayContactImg = [
  { id: 1, imgs: img4 },
  { id: 2, imgs: img1 },
  { id: 3, imgs: img3 },
  { id: 4, imgs: img2 },
];
const AboutUs = () => {
  const t = useTranslations("About");
  return (
    <div className="w-full relative">
      {/* Герой: высоту задаёт текст, фон растягивается по ней */}
      <div className="relative">
        <div className="absolute inset-0 z-0">
          <ImageWithSkeleton
            alt="left"
            fill
            sizes="100vw"
            className="object-cover"
            src={aboutImg}
          />
        </div>
        <div className="container mx-auto relative z-20 text-white px-5 pt-10 sm:pt-20 lg:pt-32 pb-16 sm:pb-24 md:pb-32 lg:pb-40 text-center">
          <h2
            className={`text-2xl sm:text-3xl relative xl:text-4xl flex justify-center 2xl:text-5xl font-bold ${ComfortaFont.className}`}
          >
            <span className="z-20 relative"> {t("title")}</span>
          </h2>
          <p
            className={`font-quicksand text-sm sm:text-lg sm:px-10 lg:mt-10 lg:px-28 sm:leading-8 lg:leading-9 2xl:leading-[47px] font-normal lg:text-2xl xl:text-2xl 2xl:text-3xl leading-relaxed mt-5 `}
          >
            {t("text")}
          </p>
        </div>
      </div>
      <div className="relative z-20 -mt-20 sm:-mt-24 lg:-mt-28 xl:-mt-40 hidden md:block">
        <div className="container mx-auto gap-3 px-5 flex flex-wrap justify-center py-16">
          {arrayContactImg.map((items, i) => (
            <div
              key={items.id}
              className={`relative w-[100px] sm:w-32 md:w-40 lg:w-52 xl:w-72 flex items-end bas:items-center aspect-square hover:scale-105 transition-all duration-300`}
            >
              <ImageWithSkeleton
                alt="imgs "
                className={` ${i == 0 ? " object-contain" : "object-center"} w-full h-full aspect-square object-cover rounded-xl`}
                src={items.imgs}
                skeletonClassName="rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
