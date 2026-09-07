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

/**
 * Что ставят на нашем домене GA4 и Tawk.to.
 *
 * Отзыв согласия обязан убирать уже поставленное, иначе согласие
 * отзывается только на словах: куки продолжают лежать в браузере.
 * Списком по префиксам, а не всё подряд, — чтобы не задеть чужое.
 */
const THIRD_PARTY_PREFIXES = ["_ga", "_gid", "_gat", "__tawk", "TawkConnectionTime"];

function deleteCookie(name: string) {
  const host = window.location.hostname;

  // Куку могли поставить и на текущий хост, и на домен с точкой впереди.
  // Гасим все варианты: браузер удалит только ту, у которой домен и путь
  // совпали в точности, а промахнувшаяся осталась бы жить.
  const domains = new Set(["", host, `.${host}`]);
  const parts = host.split(".");
  if (parts.length > 2) {
    const root = parts.slice(-2).join(".");
    domains.add(root);
    domains.add(`.${root}`);
  }

  for (const domain of domains) {
    document.cookie =
      `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/` +
      (domain ? `; domain=${domain}` : "");
  }
}

/** Стирает куки и записи, оставленные счётчиком и чатом. */
export function clearThirdPartyStorage() {
  try {
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.split("=")[0].trim();
      if (name && THIRD_PARTY_PREFIXES.some((p) => name.startsWith(p))) {
        deleteCookie(name);
      }
    }
  } catch {
    /* куки могут быть недоступны — не повод падать */
  }

  // Tawk держит состояние диалога ещё и в хранилищах браузера.
  for (const store of [window.localStorage, window.sessionStorage]) {
    try {
      // Ключи сначала собираем и только потом удаляем: removeItem сдвигает
      // индексы, и обход с одновременным удалением пропускал бы записи.
      const keys: string[] = [];
      for (let i = 0; i < store.length; i += 1) {
        const key = store.key(i);
        if (key && key.toLowerCase().startsWith("tawk")) keys.push(key);
      }
      keys.forEach((key) => store.removeItem(key));
    } catch {
      /* приватный режим */
    }
  }
}

export function writeConsent(value: ConsentValue) {
  // Запоминаем прежний ответ: понадобится решить, надо ли убирать за
  // сторонними скриптами. Читаем до записи нового значения.
  const previous = readConsent();

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

  /*
   * Снятое согласие требует перезагрузки.
   *
   * Размонтировать компонент недостаточно: <Script> — только обёртка, а сам
   * виджет Tawk дорисовывает свои узлы и iframe прямо в body в обход React,
   * и убрать их размонтированием нельзя. gtag.js, единожды загруженный,
   * тоже остаётся в памяти. Чистая страница — единственный надёжный способ
   * вернуть состояние «ничего стороннего не загружено».
   *
   * Перезагружаем только при переходе из «разрешено»: если посетитель
   * отказывается сразу, грузить было нечего и дёргать страницу незачем.
   */
  if (previous === "granted" && value === "denied") {
    clearThirdPartyStorage();
    window.location.reload();
  }
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
