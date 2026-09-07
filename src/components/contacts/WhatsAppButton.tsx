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
 * Угол зависит от того, будет ли на странице чат.
 *
 * Чат есть — кнопка уходит влево. Подняться над ним не выходит: кроме
 * лаунчера Tawk рисует приветственный баллон, который выше и перекрывал
 * нижние 29px кнопки — клик в этой полосе попадал в его iframe, а не по
 * ссылке. Высота баллона зависит от текста приветствия и настроек, то есть
 * подобранный отступ снизу в любой момент перестал бы работать.
 *
 * Чата нет — а это все, кто отказался от cookie, и случай, когда чат вообще
 * не настроен, — кнопка занимает его место справа. Иначе привычный правый
 * угол пустует, а связаться быстро вроде бы и нечем.
 *
 * Переключение идёт классом на <html>, а не состоянием React: класс
 * проставляется встроенным скриптом ещё при разборе разметки, поэтому
 * кнопка рисуется сразу на месте и никуда не переезжает на глазах.
 *
 * z-40 намеренно ниже z-50 у модалок: всплывающий фильтр туров должен
 * перекрывать кнопку, а не наоборот.
 */
export default function WhatsAppButton({
  href,
  label,
  hasChat,
}: {
  href: string;
  label: string;
  /** Настроен ли чат вообще. Если нет, согласие ничего не меняет. */
  hasChat: boolean;
}) {
  // По умолчанию справа — на месте чата. Влево кнопка уходит только когда
  // чат настроен И посетитель согласился на cookie.
  const position = hasChat
    ? "right-5 [.cookies-ok_&]:left-5 [.cookies-ok_&]:right-auto"
    : "right-5";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={() => trackEvent("whatsapp_click", { placement: "sticky" })}
      className={`fixed bottom-6 ${position} z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105`}
    >
      <FaWhatsapp className="h-7 w-7" />
    </a>
  );
}
