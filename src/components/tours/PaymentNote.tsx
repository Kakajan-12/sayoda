import { getTranslations } from "next-intl/server";
import { FaCreditCard, FaMoneyBillWave, FaRegCircleCheck } from "react-icons/fa6";
import { PoppinFont } from "@/components/ui/Fonts";

/**
 * Как проходит оплата.
 *
 * Блок стоит сразу за составом цены: человек только что прочитал, что
 * входит в тур, и следующий его вопрос — когда и чем платить.
 *
 * Три вещи, которые турист иначе узнаёт уже в аэропорту Ашхабада:
 * предоплаты нет, иностранные карты в стране не принимают, и купюры
 * нужны новой серии без повреждений. Последнее звучит мелочью ровно до
 * того момента, когда в обменнике не берут половину привезённых денег.
 *
 * Раньше сайт вместо этого обещал онлайн-оплату, которой не существует.
 *
 * Два последних пункта — только для Туркменистана. В Казахстане и
 * Узбекистане карты принимают, и предупреждение о них там было бы
 * враньём в обратную сторону. Отсутствие предоплаты — общее правило
 * компании и остаётся на всех турах.
 */
export default async function PaymentNote({
  locale,
  country,
}: {
  locale: string;
  /** Страна тура как есть из базы — сравниваем без учёта регистра. */
  country: string;
}) {
  const t = await getTranslations({ locale, namespace: "TourPerPage.payment" });

  const inTurkmenistan = country.trim().toLowerCase() === "turkmenistan";

  const points = [
    { icon: FaRegCircleCheck, title: t("noDepositTitle"), text: t("noDepositText") },
    ...(inTurkmenistan
      ? [
          { icon: FaMoneyBillWave, title: t("cashTitle"), text: t("cashText") },
          { icon: FaCreditCard, title: t("billsTitle"), text: t("billsText") },
        ]
      : []),
  ];

  return (
    <section className="container mx-auto px-4 py-12 lg:py-16">
      <h2
        className={`${PoppinFont.className} text-2xl font-bold text-tile md:text-3xl 2xl:text-4xl`}
      >
        {t("title")}
      </h2>

      <p className="mt-4 max-w-3xl text-sm/relaxed text-inkMuted lg:text-base/relaxed">
        {t("lead")}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {points.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="flex flex-col gap-3 rounded-xl bg-white px-5 py-6 ring-1 ring-sand"
          >
            <Icon aria-hidden className="h-6 w-6 shrink-0 text-tileMid" />
            <h3 className="text-base font-semibold text-tile lg:text-lg">
              {title}
            </h3>
            <p className="text-sm/relaxed text-inkMuted lg:text-base/relaxed">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
