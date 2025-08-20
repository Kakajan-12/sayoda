"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "../../../public/IMG_20250217_105552631_275 1.png";
import Link from "next/link";
import Arrowicon from "../../../public/Icons/Vector (28).png";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";
import { useTranslations, useLocale } from "next-intl";
import { FaXTwitter, FaTelegram, FaLinkedin, FaWhatsapp } from "react-icons/fa6";
import { GrInstagram } from "react-icons/gr";
import { FiFacebook } from "react-icons/fi";
import { BASE_API_URL } from "@/i18n/api";

const usefulThings = [
    { id: 1, name: "About Us", href: "/about" },
    { id: 2, name: "Tours", href: "/tours" },
    { id: 3, name: "Blogs", href: "/blogs" },
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
    const [locations, setLocations] = useState<{id: number, location_tk: string, location_en: string, location_ru: string}[]>([]);
    const [visa, setVisa] = useState<{id: number, title_tk: string, title_en: string, title_ru: string}[]>([]);

    const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

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
            className={`w-full py-20 bg-mainBlue ${PoppinFont.className} text-white`}
        >
            <div
                className="container mx-auto px-5 md:px-2 grid sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
                <div className="flex flex-col gap-3">
                    <Image className="w-48 h-20" alt="logo" src={Logo}/>
                    <h5>{t("location")}: {address}</h5>
                    <h5>{t("phone")}: {phone}</h5>
                    <h5>{t("email")}: {email}</h5>
                    <div className="flex gap-3 mt-4">{renderMessengerIcons()}</div>
                </div>

                <div className="footerForCenters">
                    <h5 className="forH5">{t("usefulTitle")}</h5>
                    {usefulThings.map((items, i) => (
                        <Link
                            className={`footerLink ${QuicksandFont.className}`}
                            href={items.href}
                            key={items.id}
                        >
                            <Image alt="icon" className="w-1.5 h-3" src={Arrowicon}/>
                            {useful[i]}
                        </Link>
                    ))}
                </div>

                <div className="footerForCenters">
                    <h5 className="forH5">{t("destinationsTitle")}</h5>
                    {locations.map((loc, i) => (
                        <Link
                            className={`footerLink ${QuicksandFont.className}`}
                            href={`/tours?location=${loc.id}`}
                            key={loc.id}
                        >
                            <Image alt="icon" className="w-1.5 h-3" src={Arrowicon}/>
                            {locale === "ru" ? loc.location_ru : locale === "tk" ? loc.location_tk : loc.location_en}
                        </Link>
                    ))}
                </div>


                <div className="flex flex-col gap-2.5 py-6">
                    <div className="flex flex-col gap-1 pt-10 sm:pt-2">
                        <h5 className="forH5">{t("practicalTitle")}</h5>
                        {visa.map((visa, i) => (
                            <Link
                                className={`footerLink ${QuicksandFont.className}`}
                                href={`/visa/${visa.id}`}
                                key={visa.id}
                            >
                                <Image alt="icon" className="w-1.5 h-3" src={Arrowicon} />
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
