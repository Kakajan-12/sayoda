import React from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";

/**
 * Блок про визу и приглашение на главной.
 *
 * «Нужна ли виза в Туркменистан» люди ищут чаще, чем сами туры, а визовая
 * поддержка — то, чем оператор отличается от самостоятельной поездки: без
 * приглашения от местного агентства туристическую визу просто не выдадут.
 * Раздел на сайте был, но с главной на него не вело ни одной ссылки.
 */
export default async function VisaTeaser({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "VisaBlock" });
  const steps = t.raw("steps") as string[];

  return (
    <div className="w-full bg-tile py-12 text-white md:py-16">
      <div className="container mx-auto grid gap-8 px-5 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div>
          <h2
            className={`${PoppinFont.className} text-2xl/snug font-bold md:text-3xl/snug`}
          >
            {t("title")}
          </h2>
          <p
            className={`${QuicksandFont.className} mt-4 text-sm/relaxed text-white/85 md:text-base/relaxed`}
          >
            {t("text")}
          </p>
          <Link
            href="/destinations/turkmenistan/visa"
            className={`${PoppinFont.className} mt-6 inline-block rounded-full bg-brick px-8 py-3 text-sm text-white transition-colors hover:bg-brickDark md:text-base`}
          >
            {t("cta")}
          </Link>
        </div>

        {/* Шаги нумерованы осознанно: это настоящая последовательность —
            каждый следующий возможен только после предыдущего. */}
        <ol className={`${QuicksandFont.className} flex flex-col gap-4`}>
          {Array.isArray(steps) &&
            steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span
                  className={`${PoppinFont.className} flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-bold`}
                >
                  {i + 1}
                </span>
                <span className="pt-1 text-sm/relaxed text-white/90 md:text-base/relaxed">
                  {step}
                </span>
              </li>
            ))}
        </ol>
      </div>
    </div>
  );
}
