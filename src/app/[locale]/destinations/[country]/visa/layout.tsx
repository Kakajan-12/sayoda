import { notFound } from "next/navigation";
import { getDestination } from "@/data/destinations";
import { getVisaList } from "@/api/getVisa";
import DestinationVisaSidebar from "@/Components/Destinations/DestinationVisaSidebar";

export default async function DestinationVisaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  const destination = getDestination(country);
  if (!destination) notFound();

  // Visa types come from the backend and currently describe Turkmenistan only.
  const visaList =
    country === "turkmenistan" ? await getVisaList() : [];

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="w-full lg:w-72 shrink-0">
        <DestinationVisaSidebar
          country={country}
          visaList={visaList}
          locale={locale}
        />
      </div>
      <main className="flex-1 min-w-0 w-full">{children}</main>
    </div>
  );
}
