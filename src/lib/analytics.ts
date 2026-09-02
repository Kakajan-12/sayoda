/**
 * Тонкая обёртка над GA4.
 *
 * ID берётся из NEXT_PUBLIC_GA4_ID. Пока переменная не задана, аналитика
 * не подключается вовсе, а trackEvent молча ничего не делает — код можно
 * выкатывать до того, как заказчик создаст счётчик.
 */

export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "";

export const isAnalyticsEnabled = Boolean(GA4_ID);

/** События воронки. Их же нужно отметить конверсиями в интерфейсе GA4. */
export type FunnelEvent =
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "tour_view"
  | "booking_start"
  | "booking_submit"
  | "contact_submit";

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      target: string,
      params?: Record<string, unknown>,
    ) => void;
  }
}

export function trackEvent(
  event: FunnelEvent,
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
}
