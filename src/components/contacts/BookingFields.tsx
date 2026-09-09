"use client";

import React from "react";
import { useTranslations } from "next-intl";

/**
 * Поля формы заявки.
 *
 * Раньше поля были без подписей — только placeholder внутри. Стоило начать
 * печатать, и подпись исчезала: человек уже не видел, что за поле он
 * заполняет, а вернувшись к форме через минуту, не мог этого понять вовсе.
 * Скринридер в таком поле не читает ничего.
 *
 * Обязательных полей было ровно одно — капча. Остальные десять выглядели
 * одинаково, поэтому форма читалась как десять обязательных вопросов, хотя
 * ни на один можно было не отвечать. Теперь обязательны имя и почта,
 * помечены звёздочкой, а остальные подписаны как необязательные.
 */

/*
 * Общая коробка для всех полей.
 *
 * Высота задана явно, а не выведена из отступов: список и поле даты
 * браузер рисует своей высотой, и рядом с обычным полем они оказывались
 * то выше, то ниже на несколько пикселей — строка формы выглядела рваной.
 */
const controlBase =
  "w-full h-12 rounded-lg border border-sand bg-white px-3.5 text-ink outline-none transition focus:border-tileLight";

export const inputClass = `${controlBase} placeholder:text-inkMuted/60`;

/*
 * Списков в формах больше нет: единственным был выбор гражданства из
 * 250 стран, и он убран вместе с полем. Класс для него удалён отсюда
 * вместе с правилом .select-control в globals.css — если список
 * когда-нибудь понадобится, проще написать заново, чем разбираться в
 * оставленном про запас коде.
 */

/*
 * Поле даты.
 *
 * Достаётся не полю ввода, а кнопке: родной input[type=date] заменён
 * своим календарём — см. DateField. Оболочка та же, что у остальных
 * полей, чтобы в ряду они стояли одинаково.
 */
export const dateClass = `${controlBase} cursor-pointer`;

/** Многострочное поле: высота своя, всё остальное как у прочих. */
export const textareaClass =
  "w-full rounded-lg border border-sand bg-white px-3.5 py-3 text-ink outline-none transition placeholder:text-inkMuted/60 focus:border-tileLight resize-none";

export function Field({
  label,
  htmlFor,
  required,
  optional,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const t = useTranslations("Booking");

  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-ink"
      >
        {label}
        {required && <span className="ml-1 text-brick">*</span>}
        {optional && (
          <span className="ml-1.5 font-normal text-inkMuted">
            — {t("optional")}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

/** Раздел формы: заголовок и сетка полей под ним. */
export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-sand pt-6 first:border-0 first:pt-0">
      <h2 className="mb-4 text-lg font-bold text-tile">{title}</h2>
      {/* Две колонки с планшета: на телефоне поля в столбик читаются
          спокойнее, чем сжатые вдвое. */}
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}
