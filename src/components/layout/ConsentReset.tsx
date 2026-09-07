"use client";

import { useState } from "react";
import { PoppinFont } from "@/components/ui/Fonts";
import {
  applyConsentClass,
  clearThirdPartyStorage,
  CONSENT_EVENT,
  CONSENT_KEY,
  consentPayload,
  readConsent,
} from "@/lib/consent";

/**
 * Сброс решения по cookie.
 *
 * Отозвать согласие должно быть так же просто, как его дать, — иначе смысл
 * согласия теряется. Кнопка стирает сохранённый выбор и возвращает баннер.
 *
 * Разрешения при этом сразу снимаются: если человек нажал «изменить» и
 * закрыл вкладку, не ответив, статистика собираться не должна.
 */
export default function ConsentReset({
  label,
  doneLabel,
}: {
  label: string;
  doneLabel: string;
}) {
  const [done, setDone] = useState(false);

  const reset = () => {
    // Было ли что убирать: если согласия не было, ничего и не грузилось.
    const wasGranted = readConsent() === "granted";

    try {
      window.localStorage.removeItem(CONSENT_KEY);
    } catch {
      /* приватный режим — выбор и так не хранится */
    }

    const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof gtag === "function") {
      gtag("consent", "update", consentPayload("denied"));
    }

    // Снимаем класс: чат исчезнет, и кнопка WhatsApp должна вернуться
    // на его место справа.
    applyConsentClass(false);

    // detail без значения — баннер поймёт это как «выбор не сделан»
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));

    /*
     * Если чат и счётчик уже были загружены, убрать их размонтированием
     * нельзя: Tawk дорисовывает свои узлы в body в обход React. Чистим
     * следы и перезагружаем страницу — баннер появится на ней сразу.
     */
    if (wasGranted) {
      clearThirdPartyStorage();
      window.location.reload();
      return;
    }

    setDone(true);
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={reset}
        className={`${PoppinFont.className} rounded-full border border-tile px-6 py-2.5 text-sm text-tile transition-colors hover:bg-tile hover:text-white`}
      >
        {label}
      </button>
      {done && <p className="mt-2 text-sm text-tile">{doneLabel}</p>}
    </div>
  );
}
