import { getTranslations } from "next-intl/server";
import { getContacts } from "@/lib/api/contacts";

/**
 * Карта офиса.
 *
 * В базе адрес карты лежит целиком тегом <iframe> — так его копируют из
 * Google Maps. Свой тег собираем сами: чужую разметку на страницу пускать
 * незачем, а у своей есть отложенная загрузка и подпись для скринридера,
 * без которой фрейм читается как «frame».
 *
 * Пустой или посторонний адрес — карты нет. Проверку домена делает
 * getContacts: этот адрес уходит в src, то есть в чужой код на странице.
 */
export default async function ContactMap({ locale }: { locale: string }) {
  const [t, contacts] = await Promise.all([
    getTranslations({ locale, namespace: "ContactUs" }),
    getContacts(locale),
  ]);

  if (!contacts.mapEmbed) return null;

  return (
    /* Карта занимала всю ширину и почти весь экран по высоте — целый
       разворот под одним объектом. Теперь она стоит рядом с реквизитами и
       тянется на их высоту, но не выше 520 пикселей: без потолка карта
       повторяла высоту соседней колонки и выходила за экран. На узких
       экранах 320, чтобы под ней оставалось видно продолжение. */
    <div className="h-[320px] overflow-hidden rounded-2xl ring-1 ring-sand lg:h-full lg:max-h-[520px] lg:min-h-[420px]">
      <iframe
        src={contacts.mapEmbed}
        title={t("mapTitle")}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
      />
    </div>
  );
}
