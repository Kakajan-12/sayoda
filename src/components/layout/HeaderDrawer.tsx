"use client";

import { motion } from "framer-motion";
import { Fragment, useState } from "react";
// См. комментарий в Header.tsx: префикс локали проставляется сразу,
// без промежуточного редиректа.
import { Link } from "@/i18n/navigation";
import { LuSearch } from "react-icons/lu";
import { navbar, type HeaderCountry } from "./Header";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  countries?: HeaderCountry[];
}

const HeaderDrawer: React.FC<Props> = ({ onClose, countries = [] }) => {
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

  /*
   * Страны списком, а не выпадающим списком: в меню на весь экран прятать
   * пять пунктов за ещё одно нажатие незачем — места хватает.
   */
  const countriesBlock = countries.length > 0 && (
      <div className="w-full">
        <p className="px-2 pt-4 pb-1 text-sm uppercase tracking-wide text-white/60">
          {t("destinations")}
        </p>
        {countries.map((country) => (
            <Link
                key={country.slug}
                onClick={onClose}
                href={`/destinations/${country.slug}`}
                className={`${
                    activeNav.startsWith(`/destinations/${country.slug}`)
                        ? "text-activeColor"
                        : "text-white"
                } flex w-full items-center gap-3 rounded-3xl px-2 py-2.5 text-lg transition-all duration-150 focus:bg-sand`}
            >
              {country.name}
            </Link>
        ))}
      </div>
  );

  return (
      <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: "0" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          key="drawer"
          className="text-2xl h-screen md:hidden fixed top-0 left-0 w-full text-white bg-mainBlue z-50"
      >
        <button
            onClick={onClose}
            className="absolute top-6 right-12 text-white text-3xl"
        >
          ✕
        </button>

        <div className="container mx-auto flex flex-col gap-3 items-start px-5 pt-16 pb-20">
          {navbar.map((items) => {
            const link = (
                <Link
                    key={items.url}
                    onClick={onClose}
                    className={`${
                        items.url === activeNav ? "text-activeColor" : "text-white"
                    } flex gap-3 items-center w-full rounded-3xl py-3 text-xl px-2 duration-150 transition-all focus:bg-sand`}
                    href={items.url}
                >
                  {t(items.key)}
                </Link>
            );

            // Направления идут сразу за «Турами» — тот же порядок, что
            // и в шапке на большом экране.
            return items.key === "tours" ? (
                <Fragment key={items.url}>
                  {link}
                  {countriesBlock}
                </Fragment>
            ) : (
                link
            );
          })}
          {/*
              Поиск в мобильном меню.

              В шапке на большом экране он стоит значком, но значок скрыт
              классом hidden md:flex — на телефоне до поиска по сайту не
              было хода вовсе. Здесь он обычным пунктом со значком: в
              списке из семи строк лупа без подписи читалась бы хуже слова.
          */}
          <Link
              onClick={onClose}
              href="/search"
              className={`${
                  activeNav === "/search" ? "text-activeColor" : "text-white"
              } flex gap-3 items-center w-full rounded-3xl py-3 text-xl px-2 duration-150 transition-all focus:bg-sand`}
          >
            <LuSearch className="h-5 w-5" />
            {t("search")}
          </Link>

          <div
              className={`flex text-xl gap-4 items-center w-full rounded-3xl py-3 px-2 ${
                  forLang ? "bg-sand" : ""
              }`}
          >
            {filteredlanguages.map((items) => (
                <p
                    key={items}
                    onClick={() => {
                      onClose();
                      switchLanguage(items);
                      setForLang(false);
                    }}
                    className="text-white cursor-pointer"
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
