"use client";

import { useState, type CSSProperties } from "react";
import NextImage, { type ImageProps } from "next/image";
import { Skeleton } from "@/Ui/skeleton";
import { cn } from "@/lib/utils";

type ImageWithSkeletonProps = ImageProps & {
  /** Доп. классы для скелетона (например, rounded-full / rounded-2xl, чтобы форма совпадала с картинкой). */
  skeletonClassName?: string;
};

/**
 * Обёртка над next/image, которая показывает skeleton-заглушку, пока картинка
 * грузится, и плавно показывает изображение по событию загрузки.
 *
 * Работает и для статичных импортов, и для серверных URL.
 *
 * Важно: ближайший родитель должен быть позиционированным (relative/absolute)
 * и иметь размер картинки — скелетон растягивается по нему через `inset-0`.
 */
export default function ImageWithSkeleton({
  className,
  skeletonClassName,
  style,
  onLoad,
  onError,
  alt,
  ...props
}: ImageWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false);

  const mergedStyle: CSSProperties = {
    ...style,
    opacity: loaded ? 1 : 0,
    transition: "opacity 0.4s ease-in-out",
  };

  // Картинка могла уже оказаться в кэше до того, как React навесил onLoad —
  // тогда событие не сработает. Проверяем готовность сразу через ref.
  const handleRef = (img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  };

  return (
    <>
      {!loaded && (
        <Skeleton
          aria-hidden
          className={cn(
            "absolute inset-0 z-10 h-full w-full rounded-none",
            skeletonClassName,
          )}
        />
      )}
      <NextImage
        {...props}
        ref={handleRef}
        alt={alt}
        className={className}
        style={mergedStyle}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setLoaded(true);
          onError?.(e);
        }}
      />
    </>
  );
}
