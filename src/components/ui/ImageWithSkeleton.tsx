"use client";

import { useState, type CSSProperties } from "react";
import NextImage, { type ImageProps } from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type ImageWithSkeletonProps = ImageProps & {
  /** Доп. классы для скелетона (например, rounded-full / rounded-2xl, чтобы форма совпадала с картинкой). */
  skeletonClassName?: string;
};

/**
 * Качество сжатия картинок на сайте.
 *
 * Значение одно на весь сайт и лежит здесь, чтобы менять его в одном месте,
 * а не искать по двум десяткам компонентов. Оно же должно быть перечислено
 * в images.qualities в next.config: в Next 16 список обязателен, и любое
 * значение не из него молча заменяется ближайшим разрешённым.
 *
 * 100 — по решению заказчика. Для справки, замер на кадре 1920px:
 * при 75 файл весит 249 КБ, при 90 — 434 КБ, при 100 — 1,18 МБ.
 * То есть сотня вчетверо-впятеро тяжелее семидесяти пяти.
 */
export const IMAGE_QUALITY = 100;

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
  quality = IMAGE_QUALITY,
  ...props
}: ImageWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false);

  /*
   * Нет адреса — показываем только заглушку.
   *
   * next/image на пустом src бросает исключение, а бросает он его при
   * отрисовке списка: одна запись без картинки роняла бы всю страницу
   * каталога в 500. Пустая рамка на месте одной карточки — куда меньшая
   * беда, чем недоступный раздел.
   *
   * Проверка стоит до всех хуков ниже по коду намеренно не ставится:
   * useState уже вызван, порядок хуков не меняется.
   */
  if (!props.src) {
    return (
      <Skeleton
        aria-hidden
        className={cn("absolute inset-0 h-full w-full rounded-none", skeletonClassName)}
      />
    );
  }

  /**
   * Переход задаётся здесь, а не классом, и перечисляет оба свойства сразу.
   *
   * Раньше в инлайновом стиле стояло только `opacity`, и он перебивал
   * `transition-transform` из класса — инлайн всегда сильнее. Из-за этого
   * зум карточек при наведении не анимировался вообще: картинка скачком
   * меняла масштаб. Заметить это по коду было нельзя, класс выглядел
   * рабочим.
   *
   * Кривая easeOutQuint: быстрый старт и мягкое торможение — зум так
   * читается как плавное приближение, а не как рывок.
   *
   * Свойств перечислено четыре, и три последних — из-за Tailwind 4. В
   * третьей версии scale-105 писал `transform: scale(1.05)`, и хватало
   * одного `transform`. В четвёртой те же утилиты пишут в отдельные
   * свойства — scale, translate, rotate, — а `transform` остаётся
   * нетронутым. После перехода на v4 зум карточек снова перестал
   * анимироваться: свойство менялось не то, которое здесь указано.
   */
  const mergedStyle: CSSProperties = {
    ...style,
    opacity: loaded ? 1 : 0,
    transition: [
      "opacity 0.4s ease-in-out",
      "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
      "scale 700ms cubic-bezier(0.22, 1, 0.36, 1)",
      "translate 700ms cubic-bezier(0.22, 1, 0.36, 1)",
      "rotate 700ms cubic-bezier(0.22, 1, 0.36, 1)",
    ].join(", "),
  };

  // Картинка могла уже оказаться в кэше до того, как React навесил onLoad —
  // тогда событие не сработает. Проверяем готовность сразу через ref.
  const handleRef = (img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  };

  return (
    <>
      {/*
        Без z-index намеренно.

        Раньше стояло z-10, и заглушка всплывала выше не только картинки, но и
        всего, что лежит поверх неё в карточке: на плитках стран под ней
        скрывались название страны и затемнение сверху, и во время загрузки
        человек видел пять пустых серых прямоугольников. Обёртка картинки
        стекового контекста не создаёт, поэтому z-10 считался наравне с
        подписью, у которой своего z-index нет, и выигрывал.

        Поднимать заглушку над картинкой не нужно: до загрузки у картинки
        opacity 0, а как только она загрузилась, заглушка размонтируется.
      */}
      {!loaded && (
        <Skeleton
          aria-hidden
          className={cn(
            "absolute inset-0 h-full w-full rounded-none",
            skeletonClassName,
          )}
        />
      )}
      <NextImage
        {...props}
        ref={handleRef}
        alt={alt}
        quality={quality}
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
