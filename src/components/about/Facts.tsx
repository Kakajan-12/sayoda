import { getTranslations } from "next-intl/server";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";
import { getSettings } from "@/lib/api/settings";
import { languageNames } from "@/lib/languages";

/**
 * Факты о компании: год, команда, туристы, языки гидов, лицензия.
 *
 * СЕЙЧАС НЕ ВЫВОДИТСЯ. Снят со страницы «О нас» по просьбе заказчика,
 * компонент оставлен целиком: вернуть — строкой <Facts locale={locale} />
 * в src/app/[locale]/about/page.tsx. Настройки team_size и
 * travellers_served, кроме него, нигде не используются.
 *
 * Значения берутся из настроек админки, а не из текстов сайта. Год, число
 * туристов и состав команды меняются, и это не повод звать разработчика.
 * По той же причине здесь нет ни одного числа в коде.
 *
 * Незаполненный факт не выводится вовсе. «Принято туристов: —» хуже, чем
 * отсутствие строки: пустое место читается как «нечем похвастаться», а
 * прочерк — как сломанная страница. Если не заполнено ничего, пропадает и
 * весь раздел.
 */
export default async function Facts({ locale }: { locale: string }) {
  const [t, settings] = await Promise.all([
    getTranslations({ locale, namespace: "About" }),
    getSettings(),
  ]);

  const languages = languageNames(settings.guide_languages, locale);

  const facts = [
    { label: t("factSince"), value: settings.founded_year },
    { label: t("factTeam"), value: settings.team_size },
    { label: t("factTravellers"), value: settings.travellers_served },
    { label: t("factLanguages"), value: languages.join(", ") },
    { label: t("factLicence"), value: settings.license_number },
  ].filter((fact) => Boolean(fact.value && String(fact.value).trim()));

  if (!facts.length) return null;

  return (
    <section className="w-full bg-tileTint py-12 lg:py-16">
      <div className="container mx-auto px-5">
        <h2
          className={`${PoppinFont.className} text-2xl font-bold text-tile md:text-3xl`}
        >
          {t("factsTitle")}
        </h2>

        <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-xl bg-white px-5 py-6 ring-1 ring-sand"
            >
              {/* Значение крупнее подписи: с него читают, подпись уточняет. */}
              <dd
                className={`${PoppinFont.className} text-2xl font-bold text-tileMid lg:text-3xl`}
              >
                {fact.value}
              </dd>
              <dt
                className={`${QuicksandFont.className} mt-1 text-sm text-inkMuted lg:text-base`}
              >
                {fact.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
