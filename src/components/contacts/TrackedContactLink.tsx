"use client";

import React from "react";
import { trackEvent, type FunnelEvent } from "@/lib/analytics";

/**
 * Ссылка tel:/mailto: с отправкой события в аналитику.
 *
 * Звонок и письмо уводят человека из браузера, поэтому иначе они нигде
 * не фиксируются — а для этой аудитории это полноценная конверсия.
 */
export default function TrackedContactLink({
  href,
  event,
  className,
  children,
}: {
  href: string;
  event: FunnelEvent;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackEvent(event, { placement: "footer" })}
    >
      {children}
    </a>
  );
}
