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

/** Общий вид поля: та же рамка, отступы и фокус во всей форме. */
const inputClass =
  "w-full rounded-lg border border-sand bg-white px-3.5 py-2.5 text-ink outline-none transition placeholder:text-inkMuted/60 focus:border-tileLight";

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

export { inputClass };
