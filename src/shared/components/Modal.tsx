// MODAL COMPONENT - Reusable modal with focus management

import { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal = ({
  isOpen,
  children,
  maxWidth = "max-w-md",
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const isCoarsePointer =
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(pointer: coarse)").matches;
      if (isCoarsePointer) return;

      const firstInput = modalRef.current?.querySelector<HTMLElement>(
        "input, textarea, button",
      );
      firstInput?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        const closeButton = modalRef.current?.querySelector<HTMLElement>(
          '[aria-label="Close modal"]',
        );
        closeButton?.click();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] bg-black/60 backdrop-blur-sm">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className={`bg-(--color-bg) border border-(--color-border) rounded-2xl shadow-2xl ${maxWidth} w-full max-h-[90dvh] overflow-hidden flex flex-col`}
      >
        {children}
      </div>
    </div>
  );
};
