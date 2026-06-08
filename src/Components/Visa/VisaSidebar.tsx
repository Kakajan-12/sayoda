"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { FaBuilding, FaGlobe, FaPassport, FaRoute } from "react-icons/fa6";
import { ComfortaFont } from "@/Ui/Fonts";
import { stripHtml, type VisaItem } from "@/api/getVisa";

type SidebarItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: (pathname: string) => boolean;
};

type Props = {
  visaList: VisaItem[];
  locale: string;
};

export default function VisaSidebar({ visaList, locale }: Props) {
  const pathname = usePathname();
  const t = useTranslations("Visa");

  const visaItems: SidebarItem[] = visaList.map((visa) => {
    const href = `/visa/${visa.id}`;
    const title =
      locale === "ru"
        ? visa.title_ru
        : locale === "tk"
          ? visa.title_tk
          : visa.title_en;

    return {
      href,
      label: stripHtml(title) || t("turkmenVisa"),
      icon: <FaPassport className="w-4 h-4 shrink-0" />,
      isActive: (path) => path === href,
    };
  });

  const staticItems: SidebarItem[] = [
    {
      href: "/visa/embassies-in-turkmenistan",
      label: t("embassiesIn"),
      icon: <FaBuilding className="w-4 h-4 shrink-0" />,
      isActive: (path) => path.startsWith("/visa/embassies-in-turkmenistan"),
    },
    {
      href: "/visa/embassies-abroad",
      label: t("embassiesAbroad"),
      icon: <FaGlobe className="w-4 h-4 shrink-0" />,
      isActive: (path) => path.startsWith("/visa/embassies-abroad"),
    },
    {
      href: "/visa/crossing-borders",
      label: t("crossingBorders"),
      icon: <FaRoute className="w-4 h-4 shrink-0" />,
      isActive: (path) => path.startsWith("/visa/crossing-borders"),
    },
  ];

  const items = [...visaItems, ...staticItems];

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
