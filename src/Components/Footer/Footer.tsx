"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "../../../public/IMG_20250217_105552631_275 1.png";
import Link from "next/link";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";
import { useTranslations, useLocale } from "next-intl";
import { SlArrowRight } from "react-icons/sl";
import {
  FaXTwitter,
  FaTelegram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa6";
import { GrInstagram } from "react-icons/gr";
import { FiFacebook } from "react-icons/fi";
import { BASE_API_URL } from "@/i18n/api";

const usefulThings = [
  { id: 1, name: "About Us", href: "/about" },
  { id: 2, name: "Tours", href: "/tours" },
  { id: 3, name: "Blogs", href: "/blog" },
  { id: 4, name: "Contacts", href: "/contacts" },
];

interface ContactAddress {
  address_tk: string;
  address_en: string;
  address_ru: string;
}

interface ContactMail {
  mail: string;
}

interface ContactNumber {
  number: string;
}

interface Messenger {
  id: number;
  icon: string;
  url: string;
}

const Footer = () => {
  const t = useTranslations("Footer");
  const useful = t.raw("useful");
  const locale = useLocale();

  const [address, setAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [messengers, setMessengers] = useState<Messenger[]>([]);
  const [locations, setLocations] = useState<
    {
      id: number;
      location_tk: string;
      location_en: string;
      location_ru: string;
    }[]
  >([]);
  const [visa, setVisa] = useState<
    { id: number; title_tk: string; title_en: string; title_ru: string }[]
  >([]);

  const stripHtml = (html: string) => {
    const withoutTags = html.replace(/<[^>]+>/g, "");
    const div = document.createElement("div");
    div.innerHTML = withoutTags;
    return (div.textContent || div.innerText || "").trim();
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const resAddr = await fetch(`${BASE_API_URL}/api/contact-address`);
        const addrData: ContactAddress[] = await resAddr.json();
        if (addrData.length > 0) {
          const item = addrData[0];
          const localizedAddress =
            locale === "ru"
              ? item.address_ru
              : locale === "tk"
                ? item.address_tk
                : item.address_en;
          setAddress(stripHtml(localizedAddress));
        }

        const resMail = await fetch(`${BASE_API_URL}/api/contact-mails`);
        const mailData: ContactMail[] = await resMail.json();
        if (mailData.length > 0) setEmail(mailData[0].mail);

        const resPhone = await fetch(`${BASE_API_URL}/api/contact-numbers`);
        const phoneData: ContactNumber[] = await resPhone.json();
        if (phoneData.length > 0) setPhone(phoneData[0].number);

        const resMess = await fetch(`${BASE_API_URL}/api/links`);
        const messData: Messenger[] = await resMess.json();
        if (Array.isArray(messData)) {
          setMessengers(messData);
        }
      } catch (err) {
        console.error("Ошибка при загрузке контактов:", err);
      }
    };
    fetchContacts();
  }, [locale]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/tour-location`);
        const data = await res.json();
        if (Array.isArray(data)) setLocations(data);
      } catch (err) {
        console.error("Ошибка при загрузке локаций:", err);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchVisa = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/visa`);
        const data = await res.json();
        if (Array.isArray(data)) setVisa(data);
      } catch (err) {
        console.error("Ошибка при загрузке:", err);
      }
    };
    fetchVisa();
  }, []);

  const renderMessengerIcons = () =>
    messengers.length > 0 &&
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
        >
          <Icon style={{ width: "25px", height: "25px" }} />
        </a>
      );
    });

  return (
    <div
      className={`w-full py-10 lg:py-16 bg-mainBlue ${PoppinFont.className} text-white`}
    >
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 items-start gap-3 sm:gap-10 lg:gap-16">
          <div className="flex flex-col gap-3">
            <Image className="w-48 h-20" alt="logo" src={Logo} />
            <h5 className="font-semibold font-poppins ">
              {t("location")}:{" "}
              <span className={`font-normal ${QuicksandFont.className}`}>
                {address}
              </span>
            </h5>
            <h5 className="font-semibold font-poppins">
              {t("phone")}:{" "}
              <a
                href={`tel:${phone}`}
                className="hover:text-mainLight hover:translate-x-1 transition-all duration-300"
              >
                <span className={`font-normal ${QuicksandFont.className}`}>
                  {phone}
                </span>{" "}
              </a>
            </h5>
            <h5 className="font-semibold font-poppins">
              {t("email")}:{" "}
              <a
                href={`mailto:${email}`}
                className="hover:text-mainLight hover:translate-x-1 transition-all duration-300 ${QuicksandFont.className}"
              >
                <span className={`font-normal ${QuicksandFont.className}`}>
                  {email}
                </span>
              </a>
            </h5>
            <div className="flex gap-3 mt-4">{renderMessengerIcons()}</div>
          </div>
          <div className="footerForCenters">
            <h5 className="forH5">{t("usefulTitle")}</h5>
            {usefulThings.map((items, i) => (
              <Link
                className={`footerLink hover:text-[#BF8B30] hover:translate-x-1 transition-all duration-300 ${QuicksandFont.className}`}
                href={items.href}
                key={items.id}
              >
                <SlArrowRight className="w-3 h-3 text-[#BF8B30]" />
                {useful[i]}
              </Link>
            ))}
          </div>

          <div className="footerForCenters">
            <h5 className="forH5">{t("destinationsTitle")}</h5>
            {locations.map((loc) => (
              <Link
                className={`footerLink hover:text-[#BF8B30] hover:translate-x-1 transition-all duration-300 ${QuicksandFont.className}`}
                href={`/tours?location=${loc.id}`}
                key={loc.id}
              >
                <SlArrowRight className="w-3 h-3 text-[#BF8B30]" />
                {locale === "ru"
                  ? loc.location_ru
                  : locale === "tk"
                    ? loc.location_tk
                    : loc.location_en}
              </Link>
            ))}
          </div>
          <div className="footerForCenters">
            <h5 className="forH5">{t("ourTitle")}</h5>
            {visa.map((visa, i) => (
              <Link
                className={`footerLink hover:text-[#BF8B30] hover:translate-x-1 transition-all duration-300 ${QuicksandFont.className}`}
                href={`/destinations/turkmenistan/visa/${visa.id}`}
                key={visa.id}
              >
                <SlArrowRight className="w-3 h-3 text-[#BF8B30]" />
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      locale === "ru"
                        ? visa.title_ru
                        : locale === "tk"
                          ? visa.title_tk
                          : visa.title_en,
                  }}
                />
              </Link>
            ))}
            <Link
              className={`footerLink hover:text-[#BF8B30] hover:translate-x-1 transition-all duration-300 ${QuicksandFont.className}`}
              href="/hotels"
            >
              <SlArrowRight className="w-3 h-3 text-[#BF8B30]" />
              {t("hotelsLink")}
            </Link>
          </div>
        </div>
        <div className="flex items-center w-full justify-end mt-10">
          <p className="mr-2">Powered by</p>
          <Image
            src="/logo.svg"
            alt="Hebent tech"
            width={30}
            height={30}
            className="w-5 h-auto"
          />
          <Link
            href="https://hebent.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm md:text-base text-white pt-[1px]"
          >
            Hebent Tech
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
