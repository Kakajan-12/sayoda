"use client";

import { useEffect, useId, useRef, type MouseEvent } from "react";
import { HiCheckCircle, HiExclamationTriangle, HiOutlineXMark } from "react-icons/hi2";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Окно отправки формы: отправляем — отправлено — не ушло.
 *
 * Раньше результат показывался строчкой под кнопкой. У формы заявки
 * одиннадцать полей, и эта строчка появлялась ниже сгиба: человек нажимал
 * «Отправить», ничего не происходило, и он нажимал ещё раз. Окно поверх
 * страницы не даёт промахнуться мимо ответа.
 *
 * Три состояния в одном компоненте, а не три окна: переход между ними
 * должен быть сменой содержимого в уже открытом окне, иначе оно мигнёт и
 * появится заново.
 */

export type SubmitStatus = "idle" | "sending" | "success" | "error";

export default function SubmitStatusModal({
  status,
  onClose,
  sendingTitle,
  sendingMessage,
  successTitle,
  successMessage,
  errorTitle,
  errorMessage,
  closeLabel,
  retryLabel,
}: {
  status: SubmitStatus;
  onClose: () => void;
  sendingTitle: string;
  sendingMessage: string;
  successTitle: string;
  successMessage: string;
  errorTitle: string;
  errorMessage: string;
  closeLabel: string;
  retryLabel: string;
}) {
  const headingId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  const open = status !== "idle";
  // Пока письмо уходит, закрывать нечего: запрос уже в пути, и окно —
  // единственное место, где видно, чем он кончился.
  const closable = status === "success" || status === "error";

  // Esc закрывает, но только когда есть что закрывать.
  useEffect(() => {
    if (!closable) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closable, onClose]);

  // Фокус переезжает на кнопку, как только окно становится закрываемым:
  // иначе он остаётся на кнопке отправки под окном, и Tab уводит гулять
  // по форме за спиной у диалога.
  useEffect(() => {
    if (closable) closeRef.current?.focus();
  }, [closable]);

  const заголовок =
    status === "sending" ? sendingTitle : status === "success" ? successTitle : errorTitle;
  const текст =
    status === "sending" ? sendingMessage : status === "success" ? successMessage : errorMessage;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={closable ? onClose : undefined}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role={status === "error" ? "alertdialog" : "dialog"}
            aria-modal="true"
            aria-labelledby={headingId}
            // Пока идёт отправка, диктор должен объявить смену состояния сам:
            // фокус в это время никуда не переносится.
            aria-live="polite"
            aria-busy={status === "sending"}
            className="relative w-full max-w-md rounded-2xl bg-white px-8 py-10 text-center shadow-xl"
            onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {closable && (
              <button
                ref={closeRef}
                type="button"
                aria-label={closeLabel}
                onClick={onClose}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <HiOutlineXMark className="size-5" />
              </button>
            )}

            <div
              className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${
                status === "success"
                  ? "bg-green-100"
                  : status === "error"
                    ? "bg-brick/10"
                    : "bg-tileTint"
              }`}
            >
              {status === "sending" && (
                <span
                  aria-hidden
                  className="size-10 animate-spin rounded-full border-4 border-tile/20 border-t-tile"
                />
              )}
              {status === "success" && <HiCheckCircle className="size-12 text-green-600" />}
              {status === "error" && (
                <HiExclamationTriangle className="size-11 text-brick" />
              )}
            </div>

            <h3 id={headingId} className="mb-2 text-xl font-bold text-gray-900 lg:text-2xl">
              {заголовок}
            </h3>
            <p className={`text-sm text-gray-600 lg:text-base ${closable ? "mb-8" : ""}`}>
              {текст}
            </p>

            {closable && (
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-sm bg-tile py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-tile/80"
              >
                {/* После ошибки кнопка возвращает к форме, чтобы поправить и
                    отправить снова, — «Закрыть» тут звучало бы как отказ. */}
                {status === "error" ? retryLabel : closeLabel}
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
