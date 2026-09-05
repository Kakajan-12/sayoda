/**
 * События воронки для GA4.
 *
 * Сам счётчик подключается компонентом Seo/Analytics, а его идентификатор
 * приходит из админки (таблица settings, ключ ga4_id). Пока счётчик не задан,
 * window.gtag не существует и trackEvent молча ничего не делает — код
 * безопасно работает и без настроенной аналитики.
 *
 * Эти же события нужно отметить конверсиями в интерфейсе GA4.
 */
export type FunnelEvent =
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "tour_view"
  | "booking_start"
  | "booking_submit"
  | "contact_submit"
  // Отдельное событие от формы на главной: она короче формы контактов и
  // ловит другой момент — человека, который ещё не выбрал тур.
  | "home_lead_submit";

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
