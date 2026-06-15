"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  FaBuilding,
  FaCircleInfo,
  FaGlobe,
  FaPassport,
  FaRoute,
} from "react-icons/fa6";
import { ComfortaFont } from "@/Ui/Fonts";
import { stripHtml, type VisaItem } from "@/api/getVisa";

type SidebarItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: (pathname: string) => boolean;
};

type Props = {
  country: string;
  visaList: VisaItem[];
  locale: string;
};

export default function DestinationVisaSidebar({
  country,
  visaList,
  locale,
}: Props) {
  const pathname = usePathname();
  const t = useTranslations("Visa");
  const td = useTranslations("Destinations");
  const base = `/destinations/${country}/visa`;
  const isTurkmenistan = country === "turkmenistan";

  // Overview ("How to get a visa") is available for every country.
  const items: SidebarItem[] = [
    {
      href: base,
      label: td("tabVisa"),
      icon: <FaCircleInfo className="w-4 h-4 shrink-0" />,
      isActive: (path) => path === base,
    },
  ];

  // The detailed visa types, embassies and border data are Turkmenistan-specific.
  if (isTurkmenistan) {
    visaList.forEach((visa) => {
      const href = `${base}/${visa.id}`;
      const title =
        locale === "ru"
          ? visa.title_ru
          : locale === "tk"
            ? visa.title_tk
            : visa.title_en;
      items.push({
        href,
        label: stripHtml(title) || t("turkmenVisa"),
        icon: <FaPassport className="w-4 h-4 shrink-0" />,
        isActive: (path) => path === href,
      });
    });

    items.push(
      {
        href: `${base}/embassies-in-turkmenistan`,
        label: t("embassiesIn"),
        icon: <FaBuilding className="w-4 h-4 shrink-0" />,
        isActive: (path) => path.startsWith(`${base}/embassies-in-turkmenistan`),
      },
      {
        href: `${base}/embassies-abroad`,
        label: t("embassiesAbroad"),
        icon: <FaGlobe className="w-4 h-4 shrink-0" />,
        isActive: (path) => path.startsWith(`${base}/embassies-abroad`),
      },
      {
        href: `${base}/crossing-borders`,
        label: t("crossingBorders"),
        icon: <FaRoute className="w-4 h-4 shrink-0" />,
        isActive: (path) => path.startsWith(`${base}/crossing-borders`),
      },
    );
  }

  return (
    <aside
      className={`w-full lg:sticky lg:top-32 lg:z-30 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto bg-white shadow-md rounded-lg overflow-hidden ${ComfortaFont.className}`}
    >
      <nav className="flex flex-col">
        {items.map((item) => {
          const active = item.isActive(pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-4 text-sm md:text-base border-l-4 transition-colors ${
                active
                  ? "border-mainBlue text-mainBlue bg-mainForBackground font-semibold"
                  : "border-transparent text-gray-700 hover:bg-gray-50 hover:text-mainBlue"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
