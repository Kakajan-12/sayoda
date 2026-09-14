"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";

/**
 * Выпадающий список с галочками: можно отметить сразу несколько значений.
 *
 * Отличается от обычного Dropdown не только видом. Там выбор одного значения
 * закрывает список, здесь — нет: смысл галочек в том, чтобы отметить подряд
 * два-три варианта, и закрытие после каждого сводило бы это на нет.
 *
 * Разметка — listbox с aria-multiselectable. Фокус остаётся на кнопке,
 * подсвеченный пункт передаётся через aria-activedescendant: диктор объявляет
 * варианты, не теряя точку возврата. Состояние каждой строки — в
 * aria-selected, поэтому отдельные input[type=checkbox] не нужны, галочка
 * рисуется как часть строки.
 *
 * Клавиатура: пробел, ввод и стрелка вниз открывают, стрелки двигают,
 * пробел и ввод переключают отметку не закрывая, Esc закрывает, Home и End
 * прыгают к краям.
 */

export interface MultiSelectOption {
  value: string;
  label: string;
}

export default function MultiSelect({
  label,
  emptyLabel,
  values,
  options,
  onChange,
}: {
  /** Подпись для экранного диктора: видимого заголовка у фильтров нет. */
  label: string;
  /** Что написано на кнопке, пока ничего не отмечено: «Все типы». */
  emptyLabel: string;
  values: string[];
  options: MultiSelectOption[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  const selected = options.filter((o) => values.includes(o.value));

  /*
   * Что написано на кнопке.
   *
   * Одно значение — само название. Несколько — первое и сколько ещё:
   * перечислять все нельзя, кнопка в ряду фильтров узкая, а «Выбрано: 3»
   * не говорит, что именно выбрано.
   */
  const buttonLabel =
    selected.length === 0
      ? emptyLabel
      : selected.length === 1
        ? selected[0].label
        : `${selected[0].label} +${selected.length - 1}`;

  // Клик мимо и уход фокуса закрывают перечень. Слушаем на этапе всплытия
  // документа, чтобы не мешать собственным обработчикам внутри.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [open]);

  // Подсвеченный пункт держим в поле зрения: список прокручиваемый,
  // и при переборе стрелками выделение уезжало бы за край.
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.children[highlighted] as HTMLElement | undefined;
    node?.scrollIntoView({ block: "nearest" });
  }, [open, highlighted]);

  const toggle = (value: string) => {
    onChange(
      values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value],
    );
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted(0);
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setHighlighted(0);
        break;
      case "End":
        e.preventDefault();
        setHighlighted(options.length - 1);
        break;
      case "Enter":
      case " ":
        // Список остаётся открытым: отмечают обычно не одно значение.
        e.preventDefault();
        toggle(options[highlighted].value);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={boxRef} className="relative w-full lg:min-w-0 lg:flex-1">
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-activedescendant={open ? `${id}-${highlighted}` : undefined}
        onClick={() => {
          setHighlighted(0);
          setOpen((v) => !v);
        }}
        onKeyDown={onKeyDown}
        className={`${QuicksandFont.className} flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-4 py-2.5 text-left text-sm outline-hidden transition ${
          open ? "border-tileLight" : "border-sand hover:border-tileLight/60"
        } ${selected.length ? "text-tile" : "text-ink"}`}
      >
        <span className="min-w-0 truncate">{buttonLabel}</span>
        <FiChevronDown
          aria-hidden
          className={`h-4 w-4 shrink-0 text-inkMuted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={label}
          aria-multiselectable
          tabIndex={-1}
          className={`${QuicksandFont.className} absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-sand bg-white py-1 shadow-lg`}
        >
          {options.map((option, index) => {
            const isSelected = values.includes(option.value);
            return (
              <li
                key={option.value}
                id={`${id}-${index}`}
                role="option"
                aria-selected={isSelected}
                // Список не получает фокус, поэтому наведение мыши двигает
                // подсветку — иначе курсор и клавиатура спорили бы за неё.
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => toggle(option.value)}
                className={`flex cursor-pointer items-center gap-3 px-4 py-2 text-sm transition-colors ${
                  index === highlighted ? "bg-tileTint" : ""
                } ${isSelected ? "text-tile" : "text-ink"}`}
              >
                {/* Квадратик рисуем сами, а не ставим input: настоящий
                    checkbox внутри option сбивает диктора — он объявил бы
                    два элемента управления вместо одного пункта списка.
                    Состояние уже передано через aria-selected. */}
                <span
                  aria-hidden
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                    isSelected ? "border-tile bg-tile text-white" : "border-sand"
                  }`}
                >
                  {isSelected && <FiCheck className="h-3 w-3" />}
                </span>
                <span className="min-w-0 truncate">{option.label}</span>
              </li>
            );
          })}
        </ul>
      )}

      {/* Подпись для форм и автотестов: у кнопки нет видимого заголовка,
          а имя поля должно попадать в доступное дерево. */}
      <span className={`${PoppinFont.className} sr-only`}>{label}</span>
    </div>
  );
}
