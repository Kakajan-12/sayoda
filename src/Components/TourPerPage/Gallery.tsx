'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PoppinFont } from "@/Ui/Fonts";
import { useTranslations } from "next-intl";
import { BASE_API_URL } from "@/i18n/api";

interface GalleryImage {
    gallery_id: number;
    image: string;
    tour_id: number;
}

interface GalleryProps {
    tourId: number;
}

const Gallery = ({ tourId }: GalleryProps) => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
    const t = useTranslations("SectionTitle");

    async function fetchGallery(tourId: number) {
        try {
            const res = await fetch(`${BASE_API_URL}/api/tour-gallery/tour/${tourId}`);
            if (!res.ok) {
                console.error("Ошибка загрузки галереи:", res.status, res.statusText);
                return [];
            }
            const data = await res.json();
            return data;
        } catch (err) {
            console.error("Ошибка загрузки галереи:", err);
            return [];
        }
    }

    useEffect(() => {
        async function loadGallery() {
            const data = await fetchGallery(tourId);
            setImages(data);
        }
        loadGallery();
    }, [tourId]);

    const openModal = (img: GalleryImage) => {
        setActiveImage(img);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setActiveImage(null);
    };

    if (!images.length) return <p className="text-center py-10">Галерея пуста</p>;

    return (
        <div className="container mx-auto px-5 lg:py-20 py-10">
            <h2 className={`text-2xl lg:text-2xl 2xl:text-3xl leading-9 2xl:leading-[65px] font-bold ${PoppinFont.className}`}>
                {t("gallery")}
            </h2>
            <div className="columns-2 md:columns-3 xl:columns-4 md:gap-4 gap-2.5 mt-10 lg:mt-10 space-y-2 md:space-y-4">
                {images.map((img) => (
                    <div
                        key={img.gallery_id}
                        className="rounded-xl shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => openModal(img)}
                    >
                        <Image
                            className="w-full max-h-[500px] rounded-xl h-full object-cover"
                            alt={`Tour ${tourId}`}
                            src={`${BASE_API_URL}/${img.image.replace(/\\/g, '/')}`}
                            width={400}
                            height={300}
                        />
                    </div>
                ))}
            </div>

            {/* Модалка */}
            {modalOpen && activeImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="relative max-w-3xl w-full mx-4"
                        onClick={(e) => e.stopPropagation()} // предотвращаем закрытие при клике на картинку
                    >
                        <button
                            className="absolute top-2 right-2 text-white text-3xl font-bold hover:text-gray-300 transition"
                            onClick={closeModal}
                        >
                            &times;
                        </button>
                        <Image
                            src={`${BASE_API_URL}/${activeImage.image.replace(/\\/g, '/')}`}
                            alt={`Tour ${tourId}`}
                            width={800}
                            height={600}
                            className="rounded-xl object-contain max-h-[80vh] mx-auto"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
