"use client";

import React, { useState, useEffect } from "react";
import { PoppinFont } from "../../../Ui/Fonts";
import ConatactDetail from "@/Components/UnKnown/ConatactDetail";
import TourDetail from "@/Components/UnKnown/TourDetail";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { BASE_API_URL } from "@/i18n/api";

const BookingPage = () => {
    const t = useTranslations("Booking");
    const searchParams = useSearchParams();

    const [formData, setFormData] = useState({
        gender: "",
        firstName: "",
        lastName: "",
        location: "",
        email: "",
        phone: "",
        tour: "",
        travelers: "",
        message: "",
    });

    const [captchaText, setCaptchaText] = useState("");
    const [captchaImage, setCaptchaImage] = useState("");
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Подставляем tourTitle из url
    useEffect(() => {
        const tourTitle = searchParams.get("tourTitle") || "";
        setFormData((prev) => ({ ...prev, tour: tourTitle }));
    }, [searchParams]);

    // Загрузка CAPTCHA
    const loadCaptcha = async () => {
        try {
            const res = await fetch(`${BASE_API_URL}/captcha`, {
                method: "GET",
                credentials: "include",
            });
            const svg = await res.text();
            setCaptchaImage(svg);
        } catch (err) {
            console.error("Failed to load captcha", err);
        }
    };

    useEffect(() => {
        loadCaptcha();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch(`${BASE_API_URL}/send-tour`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ ...formData, captchaText }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to submit");
                loadCaptcha();
            } else {
                setSuccess("Booking submitted successfully!");
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    travelers: "",
                    tour: "",
                    message: "",
                    gender: "",
                    location: "",
                });
                setCaptchaText("");
                loadCaptcha();
            }
        } catch (err) {
            setError("Server error");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-[#E8ECF0]">
            <div className="container mx-auto flex flex-col py-10 md:py-20 px-5">
                <h2
                    className={`text-2xl lg:text-3xl 2xl:text-4xl leading-10 w-2/3 2xl:leading-[65px] text-mainBlue font-bold ${PoppinFont.className}`}
                >
                    {t("title")}
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-10 mt-5 pt-5 mds:px-12"
                >
                    <ConatactDetail formDates={formData} onchange={handleChange} />
                    <TourDetail
                        formDates={formData}
                        onchange={handleChange}
                        tourName={formData.tour}
                    />

                    {/* CAPTCHA */}
                    <div className="flex col-span-full items-center flex-col gap-1.5">
                        <div className="flex items-center justify-center gap-2">
                            <div dangerouslySetInnerHTML={{ __html: captchaImage }} />
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
                            value={captchaText}
                            onChange={(e) => setCaptchaText(e.target.value)}
                            className="border md:text-sm text-xs py-2 px-3 rounded-md max-w-40"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={sending}
                        className={`bg-mainBlue py-2.5 px-10 w-full md:max-w-[200px] self-center text-white rounded-2xl ${PoppinFont.className}`}
                    >
                        {sending ? "..." : t("send")}
                    </button>
                    {success && <p className="text-green-600 mt-2">{success}</p>}
                    {error && <p className="text-red-600 mt-2">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default BookingPage;
