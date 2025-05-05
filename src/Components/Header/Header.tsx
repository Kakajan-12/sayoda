"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import BurgerMenu from "../../../public/burgerMenu.png";
import Logo from "../../../public/IMG_20250217_105552631_275 1.png";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import HeaderDrawer from "./HeaderDrawer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";
import { makeFalse, makeToggle } from "@/app/Redux/FalseTrueForHtml";
import { ComfortaFont } from "@/Ui/Fonts";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";

export const navbar = [
  {
    key: "main",
    url: "/",
    name: "Main",
    img: "/IconMenu/home_10024936.png",
  },
  {
    key: "tours",
    url: "/tours",
    name: "Tours",
    img: "/IconMenu/maps_9570867.png",
  },
  {
    key: "about",
    url: "/aboutUs",
    name: "About Us",
    img: "/IconMenu/maps_9570867.png",
  },
  {
    key: "blog",
    url: "/blog",
    name: "Blog",
    img: "/IconMenu/feedback_11910958.png",
  },
  {
    key: "contact",
    url: "/contactUs",
    name: "Contact Us",
    img: "/IconMenu/location-dot-slash_9612477.png",
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [forLang, setForLang] = useState(false);
  const location = usePathname();
  const forVisibility = useSelector((state: RootState) => state.trufalse.value);
  const makeToggless = useDispatch();
  const makeFlase = () => makeToggless(makeFalse());
  const t = useTranslations("Header");
  const uselocale = useLocale();
  const router = useRouter();
  const currentLocale = location.split("/")[1];

  const switchLanguage = (newLocale: string) => {
    const newPath = location.replace(
      `/${currentLocale}`,
      `/${newLocale === "tm" ? "tk" : newLocale}`
    );
    router.push(newPath);
  };
  const filteredlanguages = routing.locales
    .filter((lang) => lang !== uselocale)
    .map((lang) => (lang === "tk" ? "tm" : lang));
  const activeNav = location.replace(`/${uselocale}`, "") || "/";
  return (
    <header
      className={`bg-mainBlue  sticky z-40 top-0 w-full ${ComfortaFont.className}`}
    >
      <div className="w-full sticky bg-mainBlue  z-30">
        <div className="  container mx-auto  sm:px-2  ">
          <div className="flex  justify-between   relative items-center">
            <Link href="/" className="">
              <Image
                className="sm:w-48 sm:h-20 w-36 h-16"
                alt="logo"
                src={Logo}
              />
            </Link>
            <div
              className={`hidden  md:flex items-center  lg:gap-x-12 gap-x-6   `}
            >
              {navbar.map((items) => {
                return (
                  <Link
                    className={`
                    lg:text-sm 2xl:text-lg  text-sm   font-medium 
                 ${items.url === activeNav ? "text-[#BF8B30]" : "text-white"} `}
                    key={items.name}
                    href={items.url}
                  >
                    {t(items.key)}
                  </Link>
                );
              })}
              <div
                className={`hidden md:flex text-sm lg:text-lg font-normal  text-white   `}
              >
                <p
                  onClick={() => setForLang((l) => !l)}
                  className="cursor-pointer"
                >
                  {currentLocale.includes("tk")
                    ? "TM"
                    : currentLocale.toUpperCase()}
                </p>

                <AnimatePresence initial={false}>
                  {forLang && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className=" -right-1.5   absolute overflow-hidden    top-[85px]  bg-mainBlue  "
                      >
                        <div className="px-2.5 py-4 border-[1px] border-mainBlue   text-lg  gap-4 flex flex-col">
                          {filteredlanguages.map((items) => (
                            <p
                              onClick={() => {
                                switchLanguage(items);
                                setForLang(false);
                              }}
                              className="text-white cursor-pointer  "
                            >
                              {items.toUpperCase()}
                            </p>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {/* MENUUUU BURGER  ICON*/}
            <div className="flex md:hidden">
              <div className="  justify-self-end flex items-center  lgx:hidden">
                <button
                  onClick={() => makeToggless(makeToggle())}
                  className="px-4 py-2 z-0   text-white rounded"
                >
                  <Image alt="icn" className="sm:w-8 w-6" src={BurgerMenu} />
                </button>
              </div>
            </div>
            {/* MENUUUU BURGER ICON */}
          </div>
        </div>
      </div>

      {/* DRAWER FOR MOBILE  */}
      <AnimatePresence initial={false}>
        {forVisibility && (
          <>
            <HeaderDrawer isOpen={isOpen} onClose={() => makeFlase()} />
          </>
        )}
      </AnimatePresence>
      {/* DRAWER FOR MOBILE  */}
    </header>
  );
}
