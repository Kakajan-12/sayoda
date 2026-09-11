"use client";

import { useEffect, useRef, useState } from "react";
import { ComfortaFont } from "@/components/ui/Fonts";
import {
  FaBinoculars,
  FaBuilding,
  FaCircleInfo,
  FaCloudSun,
  FaGlobe,
  FaPlane,
  FaRoute,
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
  // Визовый раздел: разделы там заданы не из базы, а в самой странице.
  visa: <FaCircleInfo className="w-4 h-4 shrink-0" />,
  embassy: <FaBuilding className="w-4 h-4 shrink-0" />,
  globe: <FaGlobe className="w-4 h-4 shrink-0" />,
  border: <FaRoute className="w-4 h-4 shrink-0" />,
};

export type SidebarLink = {
  id: string;
  icon: string;
  label: string;
};

/**
 * Линия, по которой считается, что раздел дошёл до верха. Ниже неё начинается
 * то, что действительно видно: шапка занимает 96 пикселей, просвет под ней 8,
 * прилипшая панель вкладок — ещё 60, и снова 8 просвета. По этой же линии
 * встаёт раздел после нажатия в меню, поэтому подсветка всегда совпадает с
 * тем, что на экране.
 */
const HEADER_OFFSET = 180;

export default function GeneralInfoSidebar({ links }: { links: SidebarLink[] }) {
  const [active, setActive] = useState(links[0]?.id ?? "");
  /** Куда едем по нажатию: пока не доехали, подсветку не трогаем. */
  const goingTo = useRef<string | null>(null);

  /*
   * Подсветка отмечает раздел, который дошёл до верха.
   *
   * Раньше этим занимался IntersectionObserver с полосой между 30 % и 40 %
   * высоты экрана: раздел становился активным, едва его начало пересекало
   * треть окна сверху. Меню переключалось на «Перелёты», когда заголовок был
   * ещё далеко внизу, и не совпадало с тем, что человек читает.
   *
   * Теперь считаем прямо: активен последний раздел, начало которого уже выше
   * линии под шапкой. Та же линия у прокрутки по нажатию, так что после клика
   * подсветка и экран сходятся.
   */
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;

      let current = links[0]?.id ?? "";
      for (const link of links) {
        const el = document.getElementById(link.id);
        if (!el) continue;
        // Разделы идут по порядку: как только начало очередного ниже линии,
        // все следующие тем более ниже.
        //
        // Допуск в пиксель — из-за дробных координат. Прокрутка по нажатию
        // ставит раздел ровно на линию, но попасть может в 180.5, и тогда
        // строгое сравнение сочло бы, что он до неё не дошёл.
        if (el.getBoundingClientRect().top > HEADER_OFFSET + 1) break;
        current = link.id;
      }

      // У самого низа страницы последний раздел до линии уже не дойдёт —
      // под ним просто нет места, чтобы прокрутить. Значит, читают его.
      const doc = document.documentElement;
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) {
        current = links[links.length - 1]?.id ?? current;
      }

      // Плавная прокрутка идёт через все промежуточные разделы. Если отмечать
      // их по дороге, меню мигает сверху вниз по всему списку.
      if (goingTo.current) {
        if (goingTo.current !== current) return;
        goingTo.current = null;
      }

      setActive(current);
    };

    const onScroll = () => {
      // Пересчитываем раз в кадр: событие прокрутки приходит куда чаще, чем
      // страница успевает перерисоваться.
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Человек тронул прокрутку сам — значит поездка по нажатию отменена
    // (браузер так и делает), и держать подсветку больше нечего.
    const release = () => {
      goingTo.current = null;
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchstart", release, { passive: true });
    window.addEventListener("keydown", release);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchstart", release);
      window.removeEventListener("keydown", release);
    };
  }, [links]);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    goingTo.current = id;
    setActive(id);
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET,
      behavior: "smooth",
    });
  };

  return (
    <aside
      className={`w-full bg-white shadow-md rounded-lg overflow-hidden ${ComfortaFont.className}`}
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
