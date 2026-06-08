import { BASE_API_URL } from "@/i18n/api";

export type VisaItem = {
  id: number;
  title_en: string;
  title_ru: string;
  title_tk: string;
  text_en: string;
  text_ru: string;
  text_tk: string;
};

export async function getVisaList(): Promise<VisaItem[]> {
  const res = await fetch(`${BASE_API_URL}/api/visa`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getVisaById(id: string): Promise<VisaItem | null> {
  const res = await fetch(`${BASE_API_URL}/api/visa/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "").trim();
}

export function getLocalizedVisaField<T extends VisaItem>(
  visa: T,
  locale: string,
  field: "title" | "text"
) {
  if (locale === "ru") return visa[`${field}_ru` as keyof T] as string;
  if (locale === "tk") return visa[`${field}_tk` as keyof T] as string;
  return visa[`${field}_en` as keyof T] as string;
}
