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
 * Позиционирование. Виджет живого чата занимает правый нижний угол: его
 * лаунчер (около 60px с отступом 20px от края) закрывает нижние ~80px.
 * Поэтому кнопка поднята на 96px (bottom-24) — остаётся зазор, и кнопки
 * не наезжают друг на друга ни на одном экране. Отступ справа взят 20px
 * (right-5), тот же, что у лаунчера, чтобы они стояли ровной вертикалью.
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
      className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <FaWhatsapp className="h-7 w-7" />
    </a>
  );
}
