"use client";
import React from "react";
import Image from "next/image";
import Logo from "../../../public/IMG_20250217_105552631_275 1.png";
import Icon1 from "../../../public/Icons/Vector (29).png";
import Icon2 from "../../../public/Icons/Vector (30).png";
import Icon3 from "../../../public/Icons/instagram (4).png";
import Link from "next/link";
import Arrowicon from "../../../public/Icons/Vector (28).png";
import {usePathname} from "next/navigation";
import {PoppinFont, QuicksandFont} from "@/Ui/Fonts";
import {useTranslations} from "next-intl";
import {i} from "framer-motion/client";
import {FaXTwitter} from "react-icons/fa6";
import {TbBrandFacebook} from "react-icons/tb";
import {GrInstagram} from "react-icons/gr";
import {FiFacebook} from "react-icons/fi";

const usefulThings = [
    {id: 1, name: "About Us", href: "/aboutUs"},
    {id: 2, name: "Services", href: "/services"},
    {id: 3, name: "Testimonails", href: "/testimonials"},
    {id: 4, name: "Blogs", href: "/blogs"},
    {id: 5, name: "Terms of booking", href: "/terms"},
    {id: 6, name: "Privacy policy", href: "/privacy"},
];
const Destianations = [
    {id: 1, name: "Turkmenistan", href: "/turkmenistan"},
    {id: 2, name: "Uzbekistan", href: "/uzbekistan"},
    {id: 3, name: "Tajikistan", href: "/tajikistan"},
    {id: 4, name: "Kyrgyzystan", href: "/kyrgyzystan"},
    {id: 5, name: "Kazakhstan", href: "/kazakhstan"},
    {id: 6, name: "Pakistan", href: "/pakistan"},
];
const OurSerivces = [
    {id: 1, name: "Turkmen Visa", href: "/tukmenVisa"},
    {id: 2, name: "Hotels", href: "/hotels"},
];
const PracticalInformaions = [
    {id: 1, name: "How to get to Turmenistan", href: "/getTurkmenistan"},
    {id: 2, name: "When to go", href: "/whentogo"},
    {id: 3, name: "What currency to bring", href: "/currencytobring  "},
];
const iconsFooter = [
    <FaXTwitter className="w-7 h-10"/>,
    <FiFacebook className="w-20 h-20"/>,
    <GrInstagram className="w-7 h-10"/>
];
const Footer = () => {
    const t = useTranslations("Footer");
    const useful = t.raw("useful");
    const destinations = t.raw("destinations");
    const our = t.raw("our");
    const practical = t.raw("practical");
    return (
        <div
            className={`w-full py-20  bg-mainBlue  ${PoppinFont.className} text-white`}
        >
            <div
                className="   container mx-auto px-5 md:px-2 grid sm:grid-cols-2  xl:grid-cols-4 lg:grid-cols-3   md:grid-cols-2 ">
                <div className=" flex flex-col gap-3">
                    <Image className="w-48 h-20" alt="logo" src={Logo}/>
                    <h5>{t("location")}</h5>
                    <h5>{t("phone")}: 993-**-**-**-**</h5>
                    <h5>{t("email")}: sayoda@gmail.com</h5>
                    <div className="flex  gap-2  mt-4 ">
                        {iconsFooter.map((items) => {
                            return (
                                <div
                                    className="bg-mainLight text-mainBlue w-10 h-10 flex items-center justify-center rounded-full p-2.5">
                                    {items}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="footerForCenters">
                    <h5 className="forH5 ">{t("usefulTitle")}</h5>
                    {usefulThings.map((items, i) => {
                        return (
                            <Link
                                className={`footerLink  ${QuicksandFont.className}`}
                                href={items.href}
                                key={items.id}
                            >
                                <Image alt="icn " className="w-1.5 h-3" src={Arrowicon}/>
                                {useful[i]}
                            </Link>
                        );
                    })}
                </div>
                <div className="footerForCenters">
                    <h5 className="forH5 ">{t("destinationsTitle")}</h5>
                    {Destianations.map((items, i) => {
                        return (
                            <Link
                                className={`footerLink  ${QuicksandFont.className}`}
                                href={items.href}
                                key={items.id}
                            >
                                <Image alt="icn " className="w-1.5 h-3" src={Arrowicon}/>
                                {destinations[i]}
                            </Link>
                        );
                    })}
                </div>
                <div className=" flex flex-col gap-2.5 py-6 ">
                    <div className=" flex flex-col gap-1 ">
                        <h5 className="forH5 ">{t("ourTitle")}</h5>
                        {OurSerivces.map((items, i) => {
                            return (
                                <Link
                                    className={`footerLink  ${QuicksandFont.className}`}
                                    href={items.href}
                                    key={items.id}
                                >
                                    <Image alt="icn " className="w-1.5 h-3" src={Arrowicon}/>
                                    {our[i]}
                                </Link>
                            );
                        })}
                    </div>
                    <div className=" flex flex-col gap-1  pt-10 sm:pt-2">
                        <h5 className="forH5 ">{t("practicalTitle")}</h5>
                        {PracticalInformaions.map((items, i) => {
                            return (
                                <Link
                                    className={`footerLink  ${QuicksandFont.className}`}
                                    href={items.href}
                                    key={items.id}
                                >
                                    <Image alt="icn " className="w-1.5 h-3" src={Arrowicon}/>
                                    {practical[i]}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
