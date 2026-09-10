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
}: {
  initial?: string;
  placeholder: string;
  label: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initial);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    // Пустой запрос просто открывает страницу поиска без результатов —
    // сообщение «ничего не найдено» на пустое поле сбивает с толку.
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <form onSubmit={submit} role="search" className="relative">
      <label htmlFor="site-search" className="sr-only">
        {label}
      </label>
      <LuSearch
        aria-hidden
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-inkMuted"
      />
      <input
        id="site-search"
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="h-12 w-full rounded-full border border-sand bg-white pl-12 pr-28 text-ink outline-none transition placeholder:text-inkMuted/60 focus:border-tileLight"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-tile px-5 py-2 text-sm text-white transition-colors hover:bg-tileDark"
      >
        {label}
      </button>
    </form>
  );
}
