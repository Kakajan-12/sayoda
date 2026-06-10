import VisaSidebar from "@/Components/Visa/VisaSidebar";
import { getVisaList } from "@/api/getVisa";

export default async function VisaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const visaList = await getVisaList();

  return (
    <div className="container mx-auto px-5 py-10">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-72 shrink-0 lg:self-stretch">
          <VisaSidebar visaList={visaList} locale={locale} />
        </div>
        <main className="flex-1 min-w-0 w-full">{children}</main>
      </div>
    </div>
  );
}
