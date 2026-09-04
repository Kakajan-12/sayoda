import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BlogsCards from "@/Components/MainComonents/BlogsCards";
import Explore from "@/Components/MainComonents/Explore";
import MainSwiper from "@/Components/MainComonents/MainSwiper";
import PopularCards from "@/Components/MainComonents/PopularCards";
import { Link } from "@/i18n/navigation";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";
import { SITE_NAME, alternatesFor } from "@/lib/site";
import { getBlogs, getTours } from "@/lib/api/catalog";
import { bannerField, bannerImage, getBanner } from "@/lib/api/banner";
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

  // Популярные туры и статьи читаем на сервере: раньше оба блока грузились
  // в useEffect, и главная отдавалась без единой ссылки на тур или статью.
  const [tours, blogs, banner] = await Promise.all([
    getTours(),
    getBlogs(),
    getBanner(),
  ]);
  const popularTours = tours.filter((tour) => tour.popular === 1);

  // Тексты баннера приходят из админки. Значения из локализации остаются
  // запасным вариантом: пустое поле или недоступный API не должны оставлять
  // первый экран без заголовка.
  const bannerTitle = bannerField(banner, "title", locale) || t("h1");
  const bannerSubtitle = bannerField(banner, "subtitle", locale) || t("subtitle");
  const bannerButton = bannerField(banner, "button_text", locale) || t("cta");
  const bannerLink = banner.button_link?.trim() || "/tours";

  /**
   * Единственный h1 страницы. Рендерится на сервере и передаётся в клиентский
   * MainSwiper пропсом — раньше на первом экране не было ни одного заголовка,
   * и ни человек, ни краулер не понимали, что здесь продают.
   */
  const heading = (
    <div className="absolute inset-x-0 top-1/4 z-30 px-4 sm:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto text-center">
        {/* Межстрочное задаётся через text-<размер>/<интерлиньяж>, а не
            отдельным leading-*. Утилиты размера в Tailwind несут собственный
            line-height (у text-5xl это 1), и адаптивный xl:text-5xl перебивал
            безпрефиксный leading-*: строки шли с интерлиньяжем 1.0 и слипались.
            text-balance выравнивает длину строк при переносе. */}
        <h1
          className={`${PoppinFont.className} text-white text-2xl/snug sm:text-4xl/snug xl:text-5xl/snug font-bold text-balance drop-shadow-lg`}
        >
          {bannerTitle}
        </h1>
        <p
          className={`${QuicksandFont.className} mt-4 text-white/90 text-sm sm:text-base xl:text-lg drop-shadow-md`}
        >
          {bannerSubtitle}
        </p>
        <Link
          href={bannerLink}
          className={`${PoppinFont.className} inline-block mt-6 rounded-full bg-mainBlue px-8 py-3 text-white text-sm sm:text-base hover:bg-mainBlue/85 transition-colors`}
        >
          {bannerButton}
        </Link>
      </div>
    </div>
  );

  return (
    <div>
      <MainSwiper heading={heading} backgroundImage={bannerImage(banner)} />
      <Explore />
      <PopularCards tours={popularTours} />
      <BlogsCards blogs={blogs} />
    </div>
  );
}
