import React from "react";
import { getTranslations } from "next-intl/server";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";

interface FaqItem {
  q: string;
  a: string;
}

/**
 * Частые вопросы.
 *
 * Два дела сразу: снимает возражения, из-за которых человек уходит не написав
 * (виза, безопасность, сроки, что входит в цену), и даёт разметку FAQPage —
 * такие вопросы поиск показывает прямо в выдаче.
 *
 * Раскрытие сделано на <details>, а не на состоянии React: работает без
 * JavaScript, доступно с клавиатуры и не требует клиентского компонента.
 */
export default async function Faq({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Faq" });
  const items = t.raw("items") as FaqItem[];

  if (!Array.isArray(items) || !items.length) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="container mx-auto px-5 py-10 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h2
        className={`${PoppinFont.className} mb-8 font-bold text-xl md:text-2xl xl:text-3xl`}
      >
        {t("title")}
      </h2>

      <div
        className={`${QuicksandFont.className} mx-auto flex max-w-3xl flex-col gap-3`}
      >
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-lg border border-sand bg-white px-5 py-4 open:shadow-sm"
          >
            <summary
              className={`${PoppinFont.className} flex cursor-pointer list-none items-start justify-between gap-4 text-base/snug font-semibold text-ink md:text-lg/snug`}
            >
              {item.q}
              {/* Плюс превращается в минус поворотом: одна фигура вместо
                  двух иконок, и состояние читается без подписи. */}
              <span
                aria-hidden
                className="mt-1 shrink-0 text-xl leading-none text-tileMid transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm/relaxed text-inkMuted md:text-base/relaxed">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
