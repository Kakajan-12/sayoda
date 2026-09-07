import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import ConsentReset from "@/components/layout/ConsentReset";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";
import { SITE_NAME, alternatesFor } from "@/lib/site";
import { getContacts } from "@/lib/api/contacts";
import { getSettings } from "@/lib/api/settings";
import { routing } from "@/i18n/routing";

// Литерал обязателен: конфиг сегмента разбирается статически.
export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });
  const alternates = alternatesFor(locale, "privacy");

  return {
    title: t("title"),
    description: t("intro"),
    alternates,
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      locale,
      url: alternates.canonical,
      title: t("title"),
      description: t("intro"),
    },
    // Страница нужна людям и юридически, но в выдаче ей делать нечего:
    // она перебивает по релевантности собственные страницы туров.
    robots: { index: false, follow: true },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });
  const nav = await getTranslations({ locale, namespace: "Header" });

  const [settings, contacts] = await Promise.all([
    getSettings(),
    getContacts(locale),
  ]);

  /*
   * Юридическое название приходит из админки. Пока поле пустое, подставляем
   * торговое имя: выдумывать реквизиты нельзя, а страница должна работать
   * и до того, как заказчик их заполнит.
   */
  const company = settings.company_legal_name?.trim() || SITE_NAME;
  const license = settings.license_number?.trim() || null;
  const email = contacts.email?.trim() || "info@sayodatravel.com";

  const sections = [
    { title: t("controllerTitle"), body: [t("controllerText", { company, email })] },
    {
      title: t("dataTitle"),
      body: [t("dataForms"), t("dataAnalytics"), t("dataChat")],
    },
    {
      title: t("cookiesTitle"),
      body: [t("cookiesGa"), t("cookiesTawk"), t("cookiesOwn")],
    },
    { title: t("sharingTitle"), body: [t("sharingText")] },
    { title: t("retentionTitle"), body: [t("retentionText")] },
    { title: t("rightsTitle"), body: [t("rightsText")] },
  ];

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: nav("main"), path: "" },
          { name: t("title"), path: "privacy" },
        ]}
      />

      <div className="bg-paper py-12 md:py-16">
        <div className="container mx-auto max-w-3xl px-5">
          <h1
            className={`${PoppinFont.className} text-2xl font-bold text-ink md:text-3xl`}
          >
            {t("title")}
          </h1>
          <p
            className={`${QuicksandFont.className} mt-3 text-sm/relaxed text-inkMuted md:text-base/relaxed`}
          >
            {t("intro")}
          </p>

          {license && (
            <p
              className={`${QuicksandFont.className} mt-2 text-sm text-inkMuted`}
            >
              {t("licenseLine", { license })}
            </p>
          )}

          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2
                  className={`${PoppinFont.className} text-lg font-bold text-ink`}
                >
                  {section.title}
                </h2>
                <div
                  className={`${QuicksandFont.className} mt-3 space-y-3 text-sm/relaxed text-inkMuted md:text-base/relaxed`}
                >
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-lg bg-tileTint p-5">
            <h2 className={`${PoppinFont.className} text-lg font-bold text-ink`}>
              {t("changeTitle")}
            </h2>
            <p
              className={`${QuicksandFont.className} mt-2 text-sm/relaxed text-inkMuted`}
            >
              {t("changeText")}
            </p>
            <ConsentReset
              label={t("changeButton")}
              doneLabel={t("changeDone")}
            />
          </div>

          <p
            className={`${QuicksandFont.className} mt-8 text-sm/relaxed text-inkMuted`}
          >
            {t("notice")}
          </p>
        </div>
      </div>
    </>
  );
}
