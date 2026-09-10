import React from "react";
import { useTranslations } from "next-intl";
import {
  FaCertificate,
  FaHotel,
  FaPassport,
  FaPeopleGroup,
  FaReceipt,
  FaRoute,
  FaVanShuttle,
  FaWhatsapp,
} from "react-icons/fa6";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";

/**
 * «Почему выбирают нас».
 *
 * Сначала здесь были три сплошных бирюзовых блока в ряд: цвет шёл лесенкой,
 * из-за чего третья карточка выглядела важнее остальных без причины; текст
 * разной длины при общей высоте оставлял под коротким дыру в треть карточки;
 * а сразу ниже идёт сплошной бирюзовый блок про визу, и одного цвета подряд
 * было слишком много. Тогда карточки стали светлыми и одинакового веса.
 *
 * Теперь изменилось содержание. Три пункта были абзацами общих слов —
 * «беспрепятственное планирование», «аутентичные путешествия». Такое пишет
 * о себе любой туроператор, и проверить это нельзя. Возражения человека,
 * который выбирает поездку в Туркменистан, они не снимали.
 *
 * Восемь пунктов вместо трёх, и каждый отвечает на конкретный страх: визу
 * не дадут, поеду с чужой группой, повезут по каталогу, всплывут доплаты,
 * не с кем поговорить до оплаты. Формулировки короткие: это не рассказ
 * о компании, а список причин, который просматривают глазами.
 *
 * Чего здесь намеренно нет: «безопасная оплата на сайте». Приёма платежей
 * на сайте не существует, и обещать его нельзя.
 *
 * Порядок значков привязан к порядку строк в переводах — при добавлении
 * пункта значок нужно добавить и сюда, иначе он подставится по кругу.
 */
const ICONS = [
  FaCertificate, // лицензия
  FaPassport, // приглашение
  FaPeopleGroup, // групповые и частные
  FaVanShuttle, // гиды и водители
  FaHotel, // отели
  FaWhatsapp, // связь
  FaRoute, // маршрут под себя
  FaReceipt, // без доплат
];

const WhyChoose = () => {
  const t = useTranslations("SectionTitle");
  const why = useTranslations("Why");
  const titles = why.raw("cardtitle") as string[];
  const texts = why.raw("cardtext") as string[];

  return (
    <section className="w-full bg-sandLight py-10 md:py-16">
      <div className="container mx-auto px-5">
        <h2
          className={`${PoppinFont.className} font-bold text-xl md:text-2xl xl:text-3xl`}
        >
          {t("why")}?
        </h2>

        {/*
          Две колонки уже на телефоне: пункты стали короткими, и в один
          столбик восемь штук растянулись бы на два экрана — список,
          который должен схватываться взглядом, пришлось бы листать.
        */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {titles.map((title, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <article
                key={title}
                className="flex h-full flex-col gap-2 rounded-lg bg-white p-4 shadow-sm ring-1 ring-sand transition duration-300 hover:shadow-md hover:ring-tileLight sm:p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-tileTint text-tile">
                  <Icon className="h-5 w-5" />
                </span>
                <h3
                  className={`${PoppinFont.className} text-sm/snug font-semibold text-ink sm:text-base/snug`}
                >
                  {title}
                </h3>
                <p
                  className={`${QuicksandFont.className} text-xs/relaxed text-inkMuted sm:text-sm/relaxed`}
                >
                  {texts[i]}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
