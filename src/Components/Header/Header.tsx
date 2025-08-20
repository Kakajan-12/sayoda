"use client";
import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import BurgerMenu from "../../../public/burgerMenu.png";
import Logo from "../../../public/IMG_20250217_105552631_275 1.png";
import { usePathname, useRouter } from "next/navigation";
import HeaderDrawer from "./HeaderDrawer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";
import { makeFalse, makeToggle } from "@/app/Redux/FalseTrueForHtml";
import { ComfortaFont } from "@/Ui/Fonts";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

export const navbar = [
  { key: "main", url: "/", name: "Main", img: "/IconMenu/home_10024936.png" },
  { key: "tours", url: "/tours", name: "Tours", img: "/IconMenu/maps_9570867.png" },
  { key: "about", url: "/about", name: "About Us", img: "/IconMenu/maps_9570867.png" },
  { key: "blog", url: "/blog", name: "Blog", img: "/IconMenu/feedback_11910958.png" },
  { key: "contact", url: "/contacts", name: "Contact Us", img: "/IconMenu/location-dot-slash_9612477.png" },
];

export default function Header() {
  const location = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const forVisibility = useSelector((state: RootState) => state.trufalse.value);
  const t = useTranslations("Header");
  const uselocale = useLocale();
  const currentLocale = location.split("/")[1];
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const switchLanguage = (newLocale: string) => {
    const newPath = location.replace(
        `/${currentLocale}`,
        `/${newLocale === "tm" ? "tk" : newLocale}`
    );
    router.push(newPath);
  };

  const filteredLanguages = routing.locales
      .filter((lang) => lang !== uselocale)
      .map((lang) => (lang === "tk" ? "tm" : lang));

  const activeNav = location.replace(`/${uselocale}`, "") || "/";

  return (
      <header className={`bg-mainBlue sticky z-40 top-0 w-full ${ComfortaFont.className}`}>
        <div className="container mx-auto sm:px-2">
          <div className="flex justify-between items-center relative py-2">
            {/* LOGO */}
            <Link href="/" className="">
              <Image className="sm:w-48 sm:h-20 w-36 h-16" alt="logo" src={Logo} />
            </Link>

            {/* NAVBAR FOR DESKTOP */}
            <div className="hidden md:flex items-center lg:gap-x-12 gap-x-6">
              {navbar.map((items) => (
                  <Link
                      key={items.name}
                      className={`lg:text-sm 2xl:text-lg text-sm font-medium ${
                          items.url === activeNav ? "text-[#BF8B30]" : "text-white"
                      }`}
                      href={items.url}
                  >
                    {t(items.key)}
                  </Link>
              ))}

              {/* LANGUAGE SWITCH */}
              <div
                  className="hidden md:flex text-sm lg:text-lg font-normal text-white relative cursor-pointer select-none"
                  ref={langRef}
                  onClick={() => setIsLangOpen((prev) => !prev)}
              >
                <p>{currentLocale.includes("tk") ? "TM" : currentLocale.toUpperCase()}</p>
                {isLangOpen && (
                    <div className="absolute top-full mt-2 bg-mainBlue rounded shadow-lg z-50" style={{left: "-16px"}}>
                      {filteredLanguages.map((lang) => (
                          <p
                              key={lang}
                              onClick={() => {
                                switchLanguage(lang);
                                setIsLangOpen(false);
                              }}
                              className="px-4 py-2 hover:bg-[#BF8B30] cursor-pointer"
                          >
                            {lang.toUpperCase()}
                          </p>
                      ))}
                    </div>
                )}
              </div>
            </div>

            {/* BURGER MENU BUTTON */}
            <div className="flex md:hidden">
              <button
                  onClick={() => dispatch(makeToggle())}
                  className="px-4 py-2 z-50 relative text-white rounded"
              >
                <Image alt="burger menu" className="sm:w-8 w-6" src={BurgerMenu}/>
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        <AnimatePresence>
          {forVisibility && (
              <HeaderDrawer
                  isOpen={forVisibility}
                  onClose={() => dispatch(makeFalse())}
              />
          )}
        </AnimatePresence>
      </header>
  );
}
