"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { LuSearch } from "react-icons/lu";

/**
 * Поле поиска.
 *
 * Обычная форма с переходом на адрес, а не живой поиск по каждой букве.
 * Живой давал бы запрос к базе на каждое нажатие клавиши — на сервере,
 * где живут пять проектов, это заметная нагрузка ради сомнительного
 * удобства. Здесь человек дописывает слово и жмёт ввод.
 *
 * Переход через router.push, а не обычная отправка формы: так остаётся
 * навигация Next со своим кэшем, и страница не перезагружается целиком.
 *
 * Значение из адреса приходит пропсом и кладётся в начальное состояние:
 * вернувшись к результатам кнопкой «назад», человек видит в поле свой
 * запрос, а не пустоту.
 */
export default function SearchField({
  initial = "",
  placeholder,
  label,
  basePath = "/search",
  keep = {},
  compact = false,
}: {
  initial?: string;
  placeholder: string;
  label: string;
  /** Куда уходит запрос: страница поиска или список блога. */
  basePath?: string;
  /**
   * Что сохранить в адресе рядом с запросом — например выбранную
   * категорию. Без этого поиск внутри категории сбрасывал бы её,
   * и человек не понимал бы, почему список вдруг стал шире.
   */
  keep?: Record<string, string | undefined>;
  /**
   * Вид для строки фильтров.
   *
   * На странице поиска поле — главный элемент экрана: крупное, круглое, с
   * кнопкой внутри. В панели блога оно стоит рядом с выпадающими списками,
   * и там эти же приметы мешают: круглое поле высотой 48 пикселей рядом с
   * прямоугольными списками по 42 читается как две разные формы, случайно
   * оказавшиеся в одном ряду.
   *
   * Компактный вид выравнивает поле по спискам: та же высота, то же
   * скругление, та же рамка. Кнопка остаётся — без неё непонятно, что
   * искать нужно по вводу.
   */
  compact?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initial);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();

    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(keep)) {
      if (val) params.set(key, val);
    }
    // Пустой запрос просто открывает страницу без отбора по словам —
    // сообщение «ничего не найдено» на пустое поле сбивает с толку.
    if (q) params.set("q", q);

    // Номер страницы не переносим: новый запрос — новый список, и седьмая
    // страница прежней выдачи в нём почти наверняка пуста.
    const query = params.toString();
    router.push(query ? `${basePath}?${query}` : basePath);
  };

  return (
    <form onSubmit={submit} role="search" className="relative">
      <label htmlFor="site-search" className="sr-only">
        {label}
      </label>
      <LuSearch
        aria-hidden
        className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-inkMuted ${
          compact ? "left-3.5" : "left-4"
        }`}
      />
      <input
        id="site-search"
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full border border-sand bg-white text-ink outline-hidden transition placeholder:text-inkMuted/60 focus:border-tileLight ${
          compact
            ? "h-[42px] rounded-lg pl-11 pr-24 text-sm"
            : "h-12 rounded-full pl-12 pr-28"
        }`}
      />
      <button
        type="submit"
        className={`absolute top-1/2 -translate-y-1/2 bg-tile text-white transition-colors hover:bg-tileDark ${
          compact
            ? "right-1 rounded-md px-4 py-1.5 text-sm"
            : "right-1.5 rounded-full px-5 py-2 text-sm"
        }`}
      >
        {label}
      </button>
    </form>
  );
}
