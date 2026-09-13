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
    <section className="container mx-auto px-5 pb-10 lg:pb-14">
      <div className="overflow-hidden rounded-2xl ring-1 ring-sand">
        <iframe
          src={contacts.mapEmbed}
          title={t("mapTitle")}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[320px] w-full border-0 md:h-[420px]"
        />
      </div>
    </section>
  );
}
