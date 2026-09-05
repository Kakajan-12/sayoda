import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BlogsCards from "@/Components/MainComonents/BlogsCards";
import Explore from "@/Components/MainComonents/Explore";
import Faq from "@/Components/MainComonents/Faq";
import HomeLeadForm from "@/Components/MainComonents/HomeLeadForm";
import MainSwiper from "@/Components/MainComonents/MainSwiper";
import PopularCards from "@/Components/MainComonents/PopularCards";
import TrustStrip from "@/Components/MainComonents/TrustStrip";
import VisaTeaser from "@/Components/MainComonents/VisaTeaser";
import HowToWork from "@/Components/AboutUs/HowToWork";
import Testimonials from "@/Components/AboutUs/Testimonials";
import WhyChoose from "@/Components/AboutUs/WhyChoose";
import { Link } from "@/i18n/navigation";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";
import { SITE_NAME, alternatesFor } from "@/lib/site";
import { getBlogs, getTours } from "@/lib/api/catalog";
import { bannerField, bannerImage, getBanner } from "@/lib/api/banner";
import { routing } from "@/i18n/routing";

// Литерал обязателен: конфиг сегмента разбирается статически.
export const revalidate = 300;

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
    /*
     * Заголовок занимает полосу между шапкой и карточками стран и центрируется
     * в ней. Раньше блок начинался на четверти высоты и рос вниз: на узком
     * экране заголовок переносился на четыре строки, подзаголовок на пять, и
     * кнопка «смотреть туры» уезжала прямо на карточки. Верхний отступ — под
     * полупрозрачную шапку, нижний — под карточки, которые наполовину
     * свисают из секции.
     */
    <div className="absolute inset-x-0 top-20 bottom-28 z-30 flex items-center px-4 sm:top-24 sm:bottom-40 sm:px-8 lg:bottom-44 lg:px-16">
      <div className="mx-auto max-w-4xl text-center">
        {/* Межстрочное задаётся через text-<размер>/<интерлиньяж>, а не
            отдельным leading-*. Утилиты размера в Tailwind несут собственный
            line-height (у text-5xl это 1), и адаптивный xl:text-5xl перебивал
            безпрефиксный leading-*: строки шли с интерлиньяжем 1.0 и слипались.
            text-balance выравнивает длину строк при переносе. */}
        <h1
          className={`${PoppinFont.className} text-white text-xl/snug dort:text-2xl/snug sm:text-4xl/snug xl:text-5xl/snug font-bold text-balance drop-shadow-lg`}
        >
          {bannerTitle}
        </h1>
        <p
          className={`${QuicksandFont.className} mt-3 text-white/90 text-sm sm:mt-4 sm:text-base xl:text-lg drop-shadow-md`}
        >
          {bannerSubtitle}
        </p>
        <Link
          href={bannerLink}
          className={`${PoppinFont.className} inline-block mt-5 rounded-full bg-mainBlue px-6 py-2.5 sm:mt-6 sm:px-8 sm:py-3 text-white text-sm sm:text-base hover:bg-mainBlue/85 transition-colors`}
        >
          {bannerButton}
        </Link>
      </div>
    </div>
  );

  /**
   * Порядок блоков — это порядок разговора с туристом: чем вы занимаетесь,
   * что можно купить, почему вам можно верить, как это устроено, что с визой,
   * что говорят другие, ответы на страхи — и только потом форма.
   *
   * Раньше страница обрывалась на блоге: человек долистывал до конца и
   * оставить заявку мог, только догадавшись уйти в «Контакты».
   */
  return (
    <div>
      <MainSwiper heading={heading} backgroundImage={bannerImage(banner)} />
      <TrustStrip locale={locale} />
      <Explore />
      <PopularCards tours={popularTours} />
      <WhyChoose />
      <HowToWork />
      <VisaTeaser locale={locale} />
      <Testimonials />
      <BlogsCards blogs={blogs} />
      <Faq locale={locale} />
      <HomeLeadForm />
    </div>
  );
}
