"use client";
import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import BurgerMenu from "../../../public/burgerMenu.png";
import Logo from "../../../public/headerIcon.svg";
import { usePathname, useRouter } from "next/navigation";
import HeaderDrawer from "./HeaderDrawer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";
import { makeFalse, makeToggle } from "@/app/Redux/FalseTrueForHtml";
import { ComfortaFont } from "@/Ui/Fonts";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { BASE_API_URL } from "@/i18n/api";
import {
  FaEnvelope,
  FaPhone,
  FaXTwitter,
  FaTelegram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa6";
import { GrInstagram } from "react-icons/gr";
import { FiFacebook } from "react-icons/fi";

interface Messenger {
  id: number;
  icon: string;
  url: string;
}

export const navbar = [
  { key: "main", url: "/", name: "Main", img: "/IconMenu/home_10024936.png" },
  {
    key: "tours",
    url: "/tours",
    name: "Tours",
    img: "/IconMenu/maps_9570867.png",
  },
  {
    key: "about",
    url: "/about",
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
    url: "/contacts",
    name: "Contact Us",
    img: "/IconMenu/location-dot-slash_9612477.png",
  },
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
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [messengers, setMessengers] = useState<Messenger[]>([]);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const [mailRes, phoneRes, linksRes] = await Promise.all([
          fetch(`${BASE_API_URL}/api/contact-mails`),
          fetch(`${BASE_API_URL}/api/contact-numbers`),
          fetch(`${BASE_API_URL}/api/links`),
        ]);

        const mailData = await mailRes.json();
        const phoneData = await phoneRes.json();
        const linksData = await linksRes.json();

        if (Array.isArray(mailData) && mailData.length > 0) {
          setEmail(mailData[0].mail);
        }
        if (Array.isArray(phoneData) && phoneData.length > 0) {
          setPhone(phoneData[0].number);
        }
        if (Array.isArray(linksData)) {
          setMessengers(linksData);
        }
      } catch (err) {
        console.error("Failed to load header contacts:", err);
      }
    };

    fetchContacts();
  }, []);

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
      `/${newLocale === "tm" ? "tk" : newLocale}`,
    );
    router.push(newPath);
  };

  const filteredLanguages = routing.locales
    .filter((lang) => lang !== uselocale)
    .map((lang) => (lang === "tk" ? "tm" : lang));

  const activeNav = location.replace(`/${uselocale}`, "") || "/";

  const renderMessengerIcons = () =>
    messengers.map((item) => {
      const iconType = item.icon?.toLowerCase();
      let Icon: React.ElementType | null = null;

      switch (iconType) {
        case "telegram":
          Icon = FaTelegram;
          break;
        case "linkedin":
          Icon = FaLinkedin;
          break;
        case "instagram":
          Icon = GrInstagram;
          break;
        case "whatsapp":
          Icon = FaWhatsapp;
          break;
        case "facebook":
          Icon = FiFacebook;
          break;
        case "twitter":
          Icon = FaXTwitter;
          break;
        default:
          return null;
      }

      return (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-mainBlue hover:text-[#BF8B30] transition-colors"
          aria-label={iconType}
        >
          <Icon className="w-4 h-4" />
        </a>
      );
    });

  return (
    <header className={`contents ${ComfortaFont.className}`}>
      <div className="hidden md:block bg-white sticky top-0 z-30">
        <div className="container mx-auto sm:px-2 py-2">
          <div className="flex justify-between items-center text-sm text-mainBlue/85">
            <div className="flex items-center gap-6">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 hover:text-[#BF8B30] transition-colors"
                >
                  <FaEnvelope className="w-4 h-4 shrink-0" />
                  <span>{email}</span>
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 hover:text-[#BF8B30] transition-colors"
                >
                  <FaPhone className="w-4 h-4 shrink-0" />
                  <span>{phone}</span>
                </a>
              )}
            </div>
            <div className="flex items-center gap-4">
              {renderMessengerIcons()}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-mainBlue/85 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto sm:pr-5 lg:pr-10">
          <div className="flex justify-between items-center relative py-2">
            {/* LOGO */}
            <Link href="/" className="">
              <Image
                className="sm:w-48 sm:h-20 w-36 h-16"
                alt="logo"
                src={Logo}
              />
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
                <p>
                  {currentLocale.includes("tk")
                    ? "TM"
                    : currentLocale.toUpperCase()}
                </p>
                {isLangOpen && (
                  <div
                    className="absolute top-full mt-2 bg-mainBlue rounded shadow-lg z-50"
                    style={{ left: "-16px" }}
                  >
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
                <Image
                  alt="burger menu"
                  className="sm:w-8 w-6"
                  src={BurgerMenu}
                />
              </button>
            </div>
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
