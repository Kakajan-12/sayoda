/**
 * Названия языков по кодам, на языке посетителя.
 *
 * В настройках языки гидов хранятся кодами через запятую — «en,ru,tk,tr».
 * Один список на все три версии сайта: иначе заказчику пришлось бы вводить
 * его трижды и следить, чтобы переводы не разошлись.
 *
 * Intl.DisplayNames знает почти все языки, но не на всех языках интерфейса:
 * для туркменского данных может не оказаться, и тогда он вернёт сам код.
 * Поэтому откат двухступенчатый — сначала английские названия, затем код в
 * верхнем регистре. Пустая строка лучше не подходит: «Гиды говорят на» без
 * продолжения выглядит сломанным.
 */
export function languageNames(codes: string | null, locale: string): string[] {
  const list = (codes || "")
    .split(",")
    .map((code) => code.trim().toLowerCase())
    .filter(Boolean);

  if (!list.length) return [];

  const name = (code: string, inLocale: string) => {
    try {
      const display = new Intl.DisplayNames([inLocale], { type: "language" });
      return display.of(code) || code;
    } catch {
      return code;
    }
  };

  return list.map((code) => {
    const local = name(code, locale);
    if (local.toLowerCase() !== code) return capitalize(local);

    const english = name(code, "en");
    return english.toLowerCase() !== code
      ? capitalize(english)
      : code.toUpperCase();
  });
}

function capitalize(value: string): string {
  return value.charAt(0).toLocaleUpperCase() + value.slice(1);
}

/**
 * Часы работы из настроек в вид для страницы.
 *
 * В базе они лежат в формате schema.org — «Mo-Fr 09:00-18:00», — потому что
 * оттуда же берётся openingHours в разметке. Здесь тот же набор собирается
 * словами на нужном языке.
 *
 * Строка, не подошедшая под формат, возвращается как есть: заказчик мог
 * ввести что-то своё, и показать это лучше, чем не показать ничего.
 */
export function formatOfficeHours(
  hours: string | null,
  dayNames: Record<string, string>,
): string {
  const value = (hours || "").trim();
  if (!value) return "";

  const match = /^([A-Za-z]{2})(?:-([A-Za-z]{2}))?\s+(\d{2}:\d{2})-(\d{2}:\d{2})$/.exec(
    value,
  );
  if (!match) return value;

  const [, from, to, open, close] = match;
  const day = (code: string) => dayNames[normalizeDay(code)] || code;
  const days = to ? `${day(from)}–${day(to)}` : day(from);

  return `${days}, ${open}–${close}`;
}

/** «mo», «MO» и «Mo» — одно и то же; ключи в переводах в одном написании. */
function normalizeDay(code: string): string {
  return code.charAt(0).toUpperCase() + code.slice(1).toLowerCase();
}
