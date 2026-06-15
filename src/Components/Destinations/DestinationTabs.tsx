"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ComfortaFont } from "@/Ui/Fonts";

type Props = {
  slug: string;
};

export default function DestinationTabs({ slug }: Props) {
  const pathname = usePathname();
  const t = useTranslations("Destinations");
  const base = `/destinations/${slug}`;

  const tabs = [
    { href: base, label: t("tabGeneral"), exact: true },
    { href: `${base}/visa`, label: t("tabVisa"), exact: false },
    { href: `${base}/tours`, label: t("tabTours"), exact: false },
    { href: `${base}/sights`, label: t("tabSights"), exact: false },
    { href: `${base}/hotels`, label: t("tabHotels"), exact: false },
  ];

  return (
    <nav
      className={`w-full overflow-x-auto bg-white shadow-md rounded-xl ${ComfortaFont.className}`}
    >
      <div className="flex min-w-max md:min-w-0 md:justify-between">
        {tabs.map((tab) => {
          const active = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 whitespace-nowrap text-center px-5 py-4 text-sm md:text-base font-semibold border-b-4 transition-colors ${
                active
                  ? "border-mainBlue text-white bg-mainBlue"
                  : "border-transparent text-mainBlue hover:bg-mainForBackground"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
