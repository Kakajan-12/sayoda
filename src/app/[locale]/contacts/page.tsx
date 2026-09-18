import React from "react";
import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import ContactMain from "@/components/contacts/ContactsHero";
import ContactDetails from "@/components/contacts/ContactDetails";
import ContactMap from "@/components/contacts/ContactMap";
import OfficeSwitcher from "@/components/contacts/OfficeSwitcher";
import {getOffices} from "@/lib/api/contacts";
import WhatToInclude from "@/components/contacts/WhatToInclude";
import ContactForm from "@/components/contacts/ContactForm";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import {PoppinFont} from "@/components/ui/Fonts";
import {pageMetadata} from "@/lib/metadata";
import {routing} from "@/i18n/routing";

export const revalidate = 300;

export function generateStaticParams() {
    return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const {locale} = await params;
    return pageMetadata(locale, "contacts", "contacts");
}

/**
 * Контакты.
 *
 * Раньше адрес, телефон, почту и карту тянул из браузера клиентский
 * компонент, и в серверном HTML не было ни одного контакта: на всю страницу
 * приходилось около пятисот знаков, почти целиком из подвала. Для страницы,
 * у которой одна задача — дать способ связаться, это худшее, что можно
 * сделать.
 *
 * Вёрстка в две колонки, а не полосами во всю ширину. Полосами выходило,
 * что карта занимает целый разворот, а под ней такая же широкая форма: поля
 * для имени и почты растягивались на полтора метра, и чтобы дойти от адреса
 * до формы, приходилось прокручивать два пустых экрана. Теперь реквизиты
 * стоят рядом с картой, а форма — рядом с памяткой о том, что в ней писать.
 *
 * Порядок тот же: сначала способы связи, потом форма. Человеку, которому
 * достаточно позвонить, не нужно пролистывать форму ради номера.
 */
export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ locale: string }>;
}) {
    const {locale} = await params;
    // Иначе next-intl в дочерних компонентах полезет за языком в заголовки,
    // и страница снова станет динамической. См. корневой макет локали.
    setRequestLocale(locale);

    const [nav, t, offices] = await Promise.all([
        getTranslations({locale, namespace: "Header"}),
        getTranslations({locale, namespace: "ContactUs"}),
        getOffices(locale),
    ]);

    return (
        <section>
            <BreadcrumbJsonLd
                locale={locale}
                items={[
                    {name: nav("main"), path: ""},
                    {name: nav("contact"), path: "contacts"},
                ]}
            />
            <ContactMain/>

            <div className="container mx-auto px-5 py-10 lg:py-14">
                {/*
                  Офисы переключаются вкладками, а их содержимое готовится
                  здесь, на сервере, и целиком лежит в разметке. Переключатель
                  только показывает нужную часть — так адреса и телефоны всех
                  офисов видны поисковику без выполнения скриптов.

                  Точек в админке может не быть вовсе: тогда показываем один
                  блок по-старому — из первого адреса, телефона и почты.

                  Карта шире колонки реквизитов: смотреть на неё полезнее,
                  чем на список из восьми строк, но не во весь экран.
                */}
                {offices.length > 0 ? (
                    <OfficeSwitcher
                        label={t("detailsTitle")}
                        names={offices.map((office) => office.name)}
                        panels={offices.map((office) => (
                            <div
                                key={office.id}
                                className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-stretch"
                            >
                                <ContactDetails locale={locale} office={office}/>
                                <ContactMap locale={locale} office={office}/>
                            </div>
                        ))}
                    />
                ) : (
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-stretch">
                        <ContactDetails locale={locale}/>
                        <ContactMap locale={locale}/>
                    </div>
                )}
            </div>

            <div className="w-full bg-tileTint/40 py-10 lg:py-14">
                <div className="container mx-auto px-5">
                    <h2
                        className={`${PoppinFont.className} text-2xl font-bold text-tile md:text-3xl`}
                    >
                        {t("formTitle")}
                    </h2>

                    {/* Памятка стоит сбоку от формы, а не над ней: её читают, пока
              заполняют поля, а не до того. На узких экранах она уходит вниз
              — там подсказка после формы всё равно бесполезна, поэтому
              порядок задан явно. */}
                    <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-start">
                        <div className="order-1 lg:order-1">
                            <WhatToInclude locale={locale}/>
                        </div>
                        <div className="order-2 lg:order-2">
                            <ContactForm/>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
