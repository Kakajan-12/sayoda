import EmbassiesAbroadTable from "@/Components/Visa/EmbassiesAbroadTable";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  if (country !== "turkmenistan") notFound();

  return <EmbassiesAbroadTable locale={locale} />;
}
