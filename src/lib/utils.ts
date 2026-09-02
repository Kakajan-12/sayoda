import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    );
}

export function stripHtmlTags(value: string | undefined | null): string {
  if (value == null) return "";
  return decodeHtmlEntities(String(value).replace(/<[^>]*>/g, "").trim());
}

/**
 * Контент из админки приходит в HTML от TipTap и часто содержит переносы,
 * двойные пробелы и &nbsp;. Для <title>, meta description и JSON-LD нужен
 * плоский однострочный текст — этим и занимается plainText.
 */
export function plainText(value: string | undefined | null): string {
  return stripHtmlTags(value).replace(/\s+/g, " ").trim();
}

/**
 * Обрезает текст до limit символов по границе слова и добавляет многоточие.
 * Используется для meta description (рекомендуемая длина ~155 символов).
 */
export function excerpt(value: string | undefined | null, limit = 155): string {
  const text = plainText(value);
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
