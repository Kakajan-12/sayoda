import Script from "next/script";

/**
 * Виджет живого чата Tawk.to.
 *
 * Пришёл на смену Crisp: его website id был зашит прямо в layout.tsx, то есть
 * сменить или отключить чат можно было только правкой кода с передеплоем.
 * Здесь идентификатор приходит из админки, и пустое значение просто выключает
 * чат — ничего не грузится и лишних запросов не появляется.
 *
 * Ядро Tawk.to бесплатно бессрочно: без ограничений по числу операторов,
 * диалогов и глубине истории. Платно только снятие подписи «Powered by
 * tawk.to» с виджета и ИИ-ответы — ни то, ни другое для работы не требуется.
 */
export default function LiveChat({ tawkId }: { tawkId: string | null }) {
  // Из админки может прийти что угодно, а значение подставляется в адрес
  // скрипта. Пускаем только ожидаемый формат propertyId/widgetId.
  const id = (tawkId || "").trim().replace(/^\/+|\/+$/g, "");
  if (!/^[A-Za-z0-9]+\/[A-Za-z0-9]+$/.test(id)) return null;

  return (
    <Script id="tawk-widget" strategy="afterInteractive">
      {`
        var Tawk_API = Tawk_API || {};
        var Tawk_LoadStart = new Date();
        (function () {
          var s1 = document.createElement("script");
          var s0 = document.getElementsByTagName("script")[0];
          s1.async = true;
          s1.src = "https://embed.tawk.to/${id}";
          s1.charset = "UTF-8";
          s1.setAttribute("crossorigin", "*");
          s0.parentNode.insertBefore(s1, s0);
        })();
      `}
    </Script>
  );
}
