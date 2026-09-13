import { getTranslations } from "next-intl/server";
import { FaFileSignature, FaRoute, FaUserTie } from "react-icons/fa6";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";

/**
 * Зачем ехать через местного оператора.
 *
 * Страница «О нас» рассказывала, что компания хорошая, но не отвечала на
 * вопрос, ради которого её открывают: почему нельзя собрать поездку самому.
 * У Туркменистана ответ конкретный — приглашение, разрешения и гиды, — и он
 * стоит трёх абзацев, а не эпитетов.
 */
export default async function WhyLocal({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "About" });

  const titles = t.raw("whyCardTitle") as string[];
  const texts = t.raw("whyCardText") as string[];
  const icons = [FaFileSignature, FaRoute, FaUserTie];

  return (
    <section className="container mx-auto px-5 py-12 lg:py-16">
      <h2
        className={`${PoppinFont.className} text-2xl font-bold text-tile md:text-3xl`}
      >
        {t("whyTitle")}
      </h2>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {titles.map((title, i) => {
          const Icon = icons[i] ?? FaRoute;
          return (
            <div
              key={title}
              className="flex flex-col gap-3 rounded-xl bg-white px-5 py-6 ring-1 ring-sand"
            >
              <Icon aria-hidden className="h-6 w-6 shrink-0 text-tileMid" />
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
          );
        })}
      </div>
    </section>
  );
}
