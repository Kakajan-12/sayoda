"use client";

import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import BotTrap from "@/components/contacts/BotTrap";
import DateField from "@/components/contacts/DateField";
import { PoppinFont } from "@/components/ui/Fonts";
import {
  Field,
  Section,
  dateClass,
  inputClass,
  textareaClass,
} from "@/components/contacts/BookingFields";
import { BASE_API_URL } from "@/i18n/api";
import { trackEvent } from "@/lib/analytics";

/**
 * Заявка на тур.
 *
 * Форма была сплошным полотном из одиннадцати полей без подписей: только
 * placeholder внутри, который исчезал, стоило начать печатать. Выглядели
 * все одинаково, поэтому читалась она как одиннадцать обязательных
 * вопросов.
 *
 * Для сравнения: у advantour, на который равняется заказчик, в форме
 * заявки пять полей, из них обязательны имя, фамилия, почта и сообщение.
 *
 * Здесь поля разделены на два блока — как с вами связаться и о поездке, —
 * у каждого своя подпись, обязательные помечены звёздочкой, необязательные
 * названы необязательными. Сам тур не поле ввода, а карточка сверху: его
 * всё равно нельзя было менять.
 *
 * Два поля убраны совсем:
 *
 * «Mr./Mrs.» никогда не показывалось — оно жило только в этом объекте и
 * уходило на сервер вечным «Mr.», подставляя в письмо обращение, которого
 * человек не выбирал.
 *
 * Гражданство было списком на 250 стран — самым тяжёлым, что есть на
 * странице, — и при этом необязательным. Для приглашения оно нужно, но
 * не в момент первого письма: оператор всё равно отвечает лично и
 * спрашивает паспортные данные. Оба столбца в базе остались, старые
 * заявки их сохранили, в админке они выводятся по условию.
 */

const EMPTY_FORM = {
  // Поле-ловушка: человек его не видит и не заполняет, см. BotTrap.
  website: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  tour: "",
  travelers: "",
  departureDate: "",
  message: "",
};

const BookingPage = () => {
  const t = useTranslations("Booking");
  const tp = useTranslations("TourPerPage");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*
   * Тур и дату читаем прямо при отрисовке, а не в эффекте после неё.
   *
   * Через эффект карточка выбранного тура появлялась мигом позже самой
   * страницы: человек успевал увидеть форму без неё и не понять, к какому
   * туру оставляет заявку.
   *
   * Дату принимаем только в формате «ГГГГ-ММ-ДД»: значение приходит из
   * адресной строки, то есть подставить туда можно что угодно. На всё
   * остальное поле показало бы подсказку «выберите дату» — человек решил
   * бы, что дата уже выбрана, и отправил заявку без неё.
   */
  const tourTitle = searchParams.get("tourTitle") || "";
  const rawDate = searchParams.get("date") || "";
  const initialDate = /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? rawDate : "";

  useEffect(() => {
    setFormData((prev) => ({ ...prev, tour: tourTitle, departureDate: initialDate }));
  }, [tourTitle, initialDate]);

  const set = (name: string, value: string) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${BASE_API_URL}/send-tour`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        // locale и pageUrl нужны в админке, чтобы понимать, с какой страницы
        // и на каком языке пришла заявка.
        body: JSON.stringify({
          ...formData,
          locale,
          pageUrl: window.location.href,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("errorMsg"));
        return;
      }

      // Ключевое событие воронки: без него неизвестно, сколько человек
      // дошло до отправки заявки.
      trackEvent("booking_submit", {
        tour_name: formData.tour,
        travelers: formData.travelers,
        departure_date: formData.departureDate || undefined,
      });

      setSuccess(true);
      // Тур и дату оставляем: если человек отправит вторую заявку, они те же.
      setFormData((prev) => ({
        ...EMPTY_FORM,
        tour: prev.tour,
        departureDate: prev.departureDate,
      }));
    } catch {
      setError(t("errorMsg"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-sandLight">
      <div className="container mx-auto max-w-4xl px-4 py-10 md:py-16">
        <h1
          className={`${PoppinFont.className} text-2xl font-bold text-balance text-tile sm:text-3xl lg:text-4xl`}
        >
          {t("title")}
        </h1>
        <p className="mt-3 text-inkMuted">{t("subtitle")}</p>

        {/* Выбранный тур — карточка, а не поле ввода: менять его в форме
            всё равно было нельзя, а поле только занимало место наравне
            с теми, что нужно заполнять. */}
        {tourTitle && (
          <div className="mt-6 rounded-xl bg-tileTint px-5 py-4">
            <p className="text-xs uppercase tracking-wide text-tile/70">
              {t("yourTour")}
            </p>
            <p className={`${PoppinFont.className} mt-1 font-semibold text-tile`}>
              {tourTitle}
            </p>
            {initialDate && (
              <p className="mt-1 text-sm text-tile/80">
                {tp("departureDate")}: {initialDate}
              </p>
            )}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="relative mt-6 space-y-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-sand sm:p-8"
        >
          <Section title={t("contact")}>
            <Field label={t("Iname")} htmlFor="firstName" required>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={formData.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label={t("Isurname")} htmlFor="lastName" optional>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label={t("Iemail")} htmlFor="email" required>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => set("email", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label={t("Iphone")} htmlFor="phone" optional>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={(e) => set("phone", e.target.value)}
                className={inputClass}
              />
            </Field>
          </Section>

          <Section title={t("sectionTrip")}>
            <Field label={tp("departureDate")} htmlFor="departureDate" optional>
              <DateField
                id="departureDate"
                value={formData.departureDate}
                onChange={(v) => set("departureDate", v)}
                className={dateClass}
              />
            </Field>

            <Field label={t("Itravelers")} htmlFor="travelers" optional>
              <input
                id="travelers"
                name="travelers"
                type="number"
                min={1}
                value={formData.travelers}
                onChange={(e) => set("travelers", e.target.value)}
                className={`${inputClass} no-spin`}
              />
            </Field>

            <Field
              label={t("Icomment")}
              htmlFor="message"
              optional
              className="sm:col-span-2"
            >
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={(e) => set("message", e.target.value)}
                className={textareaClass}
              />
            </Field>
          </Section>

          <BotTrap value={formData.website} onChange={(v) => set("website", v)} />

          <div className="flex flex-col gap-3 border-t border-sand pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-inkMuted">{t("requiredNote")}</p>
            <button
              type="submit"
              disabled={sending}
              className={`${PoppinFont.className} shrink-0 rounded-xl bg-brick px-8 py-3 font-semibold text-white transition hover:bg-brickDark disabled:cursor-wait disabled:opacity-70`}
            >
              {sending ? "…" : t("send")}
            </button>
          </div>

          {success && (
            <p className="rounded-lg bg-tileTint px-4 py-3 text-sm text-tile">
              {t("successMsg")}
            </p>
          )}
          {error && (
            <p className="rounded-lg bg-brick/10 px-4 py-3 text-sm text-brick">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
