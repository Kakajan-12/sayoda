import React from "react";
import { getTranslations } from "next-intl/server";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";
import { faqField, getFaq } from "@/lib/api/faq";

/**
 * Частые вопросы.
 *
 * Два дела сразу: снимают возражения, из-за которых человек уходит не
 * написав (виза, безопасность, сроки, что входит в цену), и дают разметку
 * FAQPage — такие вопросы поиск показывает прямо в выдаче.
 *
 * Вопросы приходят из админки. Пустой список — блок не выводится вовсе:
 * заголовок «Частые вопросы» без вопросов выглядит как сломанная страница.
 *
 * Раскрытие сделано на <details>, а не на состоянии React: работает без
 * JavaScript, доступно с клавиатуры и не требует клиентского компонента.
 */
export default async function Faq({ locale }: { locale: string }) {
  const [t, items] = await Promise.all([
    getTranslations({ locale, namespace: "Faq" }),
    getFaq(),
  ]);

  // Вопрос без текста пропускаем: пустая строка в списке читается как сбой.
  const visible = items
    .map((item) => ({
      id: item.id,
      q: faqField(item, "question", locale),
      a: faqField(item, "answer", locale),
    }))
    .filter((item) => item.q);

  if (!visible.length) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: visible.map((item) => ({
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
        {visible.map((item) => (
          <details
            key={item.id}
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
            {item.a && (
              <p className="mt-3 text-sm/relaxed text-inkMuted md:text-base/relaxed">
                {item.a}
              </p>
            )}
          </details>
        ))}
      </div>
    </div>
  );
}
