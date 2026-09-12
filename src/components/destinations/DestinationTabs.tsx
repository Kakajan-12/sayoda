"use client";

import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ComfortaFont } from "@/components/ui/Fonts";
import useTabScroll from "./useTabScroll";

type Props = {
  slug: string;
};

export default function DestinationTabs({ slug }: Props) {
  const pathname = usePathname();
  const t = useTranslations("Destinations");
  const onNavigate = useTabScroll();
  const base = `/destinations/${slug}`;

  const wrapRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  /*
   * Прилипла ли панель к шапке.
   *
   * Между шапкой и карточкой вкладок оставлен просвет в восемь пикселей.
   * Сам по себе он прозрачный, и текст статьи проходил прямо сквозь него:
   * на «Общей информации» в щели между 96 и 104 висел обрезанный заголовок
   * «Перелёты». Просвет нужно закрашивать — но только когда панель прилипла.
   * В покое она вытянута вверх на баннер отрицательным отступом, и постоянный
   * фон дал бы над карточкой белую полосу поперёк фотографии.
   *
   * Отступ не измеряем и не зашиваем числом, а читаем у самого элемента: он
   * разный по брейкпоинтам (шапка 80 на узких экранах против 96), и так
   * сравнение остаётся верным само собой.
   */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const offset = parseFloat(getComputedStyle(el).top) || 0;
      // Полпикселя допуска: координаты дробные, и точное равенство здесь
      // срабатывало бы через раз.
      setStuck(el.getBoundingClientRect().top <= offset + 0.5);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const tabs = [
    { href: base, label: t("tabGeneral"), exact: true },
    { href: `${base}/visa`, label: t("tabVisa"), exact: false },
    { href: `${base}/tours`, label: t("tabTours"), exact: false },
    { href: `${base}/sights`, label: t("tabSights"), exact: false },
    { href: `${base}/hotels`, label: t("tabHotels"), exact: false },
  ];

  return (
    /*
      Отступ сверху — высота шапки при прокрутке: 80 на узких экранах, 96 от sm
      и выше (логотип h-16 против h-20 плюс padding по 8). Контактная полоса в
      счёт не идёт — к моменту, когда панель прилипает, она давно схлопнута.

      Просвет задан padding'ом, а не самим top: так карточка стоит на одном и
      том же месте и до прилипания, и после, и в момент прилипания не дёргается.

      z-30 — ниже шапки (z-40), выше содержимого.
    */
    <div
      ref={wrapRef}
      className={`sticky top-20 z-30 -mt-14 mb-8 pt-2 sm:top-24 md:-mt-16 ${
        stuck ? "bg-white" : ""
      }`}
    >
      <nav
        className={`w-full overflow-x-auto rounded-xl bg-white shadow-md ${ComfortaFont.className}`}
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
                scroll={false}
                onClick={(event) => onNavigate(tab.href, event)}
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
    </div>
  );
}
