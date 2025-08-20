import { BASE_API_URL } from "@/i18n/api";

async function getVisaData(id: string) {
    const res = await fetch(`${BASE_API_URL}/api/visa/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Не удалось загрузить данные");
    return res.json();
}

export default async function Page({ params }: any) {
    const { id, locale } = params;

    const data = await getVisaData(id);
    const visa = Array.isArray(data) ? data[0] : data;

    const title =
        locale === "ru"
            ? visa.title_ru
            : locale === "tk"
                ? visa.title_tk
                : visa.title_en;

    const text =
        locale === "ru"
            ? visa.text_ru
            : locale === "tk"
                ? visa.text_tk
                : visa.text_en;

    return (
        <div className="container mx-auto px-5 py-10">
            <h1 className="text-2xl font-bold mb-6" dangerouslySetInnerHTML={{ __html: title }} />
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: text }} />
        </div>
    );
}
