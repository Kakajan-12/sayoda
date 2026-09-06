import React from "react";
import { useTranslations } from "next-intl";
import { FaCalendarCheck, FaCompass, FaPeopleGroup } from "react-icons/fa6";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";

/**
 * «Почему выбирают нас».
 *
 * Было три сплошных бирюзовых блока в ряд. Проблем сразу несколько: цвет
 * шёл лесенкой от светлой бирюзы к тёмной, из-за чего третья карточка
 * выглядела важнее остальных без всякой причины; текст в карточках разной
 * длины, а высота общая — под коротким оставалась дыра в треть карточки;
 * фоновый узор не читался вовсе; а сразу под блоком идёт сплошной бирюзовый
 * блок про визу, и вместе это было слишком много одного цвета подряд.
 *
 * Теперь светлые карточки одинакового веса со значком: значок даёт взгляду
 * зацепку, а бирюза осталась акцентом, а не заливкой.
 */
const ICONS = [FaCalendarCheck, FaCompass, FaPeopleGroup];

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

        <div className="mt-8 grid gap-5 md:grid-cols-3 md:gap-6">
          {titles.map((title, i) => {
            const Icon = ICONS[i] ?? ICONS[0];
            return (
              <article
                key={i}
                className="flex flex-col gap-3 rounded-lg bg-white p-6 ring-1 ring-sand shadow-sm transition duration-300 hover:shadow-md hover:ring-tileLight"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-tileTint text-tile">
                  <Icon className="h-6 w-6" />
                </span>
                <h3
                  className={`${PoppinFont.className} text-lg/snug font-semibold text-ink md:text-xl/snug`}
                >
                  {title}
                </h3>
                <p
                  className={`${QuicksandFont.className} text-sm/relaxed text-inkMuted md:text-base/relaxed`}
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
