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

/** Пара идентификаторов в адресе вставки: propertyId/widgetId. */
const ID_PAIR = /([A-Za-z0-9]{6,})\/([A-Za-z0-9]{3,})/;

/**
 * Приводит то, что вставили в админку, к виду propertyId/widgetId.
 *
 * В поле попадает что угодно: голая пара, ссылка на код вставки, ссылка
 * на прямой чат или целиком фрагмент <script>. Разбираем все эти формы,
 * потому что заставлять заказчика вырезать нужный кусок руками — верный
 * способ получить неработающий чат без единого сообщения об ошибке.
 *
 * Возвращает null, если пары не видно. Частый случай — вставленный вместо
 * кода виджета API-ключ из Admin → Property Settings: это 40 символов
 * без слэша, и работать он не может.
 */
export function normalizeTawkId(raw: string | null | undefined): string | null {
  const value = (raw || "").trim();
  if (!value) return null;

  const match = value.match(ID_PAIR);
  if (!match) return null;

  return `${match[1]}/${match[2]}`;
}

export default function LiveChat({ tawkId }: { tawkId: string | null }) {
  // Значение подставляется в адрес стороннего скрипта, поэтому в src попадает
  // только разобранная пара идентификаторов, а не сырая строка из базы.
  const id = normalizeTawkId(tawkId);
  if (!id) return null;

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
