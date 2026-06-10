import { getLocalizedVisaField, getVisaById } from "@/api/getVisa";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const visa = await getVisaById(id);

  if (!visa) notFound();

  const title = getLocalizedVisaField(visa, locale, "title");
  const text = getLocalizedVisaField(visa, locale, "text");

  return (
    <>
      <h2
        className="text-2xl font-bold text-mainBlue border-b-2 border-mainBlue pb-2 mb-6"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <div className="rich-content" dangerouslySetInnerHTML={{ __html: text }} />
    </>
  );
}
