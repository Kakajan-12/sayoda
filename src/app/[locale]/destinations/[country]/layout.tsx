import { notFound } from "next/navigation";
import {
  destField,
  destImage,
  getDestinationBySlug,
  getDestinations,
} from "@/lib/api/destinations";
import { PoppinFont } from "@/components/ui/Fonts";
import DestinationTabs from "@/components/destinations/DestinationTabs";
import { CONTENT_ANCHOR } from "@/components/destinations/useTabScroll";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 300;

/**
 * Список стран для построения страниц заранее.
 *
 * Без него сегмент [country] неизвестен на сборке, и все разделы направления
 * помечались в выводе как динамические: каждый визит шёл мимо кэша прямо на
 * сервер. Макет сегмента вправе задавать параметр своего уровня — дочерние
 * страницы разделов достраиваются по нему.
 *
 * Ошибку запроса глушим намеренно: недоступный на момент сборки API не должен
 * ронять весь деплой. Тогда список окажется пустым, страницы построятся при
 * первом обращении и дальше будут отдаваться из кэша — dynamicParams это
 * разрешает по умолчанию.
 */
export async function generateStaticParams() {
  try {
    const destinations = await getDestinations();
    return destinations
      .filter((destination) => destination.slug)
      .map((destination) => ({ country: destination.slug }));
  } catch {
    return [];
  }
}

export default async function DestinationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  setRequestLocale(locale);
  const destination = await getDestinationBySlug(country);
  if (!destination) notFound();

  const name = destField(destination, "name", locale);

  return (
    <div>
      {/* HERO */}
      <section className="relative w-full h-[320px] md:h-[600px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={destImage(destination.hero_image)}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="absolute inset-0 container mx-auto px-5 sm:px-10 flex flex-col justify-center">
          {/* Заголовок допускает <br/> для переноса, поэтому выводится разметкой */}
          <h1
            className={`${PoppinFont.className} text-3xl/snug sm:text-5xl/snug xl:text-6xl/snug font-bold text-white drop-shadow-lg`}
            dangerouslySetInnerHTML={{
              __html: destField(destination, "hero_title", locale),
            }}
          />
          <p className="mt-3 text-mainLight font-medium tracking-wide">
            {name} · Sayoda Travel
          </p>
        </div>
      </section>

      {/* TABS + CONTENT */}
      <div className="container mx-auto px-5 py-8 md:py-10">
        {/*
          Панель вкладок липкая — она сама держит свою обёртку и отступы, см.
          DestinationTabs. От неё отсчитывается всё, что ниже: боковые меню
          встают на 172 (104 панели + 60 её высоты + 8 просвета), по этой же
          линии считается подсветка разделов и якоря.
        */}
        <DestinationTabs slug={destination.slug} />

        {/*
          Якорь на случай, когда прокрутку обрезал браузер, см. useTabScroll.
          Он стоит здесь, а не на самой панели: у прилипшего элемента
          scrollIntoView считает, что он уже на месте, и не двигает страницу.
        */}
        <main id={CONTENT_ANCHOR} className="min-w-0 scroll-mt-[180px]">
          {children}
        </main>
      </div>
    </div>
  );
}
