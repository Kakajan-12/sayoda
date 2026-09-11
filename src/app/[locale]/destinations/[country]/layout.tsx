import { notFound } from "next/navigation";
import { destField, destImage, getDestinationBySlug } from "@/lib/api/destinations";
import { PoppinFont } from "@/components/ui/Fonts";
import DestinationTabs from "@/components/destinations/DestinationTabs";
import { CONTENT_ANCHOR } from "@/components/destinations/useTabScroll";

export const revalidate = 300;

export default async function DestinationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
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
          Панель вкладок липкая.

          Пока каждое переключение отматывало страницу наверх, она всегда была
          на виду. Теперь экран остаётся на месте, и непристёгнутая панель
          уезжала под шапку: на отметке 588 она стояла на 84 пикселях, а шапка
          занимает первые 96 — верх обрезался, а ниже по странице вкладки
          пропадали совсем, и чтобы перейти в соседний раздел, приходилось
          отматывать обратно к началу.

          Отступ повторяет высоту шапки: 96 пикселей от sm и выше, 80 на узких
          экранах, где логотип мельче (h-20 против h-16 плюс padding).

          z-30 — ниже шапки (z-40), выше содержимого.
        */}
        <div className="sticky top-20 z-30 -mt-14 mb-8 sm:top-24 md:-mt-16">
          <DestinationTabs slug={destination.slug} />
        </div>

        {/*
          Якорь на случай, когда прокрутку обрезал браузер, см. useTabScroll.
          Он стоит здесь, а не на самой панели: у прилипшего элемента
          scrollIntoView считает, что он уже на месте, и не двигает страницу.
        */}
        <main id={CONTENT_ANCHOR} className="min-w-0 scroll-mt-44">
          {children}
        </main>
      </div>
    </div>
  );
}
