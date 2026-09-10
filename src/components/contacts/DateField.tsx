"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LuCalendar, LuChevronLeft, LuChevronRight } from "react-icons/lu";

/**
 * Выбор даты со своим календарём.
 *
 * Здесь стоял обычный input[type=date], и он трижды получал замечание,
 * что выглядит чужим. Первые две правки были мимо: сначала выровняли
 * высоту и рамку, потом приглушили подсказку, перекрасили значок и
 * подсветку сегмента. Всё это — оболочка.
 *
 * У родного поля есть две части, до которых из CSS не дотянуться в
 * принципе:
 *
 * Текст «mm/dd/yyyy». Его нельзя ни заменить, ни перевести, и формат
 * берётся из языка браузера, а не страницы: у посетителя с английской
 * системой на русской странице всё равно было бы mm/dd/yyyy.
 *
 * Выпадающий календарь. Браузер рисует его целиком сам — системным
 * шрифтом, системными цветами, своей раскладкой. Из всего оформления
 * снаружи доступен один accent-color. Именно этот календарь и выглядел
 * дефолтным: поле в палитре открывало окно, не имеющее к ней отношения.
 *
 * Поэтому поле здесь своё: кнопка в тех же классах, что остальные поля
 * формы, с нашей подсказкой и датой, отформатированной по языку
 * страницы, и календарь в палитре «Изразец».
 *
 * Значение наружу отдаётся в том же виде «ГГГГ-ММ-ДД», что и раньше:
 * его читает страница тура, подставляя дату выезда в ссылку, и его же
 * ждёт сервер.
 */

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Дата в «ГГГГ-ММ-ДД» по местному времени.
 *
 * Через toISOString() здесь была бы ошибка на сутки: он переводит в UTC,
 * и у посетителя восточнее Гринвича выбранное 10-е число уехало бы на
 * 9-е. Собираем строку из местных полей.
 */
const toISO = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/**
 * Разбор «ГГГГ-ММ-ДД» в местную дату.
 *
 * new Date("2026-09-10") по стандарту читается как полночь UTC — то же
 * смещение на сутки, только в другую сторону. Поэтому разбираем сами
 * и строим дату через конструктор с полями.
 */
const fromISO = (value: string): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  // Отсекаем несуществующие даты вроде 31 февраля: конструктор молча
  // перекатывает их на следующий месяц.
  return d.getMonth() === Number(m[2]) - 1 ? d : null;
};

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export default function DateField({
  id,
  value,
  onChange,
  className,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className: string;
}) {
  const t = useTranslations("Booking");
  const locale = useLocale();

  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /*
   * Куда раскрывать календарь — вниз или вверх.
   *
   * Поле даты стоит в середине длинной формы, и внизу страницы под ним
   * места нет: панель уходила за край экрана вместе с последними
   * неделями месяца и кнопкой «Очистить». Догадаться, что там что-то
   * есть, было нельзя, а прокрутка с открытой панелью загоняла её под
   * липкую шапку сайта.
   *
   * Решаем в момент открытия, а не правилом CSS: до открытия неизвестно,
   * где окажется поле, — человек мог прокрутить страницу куда угодно.
   */
  const [above, setAbove] = useState(false);

  /** Высота панели с запасом: шапка месяца, шесть недель и «Очистить». */
  const PANEL_HEIGHT = 390;

  const toggle = () => {
    if (!open) {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) {
        const roomBelow = window.innerHeight - rect.bottom;
        // Вверх раскрываем только если внизу не помещается И сверху
        // места действительно больше: иначе панель упрётся в шапку.
        setAbove(roomBelow < PANEL_HEIGHT && rect.top > roomBelow);
      }
    }
    setOpen((v) => !v);
  };

  const selected = useMemo(() => fromISO(value), [value]);
  const today = useMemo(() => startOfDay(new Date()), []);

  /* Показанный месяц: тот, где выбранная дата, иначе текущий. */
  const [view, setView] = useState(() => {
    const base = selected ?? today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  // Дату могли подставить снаружи — она приходит из ссылки на странице
  // тура. Тогда календарь должен открыться на её месяце, а не на текущем.
  useEffect(() => {
    if (selected) setView(new Date(selected.getFullYear(), selected.getMonth(), 1));
  }, [selected]);

  /*
   * Закрытие по клику мимо и по Escape.
   *
   * pointerdown, а не click: клик засчитывается только после отпускания
   * кнопки, и панель успевала перехватить его сама.
   */
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      // Возвращаем фокус на кнопку: иначе после закрытия он остаётся на
      // исчезнувшем элементе, и клавиатурная навигация начинается заново
      // с начала страницы.
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  /*
   * Неделя начинается с понедельника везде, кроме английской версии:
   * у английской аудитории привычно воскресенье, и сдвинутая сетка
   * читается как ошибка.
   */
  const weekStart = locale === "en" ? 0 : 1;

  /** Подписи дней недели на языке страницы. */
  const weekdays = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
    // 4 января 1970 — воскресенье; от него отсчитываем нужный порядок.
    return Array.from({ length: 7 }, (_, i) =>
      fmt.format(new Date(1970, 0, 4 + ((weekStart + i) % 7))),
    );
  }, [locale, weekStart]);

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(view),
    [locale, view],
  );

  const buttonLabel = useMemo(() => {
    if (!selected) return null;
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(selected);
  }, [locale, selected]);

  /** Ячейки месяца: пустые места до первого числа, затем сами дни. */
  const cells = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const lead = (first.getDay() - weekStart + 7) % 7;
    return [
      ...Array.from({ length: lead }, () => null),
      ...Array.from(
        { length: daysInMonth },
        (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1),
      ),
    ];
  }, [view, weekStart]);

  const pick = (d: Date) => {
    onChange(toISO(d));
    setOpen(false);
    triggerRef.current?.focus();
  };

  const shiftMonth = (delta: number) =>
    setView((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1));

  return (
    <div className="relative" ref={wrapRef}>
      <button
        id={id}
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`${className} flex items-center justify-between gap-2 text-left`}
      >
        {/* Пока дата не выбрана — подсказка тем же цветом, что placeholder
            соседних полей, а не значение. */}
        <span className={buttonLabel ? "text-ink" : "text-inkMuted/60"}>
          {buttonLabel ?? t("datePlaceholder")}
        </span>
        <LuCalendar className="h-[1.1rem] w-[1.1rem] shrink-0 text-inkMuted" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t("dateDialog")}
          aria-modal="false"
          className={`absolute left-0 z-20 w-[19rem] max-w-[calc(100vw-2rem)] rounded-xl border border-sand bg-white p-3 shadow-lg ${
            above ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label={t("datePrevMonth")}
              className="rounded-lg p-1.5 text-tile transition hover:bg-tileTint"
            >
              <LuChevronLeft className="h-4 w-4" />
            </button>
            {/* Первая буква месяца строчная в русском и туркменском —
                поднимаем её, иначе заголовок выглядит опиской. */}
            <span className="text-sm font-semibold text-tile first-letter:uppercase">
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label={t("dateNextMonth")}
              className="rounded-lg p-1.5 text-tile transition hover:bg-tileTint"
            >
              <LuChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {weekdays.map((w) => (
              <div
                key={w}
                className="pb-1 text-center text-xs font-medium text-inkMuted first-letter:uppercase"
              >
                {w}
              </div>
            ))}

            {cells.map((d, i) => {
              if (!d) return <div key={`blank-${i}`} />;

              // Уехавшую дату выезда выбрать нельзя — заявка на неё
              // бессмысленна, а понять это по пустому ответу оператора
              // человек не должен.
              const past = d < today;
              const isSelected = selected != null && sameDay(d, selected);
              const isToday = sameDay(d, today);

              return (
                <button
                  key={toISO(d)}
                  type="button"
                  disabled={past}
                  onClick={() => pick(d)}
                  aria-current={isToday ? "date" : undefined}
                  className={`h-9 rounded-lg text-sm transition ${
                    isSelected
                      ? "bg-tile font-semibold text-white"
                      : past
                        ? "cursor-not-allowed text-inkMuted/35"
                        : isToday
                          ? "font-semibold text-tile ring-1 ring-inset ring-tileLight hover:bg-tileTint"
                          : "text-ink hover:bg-tileTint"
                  }`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>

          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
                triggerRef.current?.focus();
              }}
              className="mt-2 w-full rounded-lg py-1.5 text-xs text-inkMuted transition hover:bg-sandLight hover:text-ink"
            >
              {t("dateClear")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
