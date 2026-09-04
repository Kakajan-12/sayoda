"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { trackEvent } from "@/lib/analytics";

/**
 * Липкая кнопка WhatsApp.
 *
 * Для иностранца, планирующего поездку в Туркменистан, мессенджер конвертит
 * заметно лучше формы: ответ приходит в привычный канал и не требует
 * заполнять девять полей с капчей.
 *
 * Позиционирование — левый нижний угол, а не правый.
 *
 * Правый занят виджетом живого чата, и подняться над ним не выходит: кроме
 * лаунчера Tawk рисует приветственный баллон, который выше и перекрывал
 * нижние 29px кнопки — клик в этой полосе попадал в его iframe, а не по
 * ссылке. Высота баллона зависит от текста приветствия и настроек, то есть
 * подобранный отступ снизу в любой момент перестал бы работать.
 * Разные углы снимают зависимость от того, что именно дорисует чат.
 *
 * z-40 намеренно ниже z-50 у модалок: всплывающий фильтр туров должен
 * перекрывать кнопку, а не наоборот.
 */
export default function WhatsAppButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={() => trackEvent("whatsapp_click", { placement: "sticky" })}
      className="fixed bottom-6 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <FaWhatsapp className="h-7 w-7" />
    </a>
  );
}
