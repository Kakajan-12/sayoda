import { notFound } from "next/navigation";
import { getDestinationBySlug } from "@/lib/api/destinations";
import DestinationVisaSidebar from "@/components/destinations/DestinationVisaSidebar";

export const revalidate = 300;

export default async function DestinationVisaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  const destination = await getDestinationBySlug(country);
  if (!destination) notFound();

  return (
    <div className="flex flex-col items-start gap-8 lg:flex-row">
      <div className="w-full lg:w-72 shrink-0">
        <DestinationVisaSidebar country={country} />
      </div>
      <main className="flex-1 min-w-0 w-full">{children}</main>
    </div>
  );
}
