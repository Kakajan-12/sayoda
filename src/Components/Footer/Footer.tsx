import React from "react";
import Image from "next/image";
import Logo from "../../../public/IMG_20250217_105552631_275 1.png";
import { getLocale, getTranslations } from "next-intl/server";
import { SlArrowRight } from "react-icons/sl";
import { Link } from "@/i18n/navigation";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";
import SocialIcons from "./SocialIcons";
import { getContacts, telHref } from "@/lib/api/contacts";
import { getTourLocations, getVisaEntries, localizedField } from "@/lib/api/catalog";
import { COMPANY } from "@/lib/site";
import { plainText } from "@/lib/utils";

/**
 * Футер — Server Component.
 *
 * Раньше адрес, телефон и почту он подгружал в useEffect, поэтому в серверном
 * HTML отдавались пустые `tel:` и `mailto:` — краулер не видел ни одного
 * способа связи. Теперь те же данные читаются на сервере, а интерактивной
 * части здесь нет: всё, кроме иконок соцсетей, — статическая разметка.
 */

const usefulLinks = ["/about", "/tours", "/blog", "/contacts"];

const linkClass = (font: string) =>
  `footerLink hover:text-[#BF8B30] hover:translate-x-1 transition-all duration-300 ${font}`;

export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("Footer");
  const useful = t.raw("useful") as string[];

  const [contacts, locations, visa] = await Promise.all([
    getContacts(locale),
    getTourLocations(),
    getVisaEntries(),
  ]);

  return (
    <div
      className={`w-full py-10 lg:py-16 bg-mainBlue ${PoppinFont.className} text-white`}
    >
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 items-start gap-3 sm:gap-10 lg:gap-16">
          <div className="flex flex-col gap-3">
            <Image className="w-48 h-20" alt="Sayoda Travel" src={Logo} />

            <h5 className="font-semibold font-poppins">
              {t("location")}:{" "}
              <span className={`font-normal ${QuicksandFont.className}`}>
                {contacts.address}
              </span>
            </h5>

            <h5 className="font-semibold font-poppins">
              {t("phone")}:{" "}
              <a
                href={telHref(contacts.phone)}
                className="hover:text-mainLight hover:translate-x-1 transition-all duration-300"
              >
                <span className={`font-normal ${QuicksandFont.className}`}>
                  {contacts.phone}
                </span>
              </a>
            </h5>

            <h5 className="font-semibold font-poppins">
              {t("email")}:{" "}
              <a
                href={`mailto:${contacts.email}`}
                className="hover:text-mainLight hover:translate-x-1 transition-all duration-300"
              >
                <span className={`font-normal ${QuicksandFont.className}`}>
                  {contacts.email}
                </span>
              </a>
            </h5>

            {/* Реквизиты показываем только когда заказчик их заполнил —
                пустая строка «License:» доверия не добавляет. */}
            {COMPANY.legalName && (
              <p className={`text-sm ${QuicksandFont.className}`}>
                {COMPANY.legalName}
              </p>
            )}
            {COMPANY.licenseNumber && (
              <p className={`text-sm ${QuicksandFont.className}`}>
                {t("license")}: {COMPANY.licenseNumber}
              </p>
            )}

            <SocialIcons links={contacts.socials} />
          </div>

          <div className="footerForCenters">
            <h5 className="forH5">{t("usefulTitle")}</h5>
            {usefulLinks.map((href, i) => (
              <Link
                className={linkClass(QuicksandFont.className)}
                href={href}
                key={href}
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
                className={linkClass(QuicksandFont.className)}
                href={`/tours?location=${loc.id}`}
                key={loc.id}
              >
                <SlArrowRight className="w-3 h-3 text-[#BF8B30]" />
                {plainText(localizedField(loc, "location", locale))}
              </Link>
            ))}
          </div>

          <div className="footerForCenters">
            <h5 className="forH5">{t("ourTitle")}</h5>
            {visa.map((item) => (
              <Link
                className={linkClass(QuicksandFont.className)}
                href={`/destinations/turkmenistan/visa/${item.id}`}
                key={item.id}
              >
                <SlArrowRight className="w-3 h-3 text-[#BF8B30]" />
                {plainText(localizedField(item, "title", locale))}
              </Link>
            ))}
            <Link
              className={linkClass(QuicksandFont.className)}
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
            alt="Hebent Tech"
            width={30}
            height={30}
            className="w-5 h-auto"
          />
          <a
            href="https://hebent.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm md:text-base text-white pt-[1px]"
          >
            Hebent Tech
          </a>
        </div>
      </div>
    </div>
  );
}
