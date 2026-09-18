import { getTranslations } from "next-intl/server";
import {
  LuClock,
  LuInstagram,
  LuLanguages,
  LuMail,
  LuMapPin,
  LuMessageCircle,
  LuPhone,
  LuTimer,
} from "react-icons/lu";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";
import {
  getContacts,
  telHref,
  whatsappHref,
  type Office,
} from "@/lib/api/contacts";
import { getSettings } from "@/lib/api/settings";
import { formatOfficeHours, languageNames } from "@/lib/languages";

/**
 * Реквизиты на странице контактов — серверным рендером.
 *
 * Раньше адрес, телефон, почту и карту тянул из браузера клиентский
 * компонент, и в серверном HTML страницы контактов не было ни одного
 * контакта: поисковик видел заголовок и форму. Для страницы, у которой одна
 * задача — дать способ связаться, это худшее, что можно сделать.
 *
 * Стоит в колонке рядом с картой и своей обёртки не держит: ширину и
 * отступы задаёт страница, иначе два соседних блока не выровнять.
 *
 * Строка не выводится, если значения нет. Пустой WhatsApp или незаполненные
 * часы работы — обычное состояние настроек, а «Часы работы: —» выглядит
 * поломкой, а не отсутствием данных.
 */
export default async function ContactDetails({
  locale,
  office,
}: {
  locale: string;
  /**
   * Офис, чьи адрес, телефон и почту показываем. Не передан — берём то,
   * что отдаёт getContacts: первый адрес, первый телефон, первую почту.
   * Так страница переживает случай, когда точки в админке не заведены.
   */
  office?: Office;
}) {
  const [t, tc, contacts, settings] = await Promise.all([
    getTranslations({ locale, namespace: "ContactUs" }),
    getTranslations({ locale, namespace: "Contact" }),
    getContacts(locale),
    getSettings(),
  ]);

  const days = t.raw("days") as Record<string, string>;
  const hours = formatOfficeHours(settings.office_hours, days);
  const languages = languageNames(settings.guide_languages, locale);
  // Готовый текст в WhatsApp: человек попадает в чат с уже написанным
  // вопросом и не думает, с чего начать.
  const whatsapp = whatsappHref(contacts, tc("whatsappPrefill"), settings.whatsapp);
  const instagram = contacts.socials.find((link) => link.icon === "instagram");
  // Имя профиля достаём из адреса, а не пишем в коде: аккаунт может
  // смениться, и тогда подпись рядом со ссылкой начнёт врать.
  const instagramHandle = instagram
    ? `@${instagram.url.replace(/\/+$/, "").split("/").pop()}`
    : "";
  const replyHours = Number(settings.response_time_hours);
  // Номер WhatsApp в настройках хранится без плюса — так его ждёт wa.me.
  // На странице это номер телефона, и читается он с плюсом.
  const whatsappNumber = (settings.whatsapp || contacts.phone).trim();
  const whatsappLabel = whatsappNumber.startsWith("+")
    ? whatsappNumber
    : `+${whatsappNumber.replace(/\D/g, "")}`;

  /*
   * Реквизиты офиса берём из переданной точки, остальное — общее для
   * компании: часы работы, языки, WhatsApp и Instagram одни на всех.
   */
  const адрес = office?.address || contacts.address;
  const телефон = office?.phone || contacts.phone;
  const почта = office?.email || contacts.email;

  const rows = [
    {
      icon: LuMapPin,
      label: t("labelAddress"),
      value: адрес,
      href: null as string | null,
      note: null as string | null,
    },
    {
      icon: LuPhone,
      label: t("labelPhone"),
      value: телефон,
      href: telHref(телефон),
      note: null,
    },
    {
      icon: LuMail,
      label: t("labelEmail"),
      value: почта,
      href: `mailto:${почта}`,
      note: null,
    },
    {
      icon: LuMessageCircle,
      label: t("labelWhatsapp"),
      value: whatsapp ? whatsappLabel : "",
      href: whatsapp,
      note: null,
    },
    {
      icon: LuInstagram,
      label: t("labelInstagram"),
      value: instagramHandle,
      href: instagram?.url ?? null,
      note: null,
    },
    {
      icon: LuClock,
      label: t("labelHours"),
      value: hours,
      href: null,
      note: hours ? t("hoursNote") : null,
    },
    {
      icon: LuTimer,
      label: t("labelReply"),
      value: replyHours > 0 ? t("replyValue", { hours: replyHours }) : "",
      href: null,
      note: null,
    },
    {
      icon: LuLanguages,
      label: t("labelLanguages"),
      value: languages.join(", "),
      href: null,
      note: null,
    },
  ].filter((row) => Boolean(row.value));

  return (
    <div>
      <h2
        className={`${PoppinFont.className} text-2xl font-bold text-tile md:text-3xl`}
      >
        {t("detailsTitle")}
      </h2>

      {/* Две колонки, а не три и не одна. Три в половине ширины дают узкие
          полоски, одна вытягивает блок на восемь строк — и карта рядом,
          растянутая по его высоте, занимает больше экрана, чем сама
          страница. */}
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex gap-3 rounded-xl bg-white px-5 py-5 ring-1 ring-sand"
          >
            <row.icon aria-hidden className="mt-1 h-5 w-5 shrink-0 text-tileMid" />
            <div className="min-w-0">
              <dt className="text-sm font-semibold text-tile">{row.label}</dt>
              <dd
                className={`${QuicksandFont.className} mt-1 break-words text-sm/relaxed text-inkMuted lg:text-base/relaxed`}
              >
                {row.href ? (
                  <a
                    href={row.href}
                    // Внешние адреса открываем в новой вкладке, tel и mailto —
                    // в той же: иначе браузер оставляет после звонка пустое окно.
                    target={row.href.startsWith("http") ? "_blank" : undefined}
                    rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="transition-colors hover:text-tileMid"
                  >
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
                {row.note && (
                  <span className="block text-xs text-inkMuted/80">{row.note}</span>
                )}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
