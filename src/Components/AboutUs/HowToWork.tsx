import React from "react";
import { useTranslations } from "next-intl";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";

/**
 * «Как это работает».
 *
 * Шаги шли друг под другом в колонке шириной в три пятых экрана: справа
 * зияла пустая половина, а огромный полупрозрачный номер стоял позади
 * заголовка и налезал на него. Понять, что это последовательность, было
 * можно только по номерам — связи между шагами не было никакой.
 *
 * Теперь три колонки, соединённые линией: линия и есть смысл блока —
 * она показывает, что шаги идут один за другим. Нумерация здесь не
 * украшение: следующий шаг возможен только после предыдущего.
 */
const HowToWork = () => {
  const section = useTranslations("SectionTitle");
  const work = useTranslations("Work");
  const titles = work.raw("cardtitle") as string[];
  const texts = work.raw("cardtext") as string[];

  return (
    <section className="w-full py-10 md:py-16">
      <div className="container mx-auto px-5">
        <h2
          className={`${PoppinFont.className} font-bold text-xl md:text-2xl xl:text-3xl`}
        >
          {section("how")}?
        </h2>

        <div className="relative mt-10">
          {/* Линия проходит через центр кружков с номерами. Кружок залит
              сплошным цветом и перекрывает её, поэтому она читается как
              соединение между шагами, а не как полоса под ними. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-sand md:block"
          />

          <ol className="grid gap-8 md:grid-cols-3 md:gap-6">
            {titles.map((title, i) => (
              <li key={i} className="relative flex flex-col gap-3">
                <span
                  className={`${PoppinFont.className} flex h-12 w-12 items-center justify-center rounded-full bg-tile text-lg font-bold text-white`}
                >
                  {i + 1}
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
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HowToWork;
