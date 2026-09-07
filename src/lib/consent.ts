/**
 * Согласие на куки.
 *
 * Одно решение на весь сайт: либо посетитель разрешил статистику и чат,
 * либо нет. Разбивать на отдельные галочки по категориям смысла нет —
 * сторонних сервисов всего два, и оба нужны для одного и того же.
 *
 * Собственный счётчик посещаемости сюда не входит намеренно: он ничего не
 * пишет на устройство и не хранит IP, а требование про согласие в законе
 * привязано именно к записи и чтению данных на устройстве. Поэтому цифры
 * в админке остаются полными независимо от выбора посетителя.
 */

export const CONSENT_KEY = "sayoda_cookie_consent";

/** Событие для компонентов, которые должны отреагировать без перезагрузки. */
export const CONSENT_EVENT = "sayoda-consent-change";

/**
 * Класс на <html>, когда согласие есть.
 *
 * Нужен, чтобы кнопка WhatsApp встала на своё место сразу, а не переехала
 * после гидратации. Значение известно из localStorage ещё при разборе
 * разметки, и класс проставляется тем же встроенным скриптом, что и
 * настройки Consent Mode, — то есть до первой отрисовки.
 */
export const CONSENT_CLASS = "cookies-ok";

export function applyConsentClass(granted: boolean) {
  document.documentElement.classList.toggle(CONSENT_CLASS, granted);
}

export type ConsentValue = "granted" | "denied";

/** null — выбор ещё не сделан, показываем баннер. */
export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    // Приватный режим в некоторых браузерах запрещает localStorage.
    // Считаем, что выбора нет: баннер покажется, согласие не запомнится,
    // но ничего лишнего без спроса не загрузится.
    return null;
  }
}

export function writeConsent(value: ConsentValue) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* см. комментарий в readConsent */
  }

  // Сообщаем Google о смене решения. Скрипт с настройками по умолчанию
  // определяет gtag до загрузки gtag.js, поэтому вызов не потеряется,
  // даже если счётчик ещё не догрузился.
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    gtag("consent", "update", consentPayload(value));
  }

  applyConsentClass(value === "granted");
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

/**
 * Сигналы Consent Mode v2. security_storage всегда разрешён: это защита от
 * подделки запросов, а не аналитика, и согласия не требует.
 */
export function consentPayload(value: ConsentValue) {
  const state = value === "granted" ? "granted" : "denied";
  return {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
    functionality_storage: state,
    personalization_storage: state,
    security_storage: "granted",
  };
}
