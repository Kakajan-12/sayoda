import { notFound } from "next/navigation";
import { destField, destImage, getDestinationBySlug } from "@/lib/api/destinations";
import { ComfortaFont } from "@/components/ui/Fonts";
import GeneralInfoSidebar from "@/components/destinations/GeneralInfoSidebar";

export const revalidate = 300;

export default async function GeneralInformationPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  const destination = await getDestinationBySlug(country);
  if (!destination) notFound();

  // section_key служит и якорем, и ключом бокового меню — как раньше поле id
  const links = destination.sections.map((s) => ({
    id: s.section_key,
    icon: s.icon || "",
    label: destField(s, "title", locale),
  }));

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="w-full lg:w-72 shrink-0 sticky top-32">
        <GeneralInfoSidebar links={links} />
      </div>

      <article className={`flex-1 min-w-0 w-full ${ComfortaFont.className}`}>
        <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-10">
          {destField(destination, "intro", locale)}
        </p>

        {destination.sections.map((section) => (
          <section
            key={section.id}
            id={section.section_key}
            className="scroll-mt-36 mb-12"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-mainBlue break-words border-b-2 border-mainBlue pb-2 mb-5">
              {destField(section, "title", locale)}
            </h2>
            <div
              className="rich-content text-gray-700 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{
                __html: destField(section, "body", locale),
              }}
            />
            {section.images && section.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {section.images.map((img, i) => (
                  <figure key={i} className="flex flex-col gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={destImage(img.src)}
                      alt={destField(img, "caption", locale)}
                      className="w-full h-62 object-cover rounded-xl shadow-sm"
                    />
                    <figcaption className="text-sm text-gray-600 text-left underline underline-offset-8">
                      {destField(img, "caption", locale)}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </section>
        ))}
      </article>
    </div>
  );
}
