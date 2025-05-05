"use client";

import { motion } from "framer-motion";
import langicon from "../../../../public/language.png";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { navbar } from "./Header";
import { routing } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const HeaderDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const [forLang, setForLang] = useState(false);

  const t = useTranslations("Header");
  const location = usePathname();
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
    <motion.div
      initial={{ y: "-100%" }}
      animate={{ y: "0" }}
      exit={{ y: "-100%" }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      key="box"
      className={` text-2xl  h-screen  md:hidden absolute  w-full  text-white  bg-mainBlue  z-0 `}
    >
      <div className="container mx-auto flex flex-col  gap-3 items-start px-5 pt-5 pb-20">
        {navbar.map((items) => {
          return (
            <Link
              onClick={onClose}
              className={`${
                items.url === activeNav ? "text-activeColor" : "text-white"
              } flex gap-3 items-center w-full rounded-3xl py-3 text-xl  px-2 duration-150 transition-all focus:bg-[#C4B284] `}
              href={items.url}
            >
              {t(items.key)}
            </Link>
          );
        })}
        <div
          className={`lgm:flex  
            text-xl
            flex gap-4 items-center w-full rounded-3xl py-3
            px-2 duration-150 transition-all focus:bg-[#C4B284] 
            lg:justify-end
            ${forLang ? "bg-[#C4B284] " : ""}
            `}
        >
          {filteredlanguages.map((items) => (
            <p
              onClick={() => {
                onClose()
                switchLanguage(items);
                setForLang(false);
              }}
              className="text-white cursor-pointer  "
            >
              {items.toUpperCase()}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
export default HeaderDrawer;
