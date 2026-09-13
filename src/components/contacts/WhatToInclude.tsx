import { getTranslations } from "next-intl/server";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";

/**
 * Что написать в заявке.
 *
 * Переписка с туристом почти всегда начинается с одних и тех же четырёх
 * уточнений: даты, сколько человек, что хотят увидеть, гражданство — от
 * последнего зависит приглашение. Каждый такой круг — сутки ожидания на
 * разнице часовых поясов, поэтому список стоит прямо над формой.
 */
export default async function WhatToInclude({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "ContactUs" });
  const items = t.raw("includeItems") as string[];

  return (
    <section className="w-full bg-tileTint py-10 lg:py-14">
      <div className="container mx-auto px-5">
        <h2
          className={`${PoppinFont.className} text-2xl font-bold text-tile md:text-3xl`}
        >
          {t("includeTitle")}
        </h2>
        <p
          className={`${QuicksandFont.className} mt-3 max-w-3xl text-sm/relaxed text-inkMuted lg:text-base/relaxed`}
        >
          {t("includeText")}
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <IoMdCheckmarkCircleOutline
                aria-hidden
                className="mt-0.5 h-5 w-5 shrink-0 text-tileMid"
              />
              <span
                className={`${QuicksandFont.className} text-sm/relaxed text-inkMuted lg:text-base/relaxed`}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
