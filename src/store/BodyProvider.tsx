"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { BodyFont, HeadingFont } from "@/components/ui/Fonts";

/**
 * Здесь же задаётся базовая типографика документа.
 *
 * Шрифты назначались точечно по компонентам, поэтому всё, чему класс
 * не проставили, отваливалось на системный ui-sans-serif — на главной таких
 * элементов было 134. Теперь текстовая гарнитура наследуется от body,
 * а заголовки переопределяют её у себя.
 *
 * Классы .variable объявляют --font-heading и --font-body, без них утилиты
 * font-heading / font-body из Tailwind не к чему было бы привязать.
 */
export default function BodyWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const booleon = useSelector((state: RootState) => state.trufalse.value);

  return (
    <body
      className={`antialiased ${HeadingFont.variable} ${BodyFont.variable} ${BodyFont.className} ${booleon ? "overflow-hidden" : ""}`}
    >
      {children}
    </body>
  );
}
