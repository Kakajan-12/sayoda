import React from "react";
import { getTranslations } from "next-intl/server";
import { LuCheck, LuX } from "react-icons/lu";
import { Link } from "@/i18n/navigation";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";
import { type Tour, durationDays, localizedField } from "@/lib/api/catalog";
import { plainText } from "@/lib/utils";

/**
 * «Сколько стоит поездка в Туркменистан».
 *
 * Цены на сайте были только внутри карточек туров: чтобы понять порядок
 * сумм, приходилось открыть каталог и перебрать двенадцать страниц. Для
 * человека, который ещё только прикидывает, по карману ли ему поездка,
 * это лишний шаг — и повод уйти, ничего не спросив.
 *
 * Числа считаются из тех же туров, что уже загружены для главной, а не
 * записаны руками. Цена, разошедшаяся с каталогом, хуже отсутствующей:
 * человек увидит одну сумму на главной, другую на странице тура и решит,
 * что его вводят в заблуждение. Здесь такое расхождение невозможно —
 * источник один.
 *
 * Считаем только по Туркменистану: заголовок обещает Туркменистан, а в
 * каталоге есть и соседние страны по своим ценам. Страну берём из
 * английского поля — оно не зависит от языка страницы.
 */

/** Границы «коротких», «средних» и «длинных» поездок в днях. */
const SHORT_MAX = 3;
const MID_MAX = 5;

type Bucket = { key: string; label: string; from: number | null };

function cheapest(prices: number[]): number | null {
  return prices.length ? Math.min(...prices) : null;
}

export default async function PriceGuide({
  tours,
  locale,
}: {
  tours: Tour[];
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "Home" });

  const short: number[] = [];
  const mid: number[] = [];
  const long: number[] = [];

  for (const tour of tours) {
    const country = plainText(localizedField(tour, "location", "en")).toLowerCase();
    if (country !== "turkmenistan") continue;

    const days = durationDays(localizedField(tour, "duration", "en"));
    const price = Number(tour.price);
    // Тур без длительности или без цены в подсчёт не берём: подписи
    // «от» под ним не построить, а нулём он занизил бы всю колонку.
    if (!days || !Number.isFinite(price) || price <= 0) continue;

    if (days <= SHORT_MAX) short.push(price);
    else if (days <= MID_MAX) mid.push(price);
    else long.push(price);
  }

  const buckets: Bucket[] = [
    { key: "short", label: t("priceShort"), from: cheapest(short) },
    { key: "mid", label: t("priceMid"), from: cheapest(mid) },
    { key: "long", label: t("priceLong"), from: cheapest(long) },
  ].filter((b) => b.from !== null);

  // Ни одного тура с ценой — показывать пустой прайс незачем.
  if (buckets.length === 0) return null;

  const included = t.raw("priceIncludedItems") as string[];
  const excluded = t.raw("priceExcludedItems") as string[];

  return (
    <section className="w-full py-10 md:py-16">
      <div className="container mx-auto px-5">
        <h2
          className={`${PoppinFont.className} text-xl font-bold md:text-2xl xl:text-3xl`}
        >
          {t("priceTitle")}
        </h2>
        <p
          className={`${QuicksandFont.className} mt-3 max-w-2xl text-sm text-inkMuted md:text-base`}
        >
          {t("priceLead")}
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {buckets.map((b) => (
            <div
              key={b.key}
              className="rounded-lg border border-sand bg-white p-5 shadow-sm"
            >
              <p className={`${QuicksandFont.className} text-sm text-inkMuted`}>
                {b.label}
              </p>
              <p className="mt-2 flex items-baseline gap-1.5">
                <span className="text-sm text-inkMuted">{t("priceFrom")}</span>
                {/* tabular-nums: суммы стоят в ряд и должны сравниваться
                    взглядом, а пропорциональные цифры сбивают колонку. */}
                {/* Знак валюты после числа — так цена написана в карточках
                    туров, и две разные записи на одной странице читались бы
                    как две разные вещи. */}
                <span
                  className={`${PoppinFont.className} text-3xl font-bold tabular-nums text-brick`}
                >
                  {b.from}$
                </span>
              </p>
              <p className={`${QuicksandFont.className} mt-1 text-xs text-inkMuted`}>
                {t("pricePerPerson")}
              </p>
            </div>
          ))}
        </div>

        {/*
          Что входит и что нет — рядом с ценой, а не отдельным разделом:
          вопрос «а что за эти деньги» возникает ровно в тот момент, когда
          человек увидел сумму.
        */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-tileTint/60 p-5">
            <h3 className={`${PoppinFont.className} text-base font-semibold text-tile`}>
              {t("priceIncluded")}
            </h3>
            <ul className={`${QuicksandFont.className} mt-3 space-y-2`}>
              {included.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-ink">
                  <LuCheck className="mt-0.5 h-4 w-4 shrink-0 text-tile" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-sandLight p-5">
            <h3 className={`${PoppinFont.className} text-base font-semibold text-ink`}>
              {t("priceExcluded")}
            </h3>
            <ul className={`${QuicksandFont.className} mt-3 space-y-2`}>
              {excluded.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-inkMuted">
                  <LuX className="mt-0.5 h-4 w-4 shrink-0 text-brick" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className={`${QuicksandFont.className} text-xs text-inkMuted`}>
            {t("priceNote")}
          </p>
          <Link
            href="/tours"
            className={`${PoppinFont.className} shrink-0 rounded-full bg-tile px-6 py-2.5 text-center text-sm text-white transition-colors hover:bg-tileDark`}
          >
            {t("priceCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
