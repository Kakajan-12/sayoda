import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";

/**
 * Что делать дальше.
 *
 * Страница кончалась пустым разделом отзывов, и человек, дочитавший до
 * конца, упирался в подвал. Здесь два очевидных шага — посмотреть туры или
 * написать.
 *
 * Про оплату здесь ничего нет и быть не должно: по решению заказчика сайт
 * условий оплаты не объясняет, их обсуждают в переписке. Раньше в тексте
 * стояло обещание подтвердить бронь без предоплаты — убрано вместе с
 * остальным про оплату.
 */
export default async function AboutCta({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "About" });

  return (
    <section className="container mx-auto px-5 py-12 lg:py-16">
      <div className="rounded-2xl bg-tile px-6 py-10 text-center text-white md:px-12 md:py-14">
        <h2
          className={`${PoppinFont.className} text-2xl font-bold md:text-3xl`}
        >
          {t("ctaTitle")}
        </h2>
        <p
          className={`${QuicksandFont.className} mx-auto mt-4 max-w-2xl text-sm/relaxed text-white/90 lg:text-base/relaxed`}
        >
          {t("ctaText")}
        </p>

        {/* На узких экранах кнопки во всю ширину, но не растягиваются на
            планшете: кнопка шириной в экран читается как полоса, а не как
            кнопка. Та же мера, что у пары кнопок на главной. */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/tours"
            className={`${PoppinFont.className} w-full max-w-xs rounded-md border-2 border-transparent bg-white px-6 py-3 text-center font-semibold text-tile transition-colors hover:bg-white/90 sm:w-auto sm:max-w-none`}
          >
            {t("ctaTours")}
          </Link>
          <Link
            href="/contacts"
            className={`${PoppinFont.className} w-full max-w-xs rounded-md border-2 border-white px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto sm:max-w-none`}
          >
            {t("ctaContact")}
          </Link>
        </div>
      </div>
    </section>
  );
}
