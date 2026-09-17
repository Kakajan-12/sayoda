import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Заглушка на месте сетки карточек, пока страница готовится.
 *
 * Повторяет разметку BlogCard: та же сетка, та же рамка, та же пропорция
 * картинки 16/10, те же отступы. Размеры выверены по живой карточке —
 * картинка 300, тело 222 при ширине колонки 480. Заглушка, не совпадающая
 * по высоте с тем, что её заменит, вредит больше, чем пустое место: в
 * момент подстановки содержимое прыгает.
 *
 * Строк ровно столько же, сколько в карточке: дата, заголовок в две
 * строки, начало текста в три и подпись со стрелкой внизу. Последняя
 * прижата mt-auto, как и в оригинале, иначе при выравнивании карточек по
 * высоте в ряду заглушка растягивалась бы иначе.
 *
 * aria-hidden: диктору тут читать нечего, о загрузке сообщает контейнер в
 * loading.tsx.
 */
export default function BlogCardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      aria-hidden
      role="presentation"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex h-full flex-col overflow-hidden rounded-lg bg-white ring-1 ring-sand shadow-xs"
        >
          <Skeleton className="aspect-[16/10] w-full rounded-none" />

          <div className="flex flex-1 flex-col gap-2 p-4">
            {/* дата */}
            <Skeleton className="h-4 w-28" />

            {/* заголовок, две строки */}
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5" />

            {/* начало текста, три строки */}
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-2/3" />

            {/* «читать далее» со стрелкой — прижата книзу, как в карточке */}
            <Skeleton className="mt-auto h-5 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}
