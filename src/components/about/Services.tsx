import React from "react";
import Image from "next/image";
import img1 from "../../../public/AboutImgs/Servicessimg/global_8003696.svg";
import img2 from "../../../public/AboutImgs/Servicessimg/human-world_1610343 1.svg";
import img3 from "../../../public/AboutImgs/Servicessimg/Снимок_экрана_2025-03-29_165309-removebg-preview.svg";
import img4 from "../../../public/AboutImgs/Servicessimg/Снимок_экрана_2025-03-29_165648-removebg-preview.svg";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";
import { useTranslations } from "next-intl";

/**
 * Что мы делаем.
 *
 * Раздел был свёрстан иначе всей остальной страницы: заголовок с текстом в
 * узкой колонке слева, четыре карточки в широкой справа. Колонки жили своей
 * жизнью — под коротким текстом зияла пустота высотой в полэкрана, а
 * карточки, выровненные по центру, уезжали к правому краю и упирались в
 * него. Плюс тяжёлые тени и подписи в 12 пикселей по центру — язык, которого
 * на странице больше нигде нет.
 *
 * Теперь как у соседних блоков: заголовок и вводная строка во всю ширину,
 * под ними сетка плоских карточек со светлой обводкой. Тот же ритм, что у
 * «Зачем ехать через местного оператора» и «Sayoda Travel в цифрах», —
 * страница читается как одна, а не как три разные.
 *
 * Картинки оставлены прежние: это иллюстрации заказчика, а не украшение
 * вёрстки.
 */
const icons = [img1, img2, img4, img3];

const Services = () => {
  const t = useTranslations("Services");
  const titles = t.raw("cardtitle") as string[];
  const texts = t.raw("cardtext") as string[];

  return (
    <section className="container mx-auto px-5 py-12 lg:py-16">
      {/* Раньше над этим заголовком стоял h3 «SERVICES» — надзаголовок,
          который ничего не добавлял к самому заголовку и при этом ломал
          порядок: h1 страницы, следом h3, и только потом h2. */}
      <h2
        className={`${PoppinFont.className} text-2xl font-bold text-tile md:text-3xl`}
      >
        {t("provide")}
      </h2>
      <p
        className={`${QuicksandFont.className} mt-3 max-w-3xl text-sm/relaxed text-inkMuted lg:text-base/relaxed`}
      >
        {t("text")}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {titles.map((title, i) => (
          <div
            key={title}
            className="flex flex-col gap-3 rounded-xl bg-white px-5 py-6 ring-1 ring-sand"
          >
            {/* Кружок крупнее, чем у соседних блоков, и не случайно: там
                иконки сплошные, а здесь тонкая линейная графика заказчика —
                на 24 пикселях она превращается в бледное пятно. */}
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-mainForBackground">
              <Image alt="" aria-hidden src={icons[i]} className="h-8 w-8" />
            </span>
            {/* Заголовок один. Прежде их было два — один с hidden lg:block,
                второй с lg:hidden, — и оба лежали в разметке: скринридер
                читал название дважды, поиск засчитывал повтор. */}
            <h3
              className={`${PoppinFont.className} text-base font-semibold text-tile lg:text-lg`}
            >
              {title}
            </h3>
            <p
              className={`${QuicksandFont.className} text-sm/relaxed text-inkMuted lg:text-base/relaxed`}
            >
              {texts[i]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
