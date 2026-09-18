"use client";

import React, { useState } from "react";
import { PoppinFont } from "@/components/ui/Fonts";

/**
 * Переключение между офисами на странице контактов.
 *
 * В админке офисы заведены разделом «Точки на карте», а адрес, телефон и
 * почта привязаны к точке полем location_id_real. Страница этой связи не
 * знала: брала первый адрес, первый телефон и первую почту. Пока офис
 * один, разницы не было — со вторым на сайте не появилось бы ничего.
 *
 * Содержимое вкладок приходит готовым с сервера и лежит в разметке
 * целиком: переключение только показывает нужную часть. Так адреса и
 * телефоны всех офисов попадают в HTML, и поисковик видит их без
 * выполнения скриптов. Прежний компонент тянул их запросом из браузера, и
 * в серверном HTML страницы контактов не было ни одного контакта.
 *
 * Скрытое прячем через hidden, а не размонтированием: карта в скрытой
 * вкладке не перезагружается при возврате к ней.
 *
 * Одна вкладка — переключателя нет: ряд из одной кнопки ничего не
 * переключает и выглядит недоделкой.
 */
export default function OfficeSwitcher({
  names,
  panels,
  label,
}: {
  names: string[];
  /** Готовые блоки с сервера — по одному на офис, в том же порядке. */
  panels: React.ReactNode[];
  /** Подпись ряда вкладок для скринридера. */
  label: string;
}) {
  const [активный, setАктивный] = useState(0);

  if (!panels.length) return null;

  return (
    <div>
      {names.length > 1 && (
        <div
          role="tablist"
          aria-label={label}
          className={`${PoppinFont.className} mb-6 flex flex-wrap gap-2`}
        >
          {names.map((name, i) => {
            const выбран = i === активный;
            return (
              <button
                key={name}
                type="button"
                role="tab"
                id={`office-tab-${i}`}
                aria-selected={выбран}
                aria-controls={`office-panel-${i}`}
                onClick={() => setАктивный(i)}
                className={`rounded-full border px-5 py-2 text-sm transition-colors ${
                  выбран
                    ? "border-tile bg-tile text-white"
                    : "border-sand bg-white text-ink hover:border-tileLight"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}

      {panels.map((panel, i) => (
        <div
          key={names[i] ?? i}
          role={names.length > 1 ? "tabpanel" : undefined}
          id={`office-panel-${i}`}
          aria-labelledby={names.length > 1 ? `office-tab-${i}` : undefined}
          hidden={i !== активный}
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
