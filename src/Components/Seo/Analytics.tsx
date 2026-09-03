import Script from "next/script";

/**
 * Подключение GA4. Идентификатор приходит из админки — если он не задан,
 * компонент не рендерит ничего, и на страницах без счётчика лишних запросов
 * не появляется.
 *
 * Используем next/script напрямую, а не @next/third-parties: так же подключён
 * виджет чата, и лишняя зависимость ради двух тегов не нужна.
 */
export default function Analytics({ ga4Id }: { ga4Id: string | null }) {
  // Пустая строка и мусорное значение из админки не должны попадать в URL.
  const id = (ga4Id || "").trim();
  if (!/^G-[A-Z0-9]+$/i.test(id)) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
