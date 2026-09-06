import { Poppins, Source_Sans_3 } from "next/font/google";

/**
 * Две гарнитуры вместо четырёх.
 *
 * Раньше грузились Poppins, Comfortaa, Quicksand и Montserrat одновременно.
 * У обоих референсов, которые нравятся клиенту, по одной гарнитуре: Advantour
 * набран Open Sans, Stantrips — ABeeZee. Разнобой из четырёх шрифтов читается
 * как несобранность и тянет за собой лишний вес страницы.
 *
 * Пара подобрана так:
 *   заголовки — Poppins: геометричный, уверенный, уже был голосом сайта;
 *   текст     — Source Sans 3: гуманистический гротеск, заметно лучше
 *               читается на 14–16px, чем округлый Quicksand, и держит
 *               цифры в ценах ровными колонками.
 *
 * Comfortaa убрана намеренно: округлая и неформальная, она плохо сочетается
 * с задачей — человек переводит незнакомой компании полторы тысячи долларов.
 */

export const HeadingFont = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-heading",
});

export const BodyFont = Source_Sans_3({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-body",
});

/**
 * Прежние имена сохранены: они встречаются в трёх десятках компонентов,
 * и переименовывать их разом — риск без пользы. Каждое указывает на ту
 * гарнитуру, которая уместна в его роли.
 */
export const PoppinFont = HeadingFont;
export const ComfortaFont = HeadingFont; // была в шапке и заголовках
export const MontserratFont = HeadingFont; // была на числах и ценах
export const QuicksandFont = BodyFont; // была в основном тексте
