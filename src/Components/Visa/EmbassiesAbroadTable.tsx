import { getTranslations } from "next-intl/server";
import { embassiesAbroad, type EmbassyAbroad } from "@/data/embassiesAbroad";
import { PoppinFont } from "@/Ui/Fonts";

type Props = {
  locale: string;
};

function getLocalizedField(
  embassy: EmbassyAbroad,
  locale: string,
  field: "name" | "head" | "position" | "address"
) {
  if (locale === "ru") return embassy[`${field}_ru`];
  if (locale === "tk") return embassy[`${field}_tk`];
  return embassy[`${field}_en`];
}

export default async function EmbassiesAbroadTable({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "Visa" });

  return (
    <div className={PoppinFont.className}>
      <h2 className="text-2xl font-bold text-mainBlue border-b-2 border-mainBlue pb-2 mb-6">
        {t("embassiesAbroad")}
      </h2>

      <div className="overflow-x-auto">
        <table className="visa-table w-full min-w-[720px] text-sm">
          <thead>
            <tr>
              <th className="w-12">№</th>
              <th>{t("institutionName")}</th>
              <th className="w-36">{t("head")}</th>
              <th className="w-44">{t("position")}</th>
              <th className="w-64">{t("contactInfo")}</th>
            </tr>
          </thead>
          <tbody>
            {embassiesAbroad.map((embassy, index) => (
              <tr key={embassy.id}>
                <td>{index + 1}</td>
                <td>{getLocalizedField(embassy, locale, "name")}</td>
                <td>{getLocalizedField(embassy, locale, "head")}</td>
                <td>{getLocalizedField(embassy, locale, "position")}</td>
                <td>
                  <p>{getLocalizedField(embassy, locale, "address")}</p>
                  <p className="mt-1">{embassy.phone}</p>
                  <a
                    href={`mailto:${embassy.email}`}
                    className="text-mainBlue hover:underline mt-1 inline-block"
                  >
                    {embassy.email}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
