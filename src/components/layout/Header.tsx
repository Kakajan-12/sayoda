"use client";
import React, { useState, useRef, useEffect } from "react";
import { LuSearch } from "react-icons/lu";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
// Link из i18n/navigation сам подставляет префикс локали. С обычным next/link
// ссылка /tours проходила через редирект middleware, и на непрогретом
// маршруте страница открывалась не с верха, а на прежней позиции прокрутки.
import { Link } from "@/i18n/navigation";
import Logo from "../../../public/headerIcon.svg";
import { usePathname, useRouter } from "next/navigation";
import HeaderDrawer from "./HeaderDrawer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { makeFalse, makeToggle } from "@/store/drawerSlice";
import { ComfortaFont } from "@/components/ui/Fonts";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { BASE_API_URL } from "@/i18n/api";
import { RxHamburgerMenu } from "react-icons/rx";
import {
  FaChevronDown,
  FaEnvelope,
  FaPhone,
  FaXTwitter,
  FaTelegram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa6";
import { GrInstagram } from "react-icons/gr";
import { FiFacebook } from "react-icons/fi";

/** Страна для выпадающего списка. Готовится на сервере, чтобы ссылки попали в HTML. */
export interface HeaderCountry {
  slug: string;
  name: string;
}

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
    key: "blog",
    url: "/blog",
    name: "Blog",
    img: "/IconMenu/feedback_11910958.png",
  },
  {
    key: "about",
    url: "/about",
    name: "About Us",
    img: "/IconMenu/maps_9570867.png",
  },
  {
    key: "contact",
    url: "/contacts",
    name: "Contact Us",
    img: "/IconMenu/location-dot-slash_9612477.png",
  },
];

export default function Header({ countries = [] }: { countries?: HeaderCountry[] }) {
  const location = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const forVisibility = useSelector((state: RootState) => state.trufalse.value);
  const t = useTranslations("Header");
  const uselocale = useLocale();
  const currentLocale = location.split("/")[1];
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCountriesOpen, setIsCountriesOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [messengers, setMessengers] = useState<Messenger[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const countriesRef = useRef<HTMLDivElement>(null);

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

  /**
   * Прокручена ли страница.
   *
   * От этого зависит фон шапки. На первом экране под ней лежит картинка,
   * и полупрозрачность с размытием там уместна — шапка не отрезает верх
   * фотографии. Но как только начинается обычный контент, сквозь тот же
   * фон проступают картинки и строки текста, и меню читается поверх каши.
   * Поэтому при прокрутке фон становится сплошным.
   */
  useEffect(() => {
    // Порог в один пиксель: полоса контактов должна схлопнуться сразу,
    // иначе при малой прокрутке она успевала показаться обрезанной.
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll(); // страницу могли открыть уже прокрученной — по якорю или из истории
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (langRef.current && !langRef.current.contains(target)) {
        setIsLangOpen(false);
      }
      if (countriesRef.current && !countriesRef.current.contains(target)) {
        setIsCountriesOpen(false);
      }
    }
    // Escape закрывает список: без этого выйти из него с клавиатуры
    // было бы нечем.
    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setIsLangOpen(false);
      setIsCountriesOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Переход по ссылке список не закрывает сам: адрес меняется без
  // перезагрузки, и он остался бы висеть поверх новой страницы.
  useEffect(() => {
    setIsCountriesOpen(false);
    setIsLangOpen(false);
  }, [location]);

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

  // Пункт подсвечен на всех страницах страны, включая визы и отели.
  const isDestinationsActive = activeNav.startsWith("/destinations");

  /*
   * Страны выпадающим списком. В шапке их не было вовсе — попасть на
   * страницу страны можно было только из подвала или с плитки на главной.
   *
   * Кнопка, а не div с onClick, как у переключателя языка рядом: список
   * должен открываться с клавиатуры, а не только мышью.
   */
  const countriesMenu = countries.length > 0 && (
    <div className="relative" ref={countriesRef}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={isCountriesOpen}
        onClick={() => setIsCountriesOpen((prev) => !prev)}
        className={`relative flex items-center gap-1.5 lg:text-sm 2xl:text-lg text-sm font-medium text-white
          after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-0.5
          after:origin-left after:rounded-full after:bg-white
          after:transition-transform after:duration-300 after:ease-out ${
            isDestinationsActive
              ? "after:scale-x-100"
              : "after:scale-x-0 hover:after:scale-x-100"
          }`}
      >
        {t("destinations")}
        <FaChevronDown
          aria-hidden
          className={`h-3 w-3 transition-transform duration-300 ${
            isCountriesOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/*
        Список всегда есть в разметке и прячется классом, а не вырезается
        условием: иначе пяти ссылок на страницы стран не было бы в HTML
        ни одной страницы сайта — на сервере список закрыт. display:none
        убирает их и из порядка обхода клавиатурой, так что закрытый
        список в фокус не попадает.
      */}
      <div
        className={`absolute left-0 top-full z-50 mt-3 min-w-52 overflow-hidden rounded-lg bg-mainBlue py-1 shadow-lg ring-1 ring-white/15 ${
          isCountriesOpen ? "" : "hidden"
        }`}
      >
        {countries.map((country) => (
          <Link
            key={country.slug}
            href={`/destinations/${country.slug}`}
            className="block whitespace-nowrap px-4 py-2.5 text-sm text-white transition-colors hover:bg-white/10"
          >
            {country.name}
          </Link>
        ))}
      </div>
    </div>
  );

  /**
   * Пункт подсвечивается и на вложенных страницах раздела.
   *
   * Сравнение шло точным равенством, поэтому на странице тура
   * (/tours/6-day-classic-tour-of-turkmenistan) пункт «Туры» не подсвечивался
   * вовсе — человек терял понимание, в каком разделе находится. «Главная»
   * остаётся точным совпадением: иначе она была бы активна всегда.
   */
  const isActiveNav = (url: string) =>
    url === "/"
      ? activeNav === "/"
      : activeNav === url || activeNav.startsWith(`${url}/`);

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
          className="text-mainBlue hover:text-brick transition-colors"
          aria-label={iconType}
        >
          <Icon className="w-4 h-4" />
        </a>
      );
    });

  return (
    /*
      Шапка целиком прилипает к верху одним блоком.
      Раньше полоса контактов и меню прилипали по отдельности, обе к top-0:
      они наезжали друг на друга, и белая полоса просвечивала сквозь
      полупрозрачное меню. Когда полосу отпустили в поток, стало хуже —
      остановив прокрутку на полпути, можно было поймать её обрезанной
      пополам: половинки букв над меню.
    */
    <header
      className={`sticky top-0 z-40 ${ComfortaFont.className} ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      {/*
        Полоса схлопывается целиком, а не уезжает: высота и прозрачность
        меняются вместе, поэтому промежуточного состояния с обрезанным
        текстом не остаётся. Контакты при этом никуда не деваются — они
        есть в подвале и в кнопке WhatsApp.
      */}
      <div
        className={`hidden overflow-hidden bg-white transition-all duration-300 md:block ${
          scrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
        }`}
      >
        <div className="container mx-auto sm:px-2 py-2">
          <div className="flex justify-between items-center text-sm text-mainBlue/85">
            <div className="flex items-center gap-6">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 hover:text-brick transition-colors"
                >
                  <FaEnvelope className="w-4 h-4 shrink-0" />
                  <span>{email}</span>
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 hover:text-brick transition-colors"
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
      {/*
        Фон сплошной при прокрутке: над обычным контентом сквозь стекло
        проступали картинки и строки текста, и меню читалось поверх каши.
        На первом экране под шапкой лежит картинка — там стекло уместно.
      */}
      <div
        className={`transition-colors duration-300 ${
          scrolled ? "bg-mainBlue" : "bg-mainBlue/85 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto sm:pr-5 lg:pr-10">
          <div className="flex justify-between items-center relative py-2">
            {/* LOGO */}
            <Link href="/" className="">
              <Image
                className="sm:w-48 sm:h-20 w-36 h-16"
                alt="Sayoda Travel — tour operator in Turkmenistan"
                src={Logo}
                loading="eager"
                priority
              />
            </Link>

            {/* NAVBAR FOR DESKTOP */}
            <div className="hidden md:flex items-center lg:gap-x-12 gap-x-6">
              {/*
                Активный раздел помечен белой полоской под пунктом, а не
                цветом текста: кирпичный на бирюзовой шапке читался хуже
                белого и спорил с кнопками действия, за которыми этот цвет
                закреплён. Полоска рисуется псевдоэлементом и растёт из
                левого края — при наведении она так же выезжает, поэтому
                активное и наводимое состояния выглядят одним приёмом.
              */}
              {navbar.map((items) => {
                const active = isActiveNav(items.url);
                const link = (
                  <Link
                    key={items.name}
                    aria-current={active ? "page" : undefined}
                    className={`relative lg:text-sm 2xl:text-lg text-sm font-medium text-white
                      after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-0.5
                      after:origin-left after:rounded-full after:bg-white
                      after:transition-transform after:duration-300 after:ease-out ${
                        active
                          ? "after:scale-x-100"
                          : "after:scale-x-0 hover:after:scale-x-100"
                      }`}
                    href={items.url}
                  >
                    {t(items.key)}
                  </Link>
                );

                // Направления стоят сразу за «Турами»: это соседние по
                // смыслу разделы, и разносить их по краям меню незачем.
                return items.key === "tours" ? (
                  <React.Fragment key={items.name}>
                    {link}
                    {countriesMenu}
                  </React.Fragment>
                ) : (
                  link
                );
              })}

              {/*
                Поиск значком, а не полем ввода в шапке: поле заняло бы
                место, которого в этом меню нет, и на планшете начало бы
                выдавливать пункты. Значок ведёт на страницу поиска, где
                поле во всю ширину.
              */}
              <Link
                href="/search"
                aria-label={t("search")}
                className="hidden md:flex items-center text-white transition-opacity hover:opacity-80"
              >
                <LuSearch className="h-5 w-5" />
              </Link>

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
                        className="px-4 py-2 hover:bg-brick cursor-pointer transition-colors duration-200"
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
                <RxHamburgerMenu className="w-6 h-6 text-white" />
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
            countries={countries}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
