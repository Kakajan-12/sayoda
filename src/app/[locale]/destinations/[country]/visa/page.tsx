import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { destField, getDestinationBySlug } from "@/lib/api/destinations";
import { ComfortaFont } from "@/components/ui/Fonts";
import GeneralInfoSidebar from "@/components/destinations/GeneralInfoSidebar";
import EmbassiesAbroadTable from "@/components/destinations/EmbassiesAbroadTable";

export const revalidate = 300;

/**
 * Визовый раздел страны — одной страницей.
 *
 * Раньше это были четыре отдельные страницы, и боковое меню работало не так,
 * как точно такое же меню на «Общей информации»: там переходы по якорям внутри
 * одного текста, здесь — переходы между маршрутами. Разделы короткие: у
 * «Пересечения границ» один абзац, и ради него человек ждал загрузку страницы.
 * Теперь всё лежит подряд, меню ведёт по якорям и подсвечивает раздел, дошедший
 * до верха, — как и на соседней вкладке.
 *
 * Подробности по посольствам и границам собраны только по Туркменистану,
 * поэтому у остальных стран остаётся один раздел — и меню им не нужно.
 */
export default async function VisaPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  const destination = await getDestinationBySlug(country);
  if (!destination) notFound();

  const t = await getTranslations({ locale, namespace: "Visa" });
  const td = await getTranslations({ locale, namespace: "Destinations" });

  const isTurkmenistan = country === "turkmenistan";

  // Ключи совпадают с прежними адресами подстраниц: по ним же настроены
  // переадресации со старых ссылок, см. next.config.
  const links = [
    { id: "visa", icon: "visa", label: td("tabVisa") },
    ...(isTurkmenistan
      ? [
          {
            id: "embassies-in-turkmenistan",
            icon: "embassy",
            label: t("embassiesIn"),
          },
          { id: "embassies-abroad", icon: "globe", label: t("embassiesAbroad") },
          { id: "crossing-borders", icon: "border", label: t("crossingBorders") },
        ]
      : []),
  ];

  const heading =
    "text-xl sm:text-2xl font-bold text-mainBlue break-words border-b-2 border-mainBlue pb-2 mb-6";

  return (
    <div className="flex flex-col items-start gap-8 lg:flex-row">
      {/* Меню из одного пункта ничего не даёт — оно только отнимает колонку. */}
      {links.length > 1 && (
        <div className="sticky top-32 w-full shrink-0 lg:w-72">
          <GeneralInfoSidebar links={links} />
        </div>
      )}

      <article className={`w-full min-w-0 flex-1 ${ComfortaFont.className}`}>
        <section id="visa" className="mb-12 scroll-mt-36">
          <h2 className={heading}>
            {td("tabVisa")} — {destField(destination, "name", locale)}
          </h2>
          <div
            className="rich-content space-y-4 leading-relaxed text-gray-700 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6"
            dangerouslySetInnerHTML={{
              __html: destField(destination, "visa", locale),
            }}
          />
        </section>

        {isTurkmenistan && (
          <>
            <section
              id="embassies-in-turkmenistan"
              className="mb-12 scroll-mt-36"
            >
              <h2 className={heading}>{t("embassiesIn")}</h2>
              <p className="leading-relaxed text-gray-700">
                {t("embassiesInText")}
              </p>
            </section>

            {/* Свой заголовок таблица печатает сама. */}
            <section id="embassies-abroad" className="mb-12 scroll-mt-36">
              <EmbassiesAbroadTable locale={locale} />
            </section>

            <section id="crossing-borders" className="mb-12 scroll-mt-36">
              <h2 className={heading}>{t("crossingBorders")}</h2>
              <p className="leading-relaxed text-gray-700">
                {t("crossingBordersText")}
              </p>
            </section>
          </>
        )}
      </article>
    </div>
  );
}
