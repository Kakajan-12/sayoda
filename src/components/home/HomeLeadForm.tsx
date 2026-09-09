"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import BotTrap from "@/components/contacts/BotTrap";
import { BASE_API_URL } from "@/i18n/api";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";
import SuccessModal from "@/components/ui/SuccessModal";
import { trackEvent } from "@/lib/analytics";

/**
 * Короткая форма заявки в конце главной.
 *
 * На главной не было ни одной формы: человек долистывал до конца и упирался
 * в блог — чтобы написать, надо было догадаться уйти в «Контакты». Здесь
 * полей минимум: чем их больше, тем меньше отправок, а уточнить детали
 * менеджер может и в ответном письме.
 *
 * Уходит в тот же /send, что и форма контактов: заявка сначала сохраняется
 * в базу (видна в админке в «Заявках») и только потом отправляется письмом,
 * поэтому сбой почты не теряет обращение.
 */
const HomeLeadForm = () => {
  const t = useTranslations("HomeLead");
  const tc = useTranslations("ContactUs");
  const locale = useLocale();

  // website — поле-ловушка вместо капчи: человек его не видит, см. BotTrap.
  const empty = { name: "", email: "", phone: "", message: "", website: "" };
  const [formData, setFormData] = useState(empty);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_API_URL}/send`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          // Тема заполняется сама: в админке видно, что заявка с главной,
          // а лишнее поле в форме съело бы часть отправок.
          subject: t("subject"),
          locale,
          pageUrl: window.location.href,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || tc("successTitle"));
      } else {
        trackEvent("home_lead_submit");
        setDone(true);
        setFormData(empty);
      }
    } catch {
      setError("Server error");
    } finally {
      setSending(false);
    }
  };

  const field =
    "w-full rounded-lg border border-sand bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-tileLight";

  return (
    <div className="w-full bg-tileTint py-12 md:py-16">
      <div className="container mx-auto grid gap-8 px-5 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div>
          <h2
            className={`${PoppinFont.className} text-2xl/snug font-bold text-ink md:text-3xl/snug`}
          >
            {t("title")}
          </h2>
          <p
            className={`${QuicksandFont.className} mt-4 text-sm/relaxed text-inkMuted md:text-base/relaxed`}
          >
            {t("text")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`${QuicksandFont.className} relative grid grid-cols-1 gap-4 rounded-lg bg-white p-5 shadow-sm ring-1 ring-sand sm:grid-cols-2 md:p-6`}
        >
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            required
            placeholder={tc("Iname")}
            className={field}
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            required
            placeholder={tc("Iemail")}
            className={field}
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="tel"
            placeholder={t("phone")}
            className={`${field} sm:col-span-2`}
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={3}
            placeholder={t("message")}
            className={`${field} resize-none sm:col-span-2`}
          />

          <BotTrap
            value={formData.website}
            onChange={(v) => setFormData((prev) => ({ ...prev, website: v }))}
          />

          <button
            type="submit"
            disabled={sending}
            className={`${PoppinFont.className} rounded-full bg-brick px-8 py-3 text-sm text-white transition-colors hover:bg-brickDark disabled:opacity-60 sm:col-span-2`}
          >
            {sending ? "…" : t("btn")}
          </button>

          {error && (
            <p className="text-sm text-red-600 sm:col-span-2">{error}</p>
          )}
        </form>
      </div>

      <SuccessModal
        open={done}
        onClose={() => setDone(false)}
        title={tc("successTitle")}
        message={tc("successMessage")}
        closeLabel={tc("close")}
        titleId="home-lead-success-title"
      />
    </div>
  );
};

export default HomeLeadForm;
