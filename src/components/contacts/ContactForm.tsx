"use client";

import { useLocale, useTranslations } from "next-intl";
import React, { useState } from "react";
import { BASE_API_URL } from "@/i18n/api";
import BotTrap from "@/components/contacts/BotTrap";
import SuccessModal from "@/components/ui/SuccessModal";
import { trackEvent } from "@/lib/analytics";

const ContactForm = () => {
  const t = useTranslations("ContactUs");
  const locale = useLocale();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    // Поле-ловушка вместо капчи: человек его не видит, см. BotTrap.
    contact_ref: "",
  });

  const [sending, setSending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
        headers: { "Content-Type": "application/json" },
        // Источник заявки — виден в админке рядом с самим обращением.
        body: JSON.stringify({
          ...formData,
          locale,
          pageUrl: window.location.href,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send");
      } else {
        trackEvent("contact_submit");
        setShowSuccessModal(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          contact_ref: "",
        });
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setSending(false);
    }
  };

  return (
    /* Форма растягивалась на всю ширину страницы — поля в полтора метра, в
       которые вводят имя и почту. Теперь она живёт в колонке, которую задаёт
       страница, а серая плашка заменена на такую же белую карточку со
       светлой обводкой, как у остальных блоков. */
    <div className="w-full">
        <form
          onSubmit={handleSubmit}
          className="relative grid grid-cols-1 gap-y-5 rounded-2xl bg-white px-6 py-8 ring-1 ring-sand sm:grid-cols-2 sm:gap-x-5"
        >
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-sand px-4 py-2.5 outline-hidden transition focus:border-tileLight"
            type="text"
            placeholder={t("Iname")}
            required
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-sand px-4 py-2.5 outline-hidden transition focus:border-tileLight"
            type="email"
            placeholder={t("Iemail")}
            required
          />
          <input
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full rounded-lg border border-sand px-4 py-2.5 outline-hidden transition focus:border-tileLight sm:col-span-full"
            type="text"
            placeholder={t("Isubject")}
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="h-40 w-full resize-none rounded-lg border border-sand px-4 py-2.5 outline-hidden transition focus:border-tileLight sm:col-span-full"
            placeholder={t("Imessage")}
            required
          />
          <BotTrap
            value={formData.contact_ref}
            onChange={(v) =>
              setFormData((prev) => ({ ...prev, contact_ref: v }))
            }
          />

          <button
            type="submit"
            disabled={sending}
            className="col-span-full justify-self-center max-w-fit bg-mainBlue hover:bg-mainBlue/80 transition-colors duration-300 py-2 px-10 rounded-md text-white"
          >
            {sending ? "..." : t("btn")}
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
      <SuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={t("successTitle")}
        message={t("successMessage")}
        closeLabel={t("close")}
        titleId="contact-success-title"
      />
    </div>
  );
};

export default ContactForm;
