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
 * Кнопка приподнята над нижним краем, чтобы не перекрывать виджет Crisp.
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
      className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 md:bottom-6 md:right-6"
    >
      <FaWhatsapp className="h-7 w-7" />
    </a>
  );
}
