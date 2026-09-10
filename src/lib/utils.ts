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

/**
 * Теги, которые в тексте означают границу — конец строки или абзаца.
 *
 * Всё остальное (<strong>, <em>, <a>) стоит внутри фразы и может делить
 * слово пополам, поэтому такие теги убираются без следа.
 */
const BLOCK_TAG =
  /<\/?(?:p|div|br|li|ul|ol|h[1-6]|tr|td|th|table|thead|tbody|blockquote|section|article|figure|figcaption|pre)\b[^>]*>/gi;

/**
 * Снимает разметку, сохраняя границы между абзацами.
 *
 * Раньше все теги вырезались в пустоту, и соседние абзацы склеивались:
 * <p>…Entertainment Centre.</p><p>Explore…</p> превращалось в
 * «Centre.Explore». Видно это было везде, где текст из редактора идёт
 * в служебные поля — meta description, <title>, og:description,
 * структурированные данные, — то есть ровно там, где текст читает
 * не человек, а машина, и пожаловаться некому.
 *
 * Заодно из-за этого не работала обрезка по границе предложения: точка
 * без пробела после неё границей не считается, иначе под нож попали бы
 * сокращения вроде «г.» и десятичные дроби.
 */
export function stripHtmlTags(value: string | undefined | null): string {
  if (value == null) return "";
  const text = String(value)
    .replace(BLOCK_TAG, " ")
    .replace(/<[^>]*>/g, "");
  return decodeHtmlEntities(text).trim();
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

/**
 * Обрезает текст по границе предложения — для описаний в JSON-LD.
 *
 * excerpt режет по слову и ставит многоточие: для meta description это
 * правильно, там важно уложиться в ~155 символов, и обрыв виден в выдаче
 * как обычное сокращение. В структурированных данных описание читает
 * машина, и фраза, оборванная на полуслове многоточием, выглядит
 * повреждённой.
 *
 * Отдельная функция, а не правка excerpt: если резать по предложению
 * везде, meta description иногда схлопнется до первой короткой фразы —
 * то есть станет заметно короче рекомендованной длины, и в выдаче
 * останется пустое место.
 *
 * Если ни одной точки в пределах лимита нет (сплошной текст без
 * знаков), отступаем к обрезке по слову: лучше многоточие, чем пусто.
 *
 * Порог — абсолютная длина, а не доля от лимита. С долей описание тура,
 * где первая фраза короткая, а вторая на двести с лишним символов,
 * скатывалось обратно к многоточию: единственная точка не дотягивала до
 * 40% лимита. Осмысленности фразы это не отменяет — «Embark on an
 * exciting six-day journey through Turkmenistan with the Classic Tour!»
 * лучше того же текста, оборванного на «that has been…».
 */
const MIN_SENTENCE_LENGTH = 60;

export function sentenceExcerpt(
  value: string | undefined | null,
  limit = 300,
): string {
  const text = plainText(value);
  if (text.length <= limit) return text;

  const cut = text.slice(0, limit);
  // Ищем последний знак конца предложения, за которым идёт пробел или
  // конец куска. Без проверки следующего символа под нож попадали бы
  // сокращения и десятичные дроби внутри фразы.
  let end = -1;
  for (let i = cut.length - 1; i >= 0; i -= 1) {
    if (!'.!?…'.includes(cut[i])) continue;
    const next = cut[i + 1];
    if (next === undefined || next === ' ') {
      end = i;
      break;
    }
  }

  // Слишком ранняя точка обрезала бы описание почти до заголовка —
  // в таком случае берём обычное сокращение по слову.
  if (end + 1 >= MIN_SENTENCE_LENGTH) return cut.slice(0, end + 1).trim();
  return excerpt(text, limit);
}
