import { CONSENT_KEY } from "@/lib/consent";

/**
 * Consent Mode v2: значения по умолчанию.
 *
 * Должен выполниться раньше, чем загрузится gtag.js, иначе Google успеет
 * поставить куки до того, как узнает про отказ. Поэтому это обычный
 * встроенный скрипт, а не next/script: он исполняется прямо при разборе
 * разметки, а стратегия afterInteractive у счётчика запускает его позже.
 *
 * Возвращающемуся посетителю согласие проставляется здесь же, до первого
 * просмотра. Если сделать это в баннере, первый просмотр каждого визита
 * уходил бы обезличенным, и статистика в GA4 занижалась бы.
 *
 * По умолчанию всё запрещено. wait_for_update даёт полсекунды на решение
 * из localStorage, чтобы счётчик не отправил событие раньше времени.
 */
export default function ConsentDefaults() {
  const script = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      security_storage: 'granted',
      wait_for_update: 500
    });
    try {
      if (localStorage.getItem('${CONSENT_KEY}') === 'granted') {
        gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
          analytics_storage: 'granted',
          functionality_storage: 'granted',
          personalization_storage: 'granted',
          security_storage: 'granted'
        });
      }
    } catch (e) {}
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
