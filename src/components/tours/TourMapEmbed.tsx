"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import { CONSENT_EVENT, readConsent } from "@/lib/consent";

/**
 * Карта маршрута.
 *
 * Раньше здесь была фотография карты: её нельзя было ни приблизить, ни
 * подвинуть, ни понять, где именно проходит путь. У stantrips в этом месте
 * встроена карта Google My Maps — маршрут рисуют вручную и вставляют
 * ссылкой. Так же сделано и здесь.
 *
 * Встроенная карта — это обращение к Google с куками, поэтому она ждёт
 * согласия наравне с аналитикой и чатом. Пока согласия нет, показываем
 * прежнюю картинку: она лежит на нашем сервере и никого не запрашивает.
 * Если картинки нет — предлагаем загрузить карту явной кнопкой, чтобы
 * посетитель сам решил обратиться к Google.
 */
export default function TourMapEmbed({
    embedUrl,
    imageUrl,
    alt,
}: {
    embedUrl: string;
    /** Запасная картинка маршрута, если она загружена. */
    imageUrl?: string;
    alt: string;
}) {
    const t = useTranslations("TourPerPage");
    const [allowed, setAllowed] = useState(false);
    // Разовое согласие «показать эту карту» — на случай, когда посетитель
    // отказался от куков, но хочет посмотреть маршрут.
    const [askedToShow, setAskedToShow] = useState(false);

    useEffect(() => {
        setAllowed(readConsent() === "granted");

        // Согласие может прийти уже после отрисовки — карта должна
        // появиться сразу, без перезагрузки.
        const onChange = (e: Event) =>
            setAllowed((e as CustomEvent).detail === "granted");
        window.addEventListener(CONSENT_EVENT, onChange);
        return () => window.removeEventListener(CONSENT_EVENT, onChange);
    }, []);

    if (allowed || askedToShow) {
        return (
            <div className="relative w-full overflow-hidden rounded-xl bg-sand">
                {/*
                    Соотношение задаём контейнером: у iframe своей высоты нет,
                    и без этого карта схлопнулась бы в полоску.
                */}
                <iframe
                    src={embedUrl}
                    title={alt}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="aspect-[4/3] w-full border-0 sm:aspect-[16/9]"
                />
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-xl bg-sand">
            {imageUrl ? (
                <ImageWithSkeleton
                    src={imageUrl}
                    alt={alt}
                    width={1600}
                    height={1000}
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="h-auto w-full object-contain"
                    skeletonClassName="rounded-xl"
                />
            ) : (
                <div className="aspect-[4/3] w-full sm:aspect-[16/9]" />
            )}

            {/* Кнопка поверх картинки: карта интерактивная, и посетитель
                должен иметь возможность её открыть, не меняя решения
                по кукам на весь сайт. */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-10 text-center">
                <button
                    type="button"
                    onClick={() => setAskedToShow(true)}
                    className="rounded-lg bg-brick px-5 py-2.5 font-semibold text-white transition hover:bg-brickDark"
                >
                    {t("showMap")}
                </button>
                <span className="text-xs text-white/80">{t("showMapNote")}</span>
            </div>
        </div>
    );
}
