import EmbassiesAbroadTable from "@/Components/Visa/EmbassiesAbroadTable";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <EmbassiesAbroadTable locale={locale} />;
}
