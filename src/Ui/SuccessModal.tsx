"use client";

import { useId, type MouseEvent } from "react";
import { HiCheckCircle, HiOutlineXMark } from "react-icons/hi2";
import { AnimatePresence, motion } from "framer-motion";

type SuccessModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  closeLabel: string;
  titleId?: string;
  showActionButton?: boolean;
};

export default function SuccessModal({
  open,
  onClose,
  title,
  message,
  closeLabel,
  titleId,
  showActionButton = true,
}: SuccessModalProps) {
  const generatedId = useId();
  const headingId = titleId ?? generatedId;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            className="relative w-full max-w-md rounded-2xl bg-white px-8 py-10 text-center shadow-xl"
            onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label={closeLabel}
              onClick={onClose}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              <HiOutlineXMark className="size-5" />
            </button>

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <HiCheckCircle className="size-12 text-green-600" />
            </div>

            <h3
              id={headingId}
              className="mb-2 text-xl font-bold text-gray-900 lg:text-2xl"
            >
              {title}
            </h3>
            <p
              className={`text-sm text-gray-600 lg:text-base ${showActionButton ? "mb-8" : ""}`}
            >
              {message}
            </p>

            {showActionButton && (
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded bg-[#073fa1] py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#073fa1]/80"
              >
                {closeLabel}
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
