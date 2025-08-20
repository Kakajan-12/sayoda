"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { BASE_API_URL } from "@/i18n/api";

const ContactForm = () => {
    const t = useTranslations("ContactUs");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
        captchaText: "",
    });

    const [captchaImage, setCaptchaImage] = useState("");
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadCaptcha = async () => {
        const res = await fetch(`${BASE_API_URL}/captcha`, {
            method: 'GET',
            credentials: 'include',
        });
        const svg = await res.text();
        setCaptchaImage(svg);
    };

    useEffect(() => {
        loadCaptcha();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch(`${BASE_API_URL}/send`, {
                method: "POST",
                credentials: "include", // обязательный параметр
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to send");
                loadCaptcha();
            } else {
                setSuccess("Message sent successfully!");
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                    captchaText: "",
                });
                loadCaptcha();
            }
        } catch (err) {
            setError("Server error");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="w-full py-10">
            <div className="container mx-auto px-5">
                <form
                    onSubmit={handleSubmit}
                    className="shadow-xl px-5 w-full bg-white rounded-2xl grid gap-y-7 py-10 md:gap-x-5 grid-cols-1 md:grid-cols-2"
                >
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border w-full py-2 px-5 rounded-lg"
                        type="text"
                        placeholder={t("Iname")}
                        required
                    />
                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border w-full py-2 px-5 rounded-lg"
                        type="email"
                        placeholder={t("Iemail")}
                        required
                    />
                    <input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="border w-full py-2 px-5 rounded-lg md:col-span-full"
                        type="text"
                        placeholder={t("Isubject")}
                    />

                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="border w-full resize-none h-48 py-2 text-gray-500 rounded-lg md:col-span-full px-5"
                        placeholder={t("Imessage")}
                        required
                    />
                    <div className="flex col-span-full items-center flex-col gap-1.5">
                        <div className="flex items-center justify-center gap-2">
                            <div dangerouslySetInnerHTML={{__html: captchaImage}}/>
                            <button
                                type="button"
                                onClick={loadCaptcha}
                                className="text-sm text-blue-600 underline"
                            >
                                Refresh
                            </button>
                        </div>
                        <input
                            name="captchaText"
                            value={formData.captchaText}
                            onChange={handleChange}
                            className="border md:text-sm text-xs py-2 px-3 rounded-md max-w-40 mr-10"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={sending}
                        className="col-span-full justify-self-center max-w-60 bg-mainBlue py-2 px-10 rounded-xl text-white"
                    >
                        {sending ? "..." : t("btn")}
                    </button>
                    {success && <p className="text-green-600 mt-2">{success}</p>}
                    {error && <p className="text-red-600 mt-2">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default ContactForm;
