import Script from "next/script";
import { GA4_ID, isAnalyticsEnabled } from "@/lib/analytics";

/**
 * Подключение GA4. Без NEXT_PUBLIC_GA4_ID компонент ничего не рендерит,
 * поэтому на сборку и на страницы без счётчика он не влияет.
 *
 * Используем next/script напрямую, а не @next/third-parties: в проекте уже
 * так подключён Crisp, и лишняя зависимость ради двух тегов не нужна.
 */
export default function Analytics() {
  if (!isAnalyticsEnabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA4_ID}');
        `}
      </Script>
    </>
  );
}
