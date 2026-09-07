"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import { PoppinFont, QuicksandFont } from "@/components/ui/Fonts";

/**
 * Выпадающий список вместо нативного select.
 *
 * У select можно оформить только саму кнопку: раскрывающийся перечень
 * рисует операционная система, и <option> не поддаётся ни шрифту, ни цвету,
 * ни скруглению. Поэтому на сайте с собственной палитрой он выглядел чужим,
 * а в разных браузерах ещё и по-разному.
 *
 * Разметка следует шаблону listbox: кнопка с aria-haspopup и перечень с
 * role="listbox". Фокус остаётся на кнопке, а подсвеченный пункт передаётся
 * через aria-activedescendant — так экранный диктор объявляет варианты, не
 * теряя точку возврата.
 *
 * Клавиатура: пробел, ввод и стрелка вниз открывают, стрелки двигают,
 * ввод выбирает, Esc закрывает, Home и End прыгают к краям.
 */

export interface DropdownOption {
  /** Пустая строка — вариант «все», сбрасывающий фильтр. */
  value: string;
  label: string;
}

export default function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  /** Подпись для экранного диктора: видимого заголовка у фильтров нет. */
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const selected = options[selectedIndex];

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

  const openList = () => {
    setHighlighted(selectedIndex);
    setOpen(true);
  };

  const choose = (index: number) => {
    onChange(options[index].value);
    setOpen(false);
    // Возвращаем фокус на кнопку: иначе после выбора он повисает в никуда
    // и следующий Tab начинает обход страницы сначала.
    buttonRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        openList();
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setOpen(false);
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
        e.preventDefault();
        choose(highlighted);
        break;
      case "Tab":
        // Уход по Tab — это отказ от выбора, а не выбор подсвеченного
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
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`${QuicksandFont.className} flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-4 py-2.5 text-left text-sm text-ink outline-none transition ${
          open ? "border-tileLight" : "border-sand hover:border-tileLight/60"
        }`}
      >
        <span className="min-w-0 truncate">{selected?.label}</span>
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
          tabIndex={-1}
          className={`${QuicksandFont.className} absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-sand bg-white py-1 shadow-lg`}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                id={`${id}-${index}`}
                role="option"
                aria-selected={isSelected}
                // Список не получает фокус, поэтому наведение мыши двигает
                // подсветку — иначе курсор и клавиатура спорили бы за неё.
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => choose(index)}
                className={`flex cursor-pointer items-center justify-between gap-2 px-4 py-2 text-sm transition-colors ${
                  index === highlighted ? "bg-tileTint" : ""
                } ${isSelected ? "text-tile" : "text-ink"}`}
              >
                <span className="min-w-0 truncate">{option.label}</span>
                {isSelected && (
                  <FiCheck aria-hidden className="h-4 w-4 shrink-0 text-tile" />
                )}
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
