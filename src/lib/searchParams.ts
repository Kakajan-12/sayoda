/**
 * Разбор параметров отбора из адреса.
 *
 * Лежит отдельно, потому что каталог туров теперь не один: тот же отбор
 * читает вкладка «Туры» у страны. Пока разбор жил внутри страницы каталога,
 * второму месту оставалось его скопировать — а вместе с ним и предел в
 * пятьдесят значений, и отсев мусора. Разъехались бы они молча.
 */

export type Search = Record<string, string | string[] | undefined>;

/** Берём первое значение: ?type=1&type=2 не должно ломать разбор. */
export const one = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? "";

/** Сколько значений принимаем на одной оси. Столько же держит сервер. */
const MAX_VALUES = 50;

/**
 * Список идентификаторов из адреса: «8,9» или повторённый параметр.
 *
 * Значения приходят извне, поэтому пропускаем только целые положительные
 * числа и убираем повторы. Порядок сохраняем — по нему собирается тот же
 * адрес обратно, и ссылка не переписывается сама собой при первом же клике.
 *
 * Предел нужен, чтобы строка на тысячу чисел не ушла в запрос целиком.
 */
export const asIds = (value: string | string[] | undefined): string[] => {
  const parts = Array.isArray(value) ? value : String(value ?? "").split(",");
  const ids: string[] = [];
  for (const part of parts) {
    const n = Number.parseInt(part, 10);
    if (!Number.isInteger(n) || n <= 0) continue;
    const text = String(n);
    if (!ids.includes(text)) ids.push(text);
    if (ids.length >= MAX_VALUES) break;
  }
  return ids;
};

/** Номер страницы: меньше первой не бывает, мусор считаем первой. */
export const asPage = (value: string | string[] | undefined) =>
  Math.max(1, Number.parseInt(one(value), 10) || 1);
