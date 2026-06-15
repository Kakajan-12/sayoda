import { notFound } from "next/navigation";
import { getDestination, localize } from "@/data/destinations";
import { PoppinFont } from "@/Ui/Fonts";
import DestinationTabs from "@/Components/Destinations/DestinationTabs";

export default async function DestinationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  const destination = getDestination(country);
  if (!destination) notFound();

  return (
    <div>
      {/* HERO */}
      <section className="relative w-full h-[320px] md:h-[600px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={destination.heroImage}
          alt={localize(destination.name, locale)}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="absolute inset-0 container mx-auto px-5 sm:px-10 flex flex-col justify-center">
          <h1
            className={`${PoppinFont.className} text-3xl sm:text-5xl xl:text-6xl font-bold text-white drop-shadow-lg`}
            dangerouslySetInnerHTML={{
              __html: localize(destination.heroTitle, locale),
            }}
          />
          <p className="mt-3 text-mainLight font-medium tracking-wide">
            {localize(destination.name, locale)} · Sayoda Travel
          </p>
        </div>
      </section>

      {/* TABS + CONTENT */}
      <div className="container mx-auto px-5 py-8 md:py-10">
        <div className="-mt-14 md:-mt-16 relative z-10 mb-8">
          <DestinationTabs slug={destination.slug} />
        </div>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
