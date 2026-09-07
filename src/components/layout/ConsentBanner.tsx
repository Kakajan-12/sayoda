"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";
import {
  CONSENT_EVENT,
  readConsent,
  writeConsent,
  type ConsentValue,
} from "@/lib/consent";

/**
 * Баннер согласия на куки.
 *
 * Показывается всем посетителям, а не только европейским: определение страны
 * ошибается, а разное поведение сайта в разных странах сложнее поддерживать,
 * чем один честный баннер.
 *
 * Две равнозначные кнопки. Делать отказ менее заметным — приём, за который
 * европейские регуляторы штрафуют: согласие должно быть таким же простым,
 * как и отказ.
 *
 * До выбора ни GA4, ни чат ничего на устройство не пишут — за это отвечают
 * ConsentDefaults и LiveChat.
 */
export default function ConsentBanner() {
  const t = useTranslations("Consent");
  // null — ещё не прочитали localStorage. Отличаем от «выбор не сделан»,
  // иначе баннер мигал бы на долю секунды у тех, кто уже ответил.
  const [decided, setDecided] = useState<ConsentValue | null | undefined>(
    undefined,
  );

  useEffect(() => {
    setDecided(readConsent());

    // Ссылка в подвале сбрасывает решение — баннер должен вернуться
    // без перезагрузки страницы.
    const onChange = (e: Event) => {
      const value = (e as CustomEvent).detail;
      setDecided(value === "granted" || value === "denied" ? value : null);
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (decided === undefined || decided !== null) return null;

  const choose = (value: ConsentValue) => {
    writeConsent(value);
    setDecided(value);
  };

  return (
    <div
      // role/aria: это не модальное окно — сайтом можно пользоваться и не
      // отвечая. Поэтому фокус не запираем и содержимое не перекрываем.
      role="region"
      aria-label={t("title")}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-sand bg-white/95 backdrop-blur-sm shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
    >
      <div className="container mx-auto flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <p
          className={`${QuicksandFont.className} text-sm/relaxed text-inkMuted`}
        >
          {t("text")}{" "}
          <Link
            href="/privacy"
            className="text-tile underline underline-offset-2 transition-colors hover:text-tileLight"
          >
            {t("more")}
          </Link>
        </p>

        <div
          className={`${PoppinFont.className} flex shrink-0 gap-3 max-md:w-full`}
        >
          <button
            type="button"
            onClick={() => choose("denied")}
            className="flex-1 rounded-full border border-tile px-6 py-2.5 text-sm text-tile transition-colors hover:bg-tile hover:text-white md:flex-none"
          >
            {t("decline")}
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="flex-1 rounded-full bg-tile px-6 py-2.5 text-sm text-white transition-colors hover:bg-tileDark md:flex-none"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
