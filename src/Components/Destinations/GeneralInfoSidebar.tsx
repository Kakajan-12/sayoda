"use client";

import { useEffect, useState } from "react";
import { ComfortaFont } from "@/Ui/Fonts";
import {
  FaBinoculars,
  FaCloudSun,
  FaPlane,
  FaShieldHalved,
  FaCalendarDays,
  FaStar,
  FaBowlFood,
  FaLeaf,
} from "react-icons/fa6";

const iconMap: Record<string, React.ReactNode> = {
  overview: <FaBinoculars className="w-4 h-4 shrink-0" />,
  season: <FaCloudSun className="w-4 h-4 shrink-0" />,
  flights: <FaPlane className="w-4 h-4 shrink-0" />,
  safety: <FaShieldHalved className="w-4 h-4 shrink-0" />,
  holidays: <FaCalendarDays className="w-4 h-4 shrink-0" />,
  traditions: <FaStar className="w-4 h-4 shrink-0" />,
  cuisine: <FaBowlFood className="w-4 h-4 shrink-0" />,
  flora: <FaLeaf className="w-4 h-4 shrink-0" />,
};

export type SidebarLink = {
  id: string;
  icon: string;
  label: string;
};

export default function GeneralInfoSidebar({ links }: { links: SidebarLink[] }) {
  const [active, setActive] = useState(links[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    links.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [links]);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActive(id);
    }
  };

  return (
    <aside
      className={`w-full lg:sticky lg:top-32 bg-white shadow-md rounded-lg overflow-hidden ${ComfortaFont.className}`}
    >
      <nav className="flex flex-col">
        {links.map((link) => {
          const isActive = active === link.id;
          return (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleClick(e, link.id)}
              className={`flex items-center gap-3 px-5 py-4 text-sm md:text-base border-l-4 transition-colors ${
                isActive
                  ? "border-mainBlue text-mainBlue bg-mainForBackground font-semibold"
                  : "border-transparent text-gray-700 hover:bg-gray-50 hover:text-mainBlue"
              }`}
            >
              {iconMap[link.icon] ?? iconMap.overview}
              <span>{link.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
