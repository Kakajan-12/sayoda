import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BlogsCards from "@/Components/MainComonents/BlogsCards";
import Explore from "@/Components/MainComonents/Explore";
import MainSwiper from "@/Components/MainComonents/MainSwiper";
import PopularCards from "@/Components/MainComonents/PopularCards";
import { Link } from "@/i18n/navigation";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";
import { SITE_NAME, alternatesFor } from "@/lib/site";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  const alternates = alternatesFor(locale);

  return {
    title: t("home.title"),
    description: t("home.description"),
    alternates,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale,
      url: alternates.canonical,
      title: t("home.title"),
      description: t("home.description"),
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

  /**
   * Единственный h1 страницы. Рендерится на сервере и передаётся в клиентский
   * MainSwiper пропсом — раньше на первом экране не было ни одного заголовка,
   * и ни человек, ни краулер не понимали, что здесь продают.
   */
  const heading = (
    <div className="absolute inset-x-0 top-1/4 z-30 px-4 sm:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1
          className={`${PoppinFont.className} text-white text-2xl sm:text-4xl xl:text-5xl font-bold leading-tight drop-shadow-lg`}
        >
          {t("h1")}
        </h1>
        <p
          className={`${QuicksandFont.className} mt-4 text-white/90 text-sm sm:text-base xl:text-lg drop-shadow-md`}
        >
          {t("subtitle")}
        </p>
        <Link
          href="/tours"
          className={`${PoppinFont.className} inline-block mt-6 rounded-full bg-mainBlue px-8 py-3 text-white text-sm sm:text-base hover:bg-mainBlue/85 transition-colors`}
        >
          {t("cta")}
        </Link>
      </div>
    </div>
  );

  return (
    <div>
      <MainSwiper heading={heading} />
      <Explore />
      <PopularCards />
      <BlogsCards />
    </div>
  );
}
